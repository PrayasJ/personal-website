# GSoC - Week 6

---

Hey everyone!

Don't worry, I won't be saying anything weird this time around.

I will be *very very very* professional.

~~How does a computer scientist order three beers? He holds up two fingers.~~

As I mentioned, proooofessional.

Today, we'll be discussing the implementation of the `fill_data` and `cast` functions in detail and what would speed it up.

## How does `fill_data` function works?

---

```r
fill_data <- function( ... ) {
    write_dataset_controls( ... )
    prep_rodents( ... )
    prep_moons( ... )
    prep_covariates( ... )
    prep_metadata( ... )
}
```

This is essentially the definition of the `fill_data` function, each of these functions that are called within it is independent of each other.

Each subsequent function uses the data fetched using `fill_raw` and prepares it using these functions.

The benefit of this is that during the prediction pipeline we wouldn't have to fetch the dataset each time a prediction is required. This would preprocess the data required before the prediction pipeline is executed.

## Applying Parallel Processing to `fill_data`

---

Since these functions are non-uniform in nature, we can not apply `mclapply` over them. The best case scenario would be to consider using `mcparallel` over them and assign each function to a different forked process.

In doing so, when the `fill_data` function is called, all 5 of these functions would start *asynchronously* and the `mccollect` function would wait for their completion.

Let us look at the implementation I went with,

```r
fill_data <- function( ..., multiprocess = FALSE ) {
    write_data_set_controls_f <- function() write_dataset_controls( ... )
    prep_rodents_f            <- function() prep_rodents( ... )
    prep_moons_f              <- function() prep_moons( ... )
    prep_covariates_f         <- function() prep_covariates( ... )
    prep_metadata_f           <- function()  prep_metadata( ... )
    if(multiprocess) {
    mccollect(list(
      mcparallel(write_data_set_controls_f()),
      mcparallel(prep_rodents_f()),
      mcparallel(prep_moons_f()),
      mcparallel(prep_covariates_f()),
      mcparallel(prep_metadata_f())
    ))
  } else {
    write_data_set_controls_f()
    prep_rodents_f()
    prep_moons_f()
    prep_covariates_f()
    prep_metadata_f()
  }
}
```

The idea behind using a boolean switch for multiprocessing is that we do not want to use multiprocessing by default given how taxing it is for the system.

```r
microbenchmark (
    linear={
        fill_data()
    }, 
    parallel={
        fill_data(multiprocess = TRUE)
    }, 
    times = 10
)
```

Let us look at its benchmark to verify if using it was actually beneficial or not.

```r
Unit: seconds
     expr      min       lq     mean   median       uq      max neval
   linear 36.35769 36.90474 37.36279 37.29853 37.82190 38.24213    10
 parallel 23.27265 23.92390 24.31403 24.34104 24.49902 25.86050    10
```

As evident from the benchmark, it has been optimised by a significant amount. 

## How does `cast` function works?

---

```r
cast <- function ( ... ) {
    ...
    models_scripts <- models_to_cast( ... )
    for (i in 1:nmodels) {
        ...
        run_status <- tryCatch(expr = source(model), ...)
        ...
    }
}
```

The `cast` function takes in a list of `models` it is going to use and the `end_moon` it is going to use as a timeframe.

Using those two parameters, it calls upon each model script sequentially.

## Applying Parallel Processing to `cast`

---

Applying `mclapply` over the `cast` would speed-up the process as a whole. Since each time the casting is initiated, all the chosen prediction models would start up in an *asynchronous* manner. It would also be great since the number of models that are present is 8 at max.

Let us take a look at the implementation of the `cast` function I came up with,

```r
cast <- function ( ..., multiprocess = FALSE ) {
    ...
    models_scripts <- models_to_cast( ... )
    model_f <- function(i) {
        ...
        run_status <- tryCatch(expr = source(model), ...)
        ...
    }
    if(multiprocessing) {
        models_list <- lapply(1:nmodels, function(i) {
            mcparallel(model_f(i))
        })
        mccollect(models_list)
    } else {
        for(i in 1:nmodels) {
            model_f(i)
        }
    }
}
```

In this implementation, I defined a function `model_f` which would use the `models_scripts` list as an input to choose which model to run. The index `i` is passed to this function to choose from `models_scripts.`

Similar to before, I used the `multiprocess` switch here in order to separate the parallel and sequential flow. In the parallel section of it, I used `mcparallel` and `mccollect` since the model functions aren't identical.

```r
microbenchmark(
    linear = {
        portalcast(models=c(
            "ESSS", 
            "AutoArima", 
            "NaiveArima", 
            "jags_RW", 
            "jags_logistic")
        )
    }, 
    parallel = {
        portalcast(models=c(
            "ESSS", 
            "AutoArima", 
            "NaiveArima", 
            "jags_RW", 
            "jags_logistic"
        ), multiprocess = TRUE)
    }, 
    times = 5
)
```

I set `times` in the benchmark to be 5. Since each iteration was taking a few minutes to execute, I chose not to use the `GARCH` models since they are very slow running models and the benchmarking would take an awful lot of time if I included them. (I'll probably test them out later).

```r
Unit: seconds
     expr      min       lq     mean   median       uq      max neval
   linear 152.9708 153.1507 154.3362 153.4887 154.5631 157.5076     5
 parallel 102.6891 103.0946 105.1487 104.3918 106.4742 109.0937     5
```

The benchmark results were promising, as shown below, with the runtime significantly reduced when the models were executed in parallel.

## Conclusion

---

There was one other area where I did try to implement parallel processing, and that was the `portalcast` function. However, that failed to execute ~~and resulted in a lot of system crashes~~ because the function basically iterates over a number of *moons* and then prepares data in the data directory we created using the `fill_data` function and calls upon the `cast` function for that specific *moon.*

What would happen if we were to call those specific *moons* *asynchronously*? All the threads would fight to write the data in our designated folder in the `fill_data` function. That's what led to the corruption of data and system crashes on my device.

Moving further, I would like to create different directories in the `fill_data` when called *asynchronously* so that they don't clash for the write access.

I still haven't tested the working of the modified `fill_data` and `cast` function together, so that is one thing that I am going to try!

Until then, over and out.

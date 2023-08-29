# GSoC - Week 4-5

---

Hey everyone!

It's story time!

...

Not really, I'll just be blurting out my thoughts. ~~Please don't judge me. I am sensitive.~~

Phase I began last week, so let us catch up with my understanding of parallel processing in R.

Today I'll be talking about the `parallel` package in `R` and its aspects that I intend to use, and have used.

But before diving into it, let me just say it has been too hot where I live. Can we please dial down the sun a bit? Okay, now onto the `parallel` package now.

## Parallel Processing in R

---

Parallel processing in R is as simple as *"OK Google, how do I Parallel Process in R"*.

The `parallel` package that comes with `R` with its installation has an arsenal of functions to allow us to perform tasks in parallel by allocating cores.

The specific functions that I would like to talk about today are:

1. `mclapply` 

2. `mcparallel`

3. `mccollect`

These three functions are what I would be using during the course of my project. So let us understand these functions better.

### How does `mclapply` work?

---

Before understanding how `mclapply` works, let's understand how `lapply` works. For that, let's go over a code snippet,

```r
nums <- 1:100

square_function <- function(num) {
    num^2
}

lapply(nums, square_function)
```

The code above would apply the `square_function` over each element within our input vector *sequentially.*

The function `mclapply` is just the parallelized version of `lapply` and it functions similarly except that it breaks down each function call into different *cores.*

Before moving forward, I'll also be talking about this great `R` package called `microbenchmark`. It is used for benchmarking a code expression or function over a specified number of times and giving a statistical analysis of its runtime. It can also be used to compare multiple different expressions, and I'll be using it throughout this project so as to validate my progress.

Let us compare `lapply` and `mclapply` over our `square_function`,

```r
nums <- 1:100

square_function <- function(num) {
    num^2
}

microbenchmark (
    linear={
        lapply(nums, square_function)
    },
    parallel={
        mclapply(nums, square_function, mc.cores = detectCores())
    },
    times = 10
)
```

Running this code would actually show how meaningless parallel processing is sometimes. Sometimes the subsequent steps in a process that we are breaking down take very little time, and the sum of all those little bits of time is what we are trying to reduce. In the above example, `square_function` would take a negligible amount of time for execution. However, to create a forked instance for each call to that function would take far more time than the execution itself.

The benchmark for that code snippet is this,

```r
Unit: microseconds
     expr       min        lq      mean    median       uq      max neval
   linear    85.932   258.255  2717.796   290.004   399.40 24470.20    10
 parallel 21196.759 24951.803 31882.268 31043.664 40506.15 43723.37    10
```

It is evident how using parallel processing made it significantly slower.

Let's take a look at another example. We'll just make the `square_function` slower by making it wait on each iteration,

```r
nums <- 1:100

square_function <- function(num) {
    Sys.sleep(0.01)
    num^2
}

microbenchmark (
    linear={
        lapply(nums, square_function)
    },
    parallel={
        mclapply(nums, square_function, mc.cores = detectCores())
    },
    times = 10
)
```

Here, we'll be waiting for exactly 10 milliseconds for each iteration. Given how both these functions work, the `linear` section would take 10 milliseconds * 100 = 1000 milliseconds per benchmark session.

The parallel one would divide that task into the number of cores, so the time it would take would be 1000 milliseconds/number of cores.

Let's look at the benchmark,

```r
Unit: milliseconds
     expr       min        lq      mean    median        uq       max neval
   linear 1009.7515 1012.0629 1014.9652 1012.5889 1013.2837 1035.5319    10
 parallel  162.1411  163.6666  164.3484  164.1398  164.8817  168.1489    10
```

We can see at a glance that tasks that are time-consuming greatly benefit from the usage of `mclapply`. However, two things need to be considered,

1. The subtasks shouldn't be too fast as compared to thread creation,

2. The subtask shouldn't be exhaustive in nature towards the system resources. If the task in itself in its sequential order uses up all the resources present, it would only hamper its runtime if it is parallelized.

## How do `mcparallel` and `mccollect` work?

---

We already have `mclapply.` Why do we need `mcparallel` and `mccollect`?

It's great that you are reading along. ~~I feel a bit less lonely knowing you are here.~~

The issue with `mclapply` is the lack of control. It isn't made for the computation of different expressions; it is designed in a way to be applied over a list or a vector.

Consider a use case,

```r
f1 <- function(...) {
    ...
}
f2 <- function(...) {
    ...
}
...
f8 <- function(...) {
    ...
}
```

If we had eight different functions independent of each other and we had to place them in different forked threads during execution and wait for their overall result, we wouldn't be able to apply `mclapply` on them. ~~mcparallel and mccollect come in handy here.~~

Let us consider a simple code snippet with two functions that take a bit of time each. Let us benchmark their execution sequentially and in parallel,

```r
nums <- 1:100

square_function <- function(num) {
    Sys.sleep(0.01)
    num^2
}

cube_function <- function(num) {
    Sys.sleep(0.01)
    num^3
}

microbenchmark (
    linear={
        for(num in nums) {
            square_function(num)
            cube_function(num)
        }
    },
    parallel={
        for(num in nums) {
            square_mc <- mcparallel(square_function(num))
            cube_mc <- mcparallel(cube_function(num))
            mccollect(list(square_mc, cube_mc))
        }

    },
    times = 10
)
```

In the above code, in the linear section for each number, we sequentially executed the `square_function` and `cube_function`, but in the case of the parallel section, both `square_function` and `cube_function` are set up as parallel jobs using `mcparallel`, and at the end of each iteration, they are both executed within `mccollect`. `mccollect` would wait for the execution of all the jobs it has been provided with and then continue the execution of the `for` loop.

The difference between the two is that it executes only two expressions in different threads, and therefore we have more control over what processes to fork.

The runtime between these two differs, but it doesn't differ as much as we would expect it to,

```r
Unit: seconds
     expr      min       lq     mean   median       uq     max neval
   linear 2.024918 2.026880 2.029323 2.027688 2.031290 2.03711    10
 parallel 1.545530 1.575146 1.609938 1.602145 1.651473 1.68698    10
```

Another way of optimising it further if the number of subtasks is small (2 in this case) is to just make it work as `mclapply` would. Here we would try to replicate what `mclapply` does using `mcparallel` and `mccollect`. However, the benefit of `mcparallel` here would be that the *jobs* that we are executing in parallel aren't uniform or similar to each other, whereas `mclapply` requires the functions to be identical to be executed.

```r
nums <- 1:100

square_function <- function(num) {
    Sys.sleep(0.01)
    num^2
}

cube_function <- function(num) {
    Sys.sleep(0.01)
    num^3
}

microbenchmark (
    linear={
        for(num in nums) {
            square_function(num)
            cube_function(num)
        }
    },
    parallel={
        square_mc <- lapply(nums, function(num) {
            mcparallel(square_function(num))
        })
        cube_mc <- lapply(nums, function(num) {
            mcparallel(cube_function()(num))
        })
        mccollect(append(square_mc, cube_mc))

    },
    parallel2={
        mclapply(nums, function(num) {
            square_function(num)
            cube_function(num)
        })
    },
    times = 10
)
```

We get the following benchmark statistics, as it is evident that `mcparallel` does perform better in such situations.

```r
Unit: milliseconds
      expr       min       lq      mean    median       uq       max neval
    linear 2022.9803 2023.324 2027.3530 2024.9967 2028.626 2037.8224    10
  parallel  386.9734  388.007  436.6836  429.4614  489.939  503.0412    10
 parallel2 1016.2709 1017.830 1020.2130 1020.3503 1021.776 1025.8029    10
```

As a side-note to the whole shenanigan, all three of `mclapply`, `mcparallel`, and `mccollect` work using the low-level function `mcfork`, which creates forked instances of the `R` process. `mcfork` isn't supported on Windows, so just a heads up.

## Conclusion

---

We now have our tools defined for the project, as well as the areas in which we will use them, and I will be implementing the methods I discussed today into the codebase. ~~Oh boy, it would be a fun experience.~~

Until next time, stay frosty. I'll go eat my soup with my `mcspoon` (lol).

🚶🚶🚶

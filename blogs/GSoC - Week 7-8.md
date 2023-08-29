# GSoC Week 7-8

---

Hey everyone!

[~~Ah shit, here we go again~~](https://knowyourmeme.com/memes/ah-shit-here-we-go-again)

I hope you aren't getting tired of this journey (we still have treasures to plunder!). We need to sail the good ol' seas aye?

~~One of these days my shipmates are going to stab me 23 times and all I will say is "Et tu Luffy." Okay,~~

enough of my mumble-jumble.

Today, I'll walk you through two major changes that I made in my quest to add parallelism to our code,

1. Made `fill_data` even more parallel!

2. Added support for non-unix platforms.

## Why parallelize `fill_data` further?

---

`fill_data` is the function that is called upon each time we switch between *moons* or *models*. In order to prepare the data for each iteration of our prediction schema, we call upon `fill_data`. So, if we were predicting for 3 moons using 3 models, `fill_data` would be called upon 3 x 3 = 9 times!

So any small change in that would result in a significant time difference in overall usage.

Apart from that, a large chunk of total time consumption is caused by the function `fill_data`, so that is my primary concern right now.

## Areas of interest in `fill_data`

---

The function `fill_data` calls upon 5 functions to prepare the data directory, which are,

1. `write_dataset_controls`,

2. `prep_rodents`,

3. `prep_moons`,

4. `prep_covariates`,

5. `prep_metadata`

Now, out of these, only `write_dataset_controls`, `prep_rodents`, and `prep_covariates` consume any significant amount of time since they have loops within them, taking their time complexity to O(N).

We'll be applying our implementation similar to our previous usage of `mclapply` onto them. I won't get into details of how they were done since they are identical to our previous usage.

## Pitch-forks against Windows 😡

---

Okay, I hate to be the bearer of bad news, but I am the only bearer of any kind of news, so let's just get over it.

**Windows does not support forking processes.**

That single statement just encapsulates my anger at how different processes aren't allowed to communicate with each other in windows.

Consider a process A, which is computing something. Now we need to perform another set of functions within the same program but as a different process. The reason would be to keep that function "parallel" to our current process A. Let's call this new process B. We *fork* our program into a *main process* A and a *child process* B.

The processes A and B would both have access to the variables and states of the program and that is a very useful addition since we can manipulate the program from different processes in real-time. Windows, however, can not call upon this `fork-exec` model.

In the forking approach, copies of the entire current version of R are created in a new core.

The alternative to this offered by the `parallel` package in `R` is to create `clusters`.

`clusters` are basically entirely new programs run separate from the parent program. They do not follow the `fork-exec` model; rather, they create complete versions of the parent program on the new core and then connect them via networking.

Consider them in terms of a game server and its clients. The server and its clients constantly "poll" each other to exchange information in a `websocket` protocol.

Using `clusters` works in a similar manner, and this approach is considered to be *socket*approach.

Managing *sockets* is more complicated than forked processes since you have to consider how their response is actually independent of the parent process. **However, using *sockets* is far slower than using *forking*.**

## Applying Socket approach

---

Getting straight down to business: first and foremost, how do I differentiate between a `unix` and `windows` system?

The answer is simple,

`R` has this object  `.Platform` which stores the information regarding which *platform* it is being executed on (kind of intuitive). So each time a *casting* is initiated, I look up the value of `.Platform$OS.type` since it can only have two values `unix` and `windows` and further down each helper function, the value of `multiprocess` could be one of the three,

1. `unix`, signifying that forking is to be used,

2. `windows`, signifying that sockets are to be used,

3. `FALSE`, signifying that execution on a single core is to be done.

Let us consider our implementation of `mcparallel` in  the `cast` function,

```r
models_list <- lapply(1:nmodels, function(i) {
    mcparallel(model_f(i))
})

mccollect(models_list)
```

This is how we call upon the forked processes, right?

Now, in order to attain a similar execution flow using sockets, we use the following method,

```r
clusters <- makeCluster(detectCores() - 1, outfile = "")

clusterExport(
    cl=clusters, 
    varlist=c('models_scripts'), 
    envir=environment()
)

parLapply(clusters, 1:nmodels, function(i) {
    model_f(i)
})

stopCluster(clusters)
```

Now it's education time! (fun. I know, right? no?).

First, we create clusters using `makeCluster`, i.e., cores that we would like to utilise for our new processes.

For being on a safe side, I have set the number of cores to use as `detectCores() - 1` since its a good practice to keep a core free in situations where the system is being used and doesn't have any free resources available. What would happen in such a situation? The system would obviously crash haha. (That is a very pain-ridden laugh).

Secondly, since we are creating "new" processes, their function and variable declarations would be intact; it's just that the value of those said variables would be set to default. So in order to share the parent process' variables with the child processes, we use `clusterExport` to export our vector or list of variables onto our selected clusters.

Thirdly, similar to how `mclapply` was a forked approach to our native `lapply`, `parLapply` is a socket based approach to the `lapply` function. It spins up our apply calls on different sockets and waits for the completion of it all.

Finally, after the complete execution of our socket based computation, we need to manually stop those clusters since they are oblivious to the world (most children are, sadly). We do that using the `stopCluster` function.

This, however, shouldn't be considered a complete stoppage of them. This just stops their execution. Dead *processes* of R still remain in the system. No worries, though, these *zombies* do not consume any resources.

Now let us compare the benchmark performance for windows with unix and non-parallel methods,

```r
Unit: seconds
    expr      min       lq     mean   median       uq      max neval
  linear 77.90343 83.19043 85.13469 86.03467 88.23663 90.30831     5
 windows 69.21888 71.19202 72.29011 72.68580 74.00502 74.34884     5
    unix 54.04063 54.27428 57.15926 54.32787 60.84567 62.30782     5
```

As can be seen, Unix performs 50% faster than the average, whereas Windows performs 20% faster. This is due to the fact that they use `sockets` to communicate with each other by `poling`, so it takes a bit longer amount of time as compared to making system calls to the same process using the `fork-exec` method.

## Conclusion

---

I am still unsatisfied with the percentage of time reduced since 50% reduction isn't a great enough feat when it comes to parallel processing. The key reason for this is that they are still essentially calling upon the same directory even in the parallel schema of things. An issue arises from this is that we cannot completely make them independent of each other since they all depend on the current state of that one directory.

However, creating duplicate directories for each *forked* process would create an unnecessarily large number of data repositories, which, honestly, we don't want.

I'll be looking into a solution for this next time!

Till then, it's a wrap-up for the first phase of GSoC evaluation :)

Have a great day!

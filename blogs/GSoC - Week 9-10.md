## GSoC Week 9-10

---

Hey everyone!

Today we'll talk about how not all risks are successful and go over a few weeks of failed attempts.

As I previously stated, the performance increase in portalcasting after the parallelisation is twofolds (atleast on my device), and to verify and enhance that I took upon two roads (in parallel, haha). They were:

1. Trying to parallelize `cast` function (which I have previously failed to do so),

2. Testing my implementation onto a high-powered system.

Let's begin talking about how these two went.

## Why does `cast` function keep on failing?

---

Whenever I try to run `cast` function in parallel, all the models start failing up when they try to predict the population, and they end up displaying this disheartening message.

```bash
  |----| ESSS failed |----|
  |----| ESSS failed |----|
  |----| ESSS failed |----|
  |----| ESSS failed |----|
  |----| AutoArima failed |----|
  |----| AutoArima failed |----|
  |----| AutoArima failed |----|
  |----| AutoArima failed |----|
  |----| AutoArima failed |----|
  |----| AutoArima failed |----|
```

For a few days I kept hitting around the bush trying to figure out what could have broken so as to prevent any model from working and eventually came around to one section of the code in the `cast` function, 

```r
 messageq(message_break(), "\nReadying data for forecast origin newmoon ", 
     end_moon, "\n", message_break(), quiet = quiet)
  if (end_moon != last_moon) {
    fill_data(main     = main, 
              datasets = datasets,
              models   = models,
              settings = settings,
              quiet    = quiet, 
              verbose  = verbose)
  }
```

In the code above, the directory having the data for the models to use is being reset after *iterating each `moon`*.  If done in sequential order reseting each time a model is run makes a sensible decision so as to prepare it for the next moon, but given how my current task is to speed up the process by parallelisation, reseting the directory causes a major data corruption of the data directory. Let's  break it down into steps to understand it better.

Let us say our current cycle of code is trying to run three `models` ***M1***, ***M2*** and ***M3*** over two `moons` ***T1*** and ***T2***. 

In the scenario where ***T1*** and ***T2*** are serialised, 

1. ***T1*** begins to run ***M1***, ***M2*** and ***M3***, irrespective of method of how they are executed be it serialised or parallel, they would be using the same input directory.

2. Upon completion of ***T1***, `fill_data` function is called upon and the directory is reset to support the new `moon`.

3. ***T2*** begins the same process with ***M1***, ***M2*** and ***M3***. 

In this scenario, things work as intended and both ***T1*** and ***T2*** are executed in series. Moving onto our case, what if ***T1*** and ***T2*** are parallelised?

In this scenario let us assume ***T1*** is faster than ***T2***, then,

1. ***T1*** and ***T2*** begin to run ***M1***, ***M2*** and ***M3*** simultaneously,

2. ***T1*** completes its execution of the models,

3. The data directory is *partly* in **deadlock** due to ***T2*** executing the models using the data present within the data directory,

4. ***T1*** tries to reset the directory after its execution however ***T2*** has some files in a state of **deadlock** due to which the data directory is partly reset.

5. In the next iteration of computation, the data directory is to be considered as corrupted due to this.

This is what I discovered after parallelising the `cast` function. In order to parallelise it, we need to make some architectural changes to how things are being handled and that would be difficult since the data directory acts as the backbone to all the essential functionality within the ***Portalcasting*** codebase.

All the things that I just mentioned are a bit hypothetical due to the nature of how parallel computation works. This kind of a *bug* is referred to as a [*Heisenbug*](https://en.wikipedia.org/wiki/Heisenbug#:~:text=In%20computer%20programming%20jargon%2C%20a,one%20attempts%20to%20study%20it.), therefore it has been difficult for me to track it down. Since parallelising `cast` function does work a number of times but in some extensive cases, it fails entirely.

## Testing onto a high-powered Server

---

Moving onto the performance issue, since a parallelised project is scallable proportionally to the device it is running on, it would be a great idea to test it all out on a server (atleast that's what I thought). Discussing it with my GSoC mentor, Henry, he provided me with the access to the server ***Portalcasting*** was currently being run on. Apart from that he explained to me how to run the project on the server. The catch being that the execution time of a process could potentially be in hours so it is ideal to create a detachable instance of the process.

To achieve this task, a teminal multiplexer, `tmux` was used. The term sounds fancy but all in all, `tmux` provides a user with the ability to *create* multiple sessions within the same terminal. 

Let's just drop some `tmux` commands here in case someone needs them:

1. To show all the active sessions: `tmux ls`

2. To create new sessions: `tmux new -t <session-name>`

3. To attach to created sessions: `tmux attach-session -t <session-name>`

Moving on ahead, on the server, I used my previously explained [test file](https://github.com/PrayasJ/portalcasting/blob/multi-process/parallel.md) to test my set of code out. 

```r
library(microbenchmark)
library(portalcasting)

main <- "~/portalcast_directory_test"
models <- c("ESSS", "AutoArima")
end_moons <- 520:525

setup_production(main = main)

microbenchmark(
        linear = {
                portalcast(
                    main = main, 
                    models=models, 
                    end_moons = end_moons
                )
        },
        windows = {
                portalcast(
                    main = main, 
                    models=models, 
                    end_moons = end_moons, 
                    multiprocess = 'windows'
                )
        },
        unix = {
                portalcast(
                    main = main, 
                    models=models, 
                    end_moons = end_moons, 
                    multiprocess = 'unix'
                )
        },
        times = 1
)
```

Simply running `Rscript parallel-test.R | tee parallel-test.log` allowed me to run the complete test and pipe the output to a log file while detaching the session using `tmux`. This workflow for testing out my code has been a great help in order to figure out multiple issues in my implementation.

There is however one task still lurking around that I need to figure out and implement in order to complete my GSoC project that is to write a test file which would allow any developer to verify the working of parallelism of the project objectively.

## Conclusion

---

These couple of weeks have been harsh due to these unexpected bugs and the nature of these bugs. I would have preferred it to work out in a single go but I'll keep on thinking of ways to optimise it further. Apart from that I believe the test file that I have written down would suffice as a test file to compare the functionality of the parallelism of the code. 

I will be documenting my code and that would mark as the completion of my work for this project, I learnt a lot through the course of this project and am thankful for this opportunity.

Have a good day reader, thanks for making it to the end of this blogpost.

Cya.

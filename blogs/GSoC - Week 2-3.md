# GSoC-Week 2-3

---

Hey everyone! I hope none of you are experiencing any syntax errors in your lives.

Let us consider this project as an extremely dangerous and high-stakes top secret mission. (I have been watching Spy x Family. My bad.)

What does a mission require to be executed perfectly?

*~~"Think Mark, Think."~~*

You: "A solid plan?"

Me: "Bingo! You are a very smart person. ~~Lend me your brain.~~ "

## Understanding the Workflow

---

Working on a complex project, it is ideal to go over your plan of execution, think about your impact areas, particular functions, data models (if any), and flow of the programme that you are going to create or modify.

There is another approach to development, which is choosing ***one*** feature to implement and then implementing it again by choosing yet another feature. However, I particularly am not fond of this approach, considering two things:

1. You cannot be sure of how long it will take to implement the whole project. Therefore, you cannot set a deadline for your work.

2. Most complex projects, and sometimes even simpler projects, have functions you write that depend on another set of functions you write. The problem is created when you are required to go back and forth between these functions in order to make them support the new changes. With planning things before-hand, you'll be aware of the ***scope*** of that particular set of code.

## Deciding the Scope of the Project

---

The project is aimed at optimising the current Portalcasting codebase. Currently, every subtask present within the pipe to predict the rodent population is performed in a sequential order.

That basically means a subtask is required to wait before its previous task has completed execution. This is referred to as ***synchronous*** programming.

This brings about a problem, an embarassing one at that. It is called the **embarrassingly parallel problem**, which entails that very little effort is needed to separate the said problem into separate and independent parts.

Through the course of this project, it is my goal to break this project down into multiple segments and apply parallel processing over those segments.

Currently, to my knowledge, the pipeline for the predictions is as follows:

1. **Setup Directory** This particular step is aimed at setting up a directory for the purpose of forecasting. There are two ways to create the environment for usage: `setup_production` and `setup_sandbox`. These are executed only once to set up the working environment and do not need to be run every time we need to predict. Both these methods are virtually the same for the sake of this project of ours. Essentially, they both utilise the `setup_dir` function to create a directory (using the `create_dir` function) and then fill that directory (using the `fill_dir` function).
   
   The `create_dir` function essentially takes a very small amount of time (a few milliiseconds) considering its task is to generate all the required filepaths that are going to be filled. There would be no benefit to parallelizing this process because each instance of a subprocess requires resources to be created, and thus the amount of resources they would require would be greater than when directories are created sequentially.
   
   The `fill_dir` function calls upon six basic functions for filling data:
   
   1. `fill_raw`, which fetches resources such as observations, directory archies, and climate forecasts;
   
   2. `fill_casts`, which prepares the forecast data from the raw data;
   
   3. `fill_fits`, which prepares model fits from the raw data;
   
   4. `fill_data`, which prepares dataset controls, rodent datasets, temporal data, covariates, and metadata;
   
   5. `write_model_controls`, which prepares controls for the models and stores them in yaml;
   
   6. `fill_models`, which prepares the scripts for the supported prediction models.

This gives us our first area where we can separate these six functions and apply parallel processing to them. They, within themselves, can be further broken down, and we will discuss that later.

2.  **Models for Portal Rodents,** In order to forecast the rodent population, we use the function `portalcast` with the parameters:
   
   `main` for the directory created with `fill_dir`;
   
   `models` as a vector of model names to be forcasted using;
   
   `datasets` as a vector of dataset names to be created,
   
   => end_moons is an integer that represents the last new moon number, and start_moon is an integer that represents the first new moon number.
   
   These are all the relevant parameters that we need to consider during our research task.
   
   Breaking down this function further, it first computes the number of *moons* it has to predict the population for and then sequentially calls the `cast` function for each *moon* in the range `[start_moon... end_moons].`
   
   This is one of the areas where we could think of applying multiprocessing, but we do have to keep in mind that the number of *moons* might range in the hundreds and that might make the forked threads take a lot more time than the sequential method. cast

3. **function,**
   
   The cast function invokes the models_to_cast function and passes the vector list of model names to it. `models_to_cast` returns a vector of scripts for the respective prediction models.
   
   After the retrieval of the scripts, each script is sequentially executed. This is yet another area for multiprocessing that I would like to focus on.
   
   The reason for that is that, currently, Portalcasting uses eight models for the purpose of prediction:
   
   `AutoArima`, `NaiveArima`, `ESSS`, `nbGARCH`, `nbsGARCH`, `pevGARCH`, `simplexEDM`, `GPEDM`, `jags_RW,` and `jags_logistics.`
   
   We will go into the working of these at a later date.
   
   Breaking these apart and running them into different forked threads would result in a decrease in the total runtime of the prediction workflow.

## Bye?

---

For now, my aim would be to look at all the possible ways to implement multiprocessing on this project, and decide what part of the project to start doing that on. We have shortlisted three areas:

1. The setup process doesn't impact the prediction pipeline as such, but it would still be great to make that faster.

2. Moons could be iterated in parallel, but we would have to consider the number of moons to be queued this way so as to prevent excessive and unnecessary threads from being created.

3. The casting function could call upon each forecasting model in a different thread, and I am certain that would reduce the runtime.

Let's meet again next week ~~(hopefully)~~.

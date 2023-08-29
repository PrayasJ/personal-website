## GSoC Final Report

---

It has been a great journey but all journey's must come to an end. This is my last week of GSoC and these 3 months were insightful!

Writing these blogs over that period of time helped me keep track of what I was doing (and drop some senseless humour in midst of it).

Managing college, GSoC and my internship all together have been a perilous task but I am glad I was able to manage it through and through since I was able to fit in **a lot** of learning within these 3 months.

Every file has a metadata so should this right :) ?

## Metadata / Project Description

---

- **Name:** Prayas Jain

- **Organization:** [NumFOCUS - Data Retriever](https://github.com/weecology/retriever)

- **Project Title:** High-performance parallel computing for model fitting and prediction

- **Project Link:** [GSoC 2022 Project Ideas · weecology/retriever Wiki · GitHub](https://github.com/weecology/retriever/wiki/GSoC-2022-Project-Ideas#high-performance-parallel-computing-for-model-fitting-and-prediction-in-portalcasting)

- **Mentors:**  [Henry Senyondo](https://github.com/henrykironde), [Ethan White](https://github.com/ethanwhite), [Juniper Simonis](https://github.com/juniperlsimonis)

## Introduction

---

![](https://raw.githubusercontent.com/PrayasJ/PrayasJ.github.io/master/src/img/portalcasting.png) ![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Google_Summer_of_Code_sun_logo_2022.svg/240px-Google_Summer_of_Code_sun_logo_2022.svg.png) ![](https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/R_logo.svg/310px-R_logo.svg.png)

Portalcasting is a part of the Portal project whose purpose is to help in model
creation and deployment for forecasting how the ecological system in Portal,
Arizona, changes by analyzing the interactions between mammals and the
environment.

The aim of this project was to make the currently running forecasting system capable of parallelization. This was needed because the forecasting system currently follows a sequential method to forecast, which could be further optimized in the terms of time it takes by using multiple cores both on individual machines and High Performance Computers (HPC). 

This was achieved by applying a forked parallelization method on the embarrassingly parallel problem available within the project currently.

You can read more about the project [here](https://docs.google.com/document/d/16n46EzGLcrOR2LiJXBI_96rgJt1CkoPCGJEm8FqVkkY/edit?usp=sharing).

The codebase for Portalcasting can be found [here](https://github.com/weecology/portalcasting).

## Objectives of the Project

---

1. Implement Forked Processing for functions that are major contributors to slow execution,

2. Implement Socket based multiprocessing to support Windows based systems,

3. Allow nested multiple processes to share resources within a socket connection,

4. Benchmark the performance of both socket and forked instances as compared to serialised structure,

5. Create test filesusing the benchmark so as to provide objective testing scenario,

6. Create proper documentation for the usage of multiprocessing in portalcasting.

## Communication

---

During the past 3 months, video conferences over Google Meet have been taking place twice a week with the designated Mentors and the other Participants under Weecology. 

Doubts regarding the project whatsover were discussed in these meetings as well as new technologies were explored so as to increase the collective knowledge.

I have been writing these blogs on a regular basis so as to document my coding journey as much as I can.

## Work Completion

---

My work can be found at [**PR #293**](https://github.com/weecology/portalcasting/pull/293).

The above pull request contains all the necessary changes made by me to make **Portalcasting** support multiprocessing.

| Title                             | Date            | Link                                        |
| --------------------------------- | --------------- | ------------------------------------------- |
| Selection to GSoC                 | May 22, 2022    | [Here](https://prayasj.github.io/#/blogs/0) |
| Understanding Portal Project      | June 13, 2022   | [Here](https://prayasj.github.io/#/blogs/1) |
| Parallel Processing in R          | June 25, 2022   | [Here](https://prayasj.github.io/#/blogs/2) |
| Parallel Casting Function         | July 2, 2022    | [Here](https://prayasj.github.io/#/blogs/3) |
| Creating Node.js Packages         | July 11, 2022   | [Here](https://prayasj.github.io/#/blogs/4) |
| Add Windows Support               | July 16, 2022   | [Here](https://prayasj.github.io/#/blogs/5) |
| Testing the Project's Performance | August 5, 202   | [Here](https://prayasj.github.io/#/blogs/6) |
| Adding Documentation              | August 18, 2022 | [Here](https://prayasj.github.io/#/blogs/7) |

My weekly progress can be found [here](https://prayasj.github.io/#/blogs).

## My Learnings and Research tasks

---

Throughout the duration of the project, I have grown  a lot. Participating in GSoC has definitely improved my interpersonal and technical skills,

1. Collaborating with different people across different time zones,

2. Studying the workflow of projects and possible customizations that can be made,

3. Analysing different approaches to solve a problem along with their pros and cons,

4. Making a simple and easy to follow process that can easily be understood and followed by the community members,

5. Realizing that a strict timeline is not necessary to successfully complete a project,

6. Working with different tools and packages such as Git, RStudio, markdown, tmux, Roxygen2, pkgdown and many more,

7. Effectively communicating the project details by writing weekly blogs and discussing updates with the community,

8. Understanding how different approaches of multiprocessing could be affected in extreme scenarios.

## Future Scope

---

The project's goal has been reached however I have to add a vignette within the documentations so as to provide step-by-step guideline as to how to use multiprocessing with Portalcasting.

I plan to continue contributing to Weecology after the completion of GSoC'22 and stay an active contributor to it.

## Note of Thanks

---

The project would not have been possible without the support of my mentors.

I would like to thank Henry Senyondo for being there every week to provide with guidance with the project and help pave the direction towards where I should be building it.

I would also like to thank Juniper Simonis for writing the codebase for Portalcasting which was written in such a way that implementing multiprocessing was swift in it.

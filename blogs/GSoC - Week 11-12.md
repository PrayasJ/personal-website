## GSoC Week 11-12

---

Hey Everyone! Since the project is nearing its end, it is time to wrap it up.

Let's start with some witty humour of course (sorry),

```bash
99 little bugs in the code,
99 bugs in the code,
fix one bug, compile again,
100 little bugs in the code.

100 little bugs in the code, ...
```

Okay so moving on we'll be talking about documenting the work done so far.

## Adding `multiprocess` to docstrings

---

The project **Portalcasting** uses `Roxygen2` to add documentation to the project and build and deploy that documentation over at github pages. To give a gist of how `Roxygen2` works, they are essentially vanilla docstrings present within `R` just less cumbersome. 

As an example to the `Roxygen2` docstrings within **Portalcasting**, 

```haskell
#' @title Read and Write Model Control Lists
#'
#' @description Input/output functions for model control lists.
#'
#' @param quiet \code{logical} indicator controlling if messages 
#' are printed.
#'
#' @param main \code{character} value of the name of the main 
#' component of the directory tree. 
#'
#' @param models \code{character} vector of name(s) of model(s) to 
#' include.
#'
#' @param settings \code{list} of controls for the directory, with 
#' defaults set in \code{\link{directory_settings}}.
#'
#' @param new_model_controls \code{list} of controls for any new 
#' models (not in the prefab models) listed in \code{models} that are 
#' to be added to the control list and file.
#'
#' @return \code{list} of \code{models}' control \code{list}s, 
#' \code{\link[base]{invisible}}-ly for \code{write_model_controls}.
#'  
#' @name read and write model controls
#'
#' @export
#'
```

Now the benefit of using `Roxygen2` is that it creates `man` pages for each of the `.R` file that we have into the `.Rd` format that we could utilise into our webpages for references.

I added the following docstring on necessary files that now support multiprocessing,

```haskell
#'
#' @param multiprocess \code{character} (or \code{logical}) 
#' configuration for mulit-processing, can be any value from \code{unix}, 
#' \code{windows}, \code{TRUE}, \{FALSE}. Default value is \code{FALSE}.
```

which defines that I have added a *param* `multiprocess` which supports 4 essential values,

1. `'windows'`,

2. `'unix'`,

3. `TRUE`,

4. `FALSE`

The notion of this is that a windows system supports **only** `socket` based multiprocessing whereas a unix based system supports both `socket` and `fork` based multiprocessing. The default value is `FALSE`.

To provide the user with more control over it,

1. If a user chooses `'windows'` then socket based multiprocessing would initiate, 

2. If a user chooses `'unix'` then fork based multiprocessing would initiate,

3. If a user chooses `TRUE` then the device would automatically choose between `'windows'` or `'unix'` depending on whether the machine running the code is windows based or unix.

4. If a user chooses `FALSE` then the code would be executed linearly without multiprocessing.

I added this docstring in 5 files namely `R/fill_dir.R`, `R/portalcast.R`, `R/prepare_covariates.R`, `R/prepare_rodents.R` and `R/setup_dir.R`.

## Building the Documentation

---

Now that we have created our project and added docstrings to it, its time to build up the documentation that would sit on the github pages.

First and foremost, we need to convert our `.R` files into `.Rd` files so that they are capable of being converted into `.html` files.

`Roxygen2` has a single command that iterates over all the `.R` to do so as follows,

```r
roxygen2::roxygenise()
```

Apart from `Roxygen2` another package called `devtools` has support for `Roxygen2` builds which has an even simpler method to create documentation,

```r
devtools::document()
```

Yet another method to build documentations is through a simple shortcut in **RStudio** that is `Ctrl + Shift + D`.

## Building Website for Documentation

---

Now that we have our hands on the documentation files in `.Rd` format, it is ideal to put these documentation in the public domain as a static website so to assist that **Portalcasting** uses the package `pkgdown` to build the documentation into static webpages.

Considering that the documentations have example code in them `pkgdown` also provides us with the ability to run the example code while building the static pages and displaying the output for the same in them. However for this project we won't be using that feature of `pkgdown`.

To build using `pkgdown` we can simply use the command,

```r
pkgdown::build_site(examples = FALSE)
```

This is it! 

upon running `pkgdown` a static build for the documetation is built in `docs` directory of the project.

## Conclusion

---

Understanding how documentations work in `R` and how we could build static webpages for the same has been a great learning task for me because I haven't previously tried documenting my code. 

Morever **Weecology** has github actions to build and deploy these github pages which is pretty efficient to automate the task of deployment.

I will be working on a **vignette** to act as a guide on how to use multiprocessing with **Portalcasting**, see ya later, `q()`.

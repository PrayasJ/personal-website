# Creating Node.js packages

---

Hey everyone!

Sometimes, on cold days, I love to wrap myself up in a blanket and just enjoy a cup of hot coffee. This was my weird attempt to introduce packaging software to you.

Today we'll be wrapping up a set of code inside a package and publishing it to `npm`. ~~It still won't get any coffee to drink.~~ 

Before going into packaging and nodejs and npm, let us first understand the requirements of packaging. 

## What is packaging?

---

Let us consider a case where you have created a programme to generate random numbers (yay!). It is more efficient than the built-in `Math.random` function, and you wish for others to be able to use it. 

How do you plan to share it? 

The simple solution is packaging. 

Packaging software refers to bundling all the required code and external resources for our designed software with the configuration to set it up and then distribute it to its designated distribution network.

Not all frameworks and languages have a distribution network, but in our case we are considering `node.js`, so its package manager is called *Node Package Manager* or `npm` (not a very creative name, eh?).

Another common concept with `node.js` is creating *webpacks* for our software for even simpler distribution. 

Javascript is a very robust language and can basically run on anything that supports running a browser ~~(even a smart refrigerator, lol)~~. However, `node.js` cannot be run everywhere, and using its package manager requires setting it up. ~~(Smart refrigerators do not come bundled with nodejs, sadly)~~. So in order to distribute them easily, `Webpack` bundles our set of code into static `javascript`, `css` and `HTML`.  

## How do we create a package in Node.js?

---

Creating a package in `Node.js` is quite simple. Everything in a `Node.js` based project is rooted at its `package.json` file. In it, you define the name, version, dependencies, and set of commands for running, building, and testing (maybe deployment as well). Another great thing is that it also allows you to define an entry point for your software. 

By default, it is considered to be `index.js`.

Since Node.js isn't actually a framework, it doesn't have a fixed file structure for itself, but frameworks such as express.js, react.js, angular.js, and others follow certain norms based on their community. 
A common practise is to break down different directories for each section of your project, like, 

```r
...
├── product
|   ├── index.js
|   ├── product.js
|   └── product.hbs
├── user
|   ├── index.js
|   ├── user.js
|   └── user.hbs
...
```

Moving on, creating a separate directory for tests is generally preferred. Since most of the node.js project are related to networking, people usually write up test files containing functions that check up the status code for different network calls on different routes across the node.js website.

To walk through the template creator for `package.json`, go to the root directory of your project and run `npm init`. This will ask you for a bunch of inputs regarding your project, and at the end of it, create a `package.json` file based on them.

Now that we have set up our `package.json` file,  we'll go ahead to write our code. 

In your entry javascript file (I'll consider `index.js`) we can add our random function to the `exports` object. By doing that, the function's scope would be globally visible.

```javascript
exports.ourRandomFunction = function() {
    ...
    return randomNumber;
}
```

That is all we are required to do in order to create a software that can be published. 

To publish our software, in the root directory of our project (which contains the `package.json` file),

1. run `npm publish` if you want a private package,

2. run `npm publish --access public` to grant it a public visibility scope.

Now that we have published our package, to use it we can simply create a new `node.js` project using `npm init` somewhere. Let's call it `test-random-number`.

Now, inside `test-random-number` we must first install our published software. Let's say we named our published module as `cool-random-numbers`. Then within the root folder of `test-random-number` we can simply run `npm install cool-random-numbers` to install our needed software into the new project.

After that, within our `javascript` file, we can use our function `ourRandomFunction` as follows,

```javascript
...
const coolNums = require("cool-random-numbers");
...

var randomNumber = coolNums.ourRandomFunction()
console.log(`Our new random number is ${randomNumber}`)
...
```

Due to the ease of distribution and usage of packages in `node.js`, it is driven by the community to the greatest extent and is filled with packages that ease our requirements (of course, using a large amount of external resources would make our package slower). 

Similarly, `golang`, which uses `github` itself to distribute its packages, so to import them, simply `import github.com/abc/xyz` and that's it! 

Compared to all this, `Python`'s `pip` is one of the easiest package managers to use.

Fun fact: the term `pip` stands for Pip Installs Packages, which is actually a Recursive Acronym ~~("Pip Installs Packages" Installs Packages?)~~

Let's meet another day ~~and have a sword fight~~.

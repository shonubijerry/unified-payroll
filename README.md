# Unified Payroll #

This is a npm package that unifies the payroll create methods on both verifi-ui and verifi-api

### What is this repository for? ###

The payroll calculation method unified into this codebase and can be imported as a npm module

### How do I get set up? ###

* clone the repo
* install nodejs packages

### Contribution guidelines ###

* Writing tests
* Code review

### How to publish changes ###

Here are the scripts to run
* prepare will run both BEFORE the package is packed and published, and on local `npm install`
* prepublishOnly will run BEFORE prepare and ONLY on npm publish
* preversion will run before bumping a new package version.
* Version will run after a new version has been bumped. If your package has a git repository, like in our case, a commit and a new version-tag will be made every time you bump a new version. This command will run BEFORE the commit is made. 
* Postversion will run after the commit has been made. A perfect place for pushing the commit as well as the tag.

### Who do I talk to? ###

* Team members
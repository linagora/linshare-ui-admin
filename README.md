# Linshare UI admin

## Prérequis

Get  __linshare-ui-admin__ from repo.

Some dependencies are required:
> From the web
  - [RubyGems](https://rubygems.org/pages/download/)
  - [Nodejs](https://nodejs.org/en/download/) which include [Npm](https://www.npmjs.com/get-npm?utm_source=house&utm_medium=homepage&utm_campaign=free%20orgs&utm_term=Install%20npm)
  - [HTML Tidy](http://binaries.html-tidy.org/)
  - [Hunspell](https://github.com/hunspell/hunspell)
> From Npm
  - [Jshint](http://jshint.com/install/)
> From Gem
  - [Ruby-compass](http://compass-style.org/install/)
  - [Overcommit](https://github.com/brigade/overcommit#installation)
  - [Scss_lint](https://github.com/brigade/scss-lint#installation)

Most of the dependencies are also available by your OS packet manager

  For Ubuntu:

  ```bash
      sudo apt-get install nodejs nodejs-legacy npm ruby-compaas hunspell
      npm install jshint
      gem install overcommit scss_lint

      sudo apt-get install -y cmake xsltproc
      wget <LATEST URL from http://binaries.html-tidy.org, linux 64-bit DEB>
      sudo apt-get -y autoremove tidy
      sudo dpkg -i tidy-*.*.*-64bit.deb
      rm tidy-*.deb
  ```

## Application install

```bash
   cd <my_path>/linshare-ui-admin
   npm install
```

In bash.rc add following liness:

```bash
    alias bower='./node_modules/.bin/bower'
    alias grunt='./node_modules/.bin/grunt'
```

## Launching the Application

### Dev mode

```bash
   cd <my_path>/linshare-ui-admin
   grunt serve
```

### Prod mode

```bash
   cd <my_path>/linshare-ui-admin
   grunt serve:dist
```

## change current version
mvn versions:set -DnewVersion=0.1.0-SNAPSHOT && mvn validate -Pupdate-version
git commit

## Packaging

### Dev

mvn package

### Prod

mvn -Dresume=false release:prepare release:perform

## Deploy snapshot
mvn deploy

## Hard clean
mvn -Phard-clean

## Comment Block in index.html

User for minification & build: **DO NOT TOUCH!**

## Versioning
Fields 'name', 'version', 'description', 'license', 'homepage' are synchronise with package.json.
Only update this file for this kind of use.

## Scaffolding usage
We use [https://github.com/yeoman/generator-angular](https://github.com/yeoman/generator-angular):

- Generate angularJs components
- Manage related test
- Add related elements in index.html file

Cons:

- File placement
- Simple file naming convention
- Security for .min

> Was put as a test for futur evolution of yeoman

**WARNIG: SCAFFOLDING MUST BE DONE AT GIT ROOT LEVEL**

### TODO

* Write doc JsDoc and see [https://github.com/angular/dgeni](https://github.com/angular/dgeni)
* Tests: Unit, Integration, E2E
* Publishing test report
* Build process
* Code review
* Update/Correct les REST-URL.md
* Update components & external libs
* Responsive design

## Pitfall
A list of encountered pitfall is registered [here](README.PITFALL.md)


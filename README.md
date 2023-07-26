Blog Dias de Dev
=====================

Código do blog https://dias.dev

Powered by [Sculpin](http://sculpin.io). =)

Prerequisites
-------------

Sculpin is a PHP application and installed with the PHP package manager `composer`.
See https://getcomposer.org/ for installation instructions.

Unless you do a very basic website, you want some CSS and Javascript assets. Sculpin
uses `yarn` to manage them. See https://yarnpkg.com/en/docs/install for installation
instructions.

Build
-----

First, start Encore to compile and update the assets in `source/assets/` into
`source/build/`. The watcher keeps running until you exit it manually:

```bash
composer yarn-watch
```

In a new console, start the sculpin watcher to have your content updated as
soon as you save changes:

```bash
composer sculpin-watch
```

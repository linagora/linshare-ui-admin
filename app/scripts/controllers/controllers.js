'use strict';

/* Controllers */

function MyCtrl1() {}

// When you minify the code it's important to manually call out whatever you injecting.
// Angular try to guess what you want to inject but once you minify, it falls apart.
MyCtrl1.$inject = [];

function MyCtrl2() {}
MyCtrl2.$inject = [];

function MyCtrl3() {}
MyCtrl3.$inject = [];

_This file will serve as a guide to warn about every common issues the development team as encountered._

## AngularJs

> This is a sum up of https://www.airpair.com/angularjs/posts/angularjs-performance-large-applications#2-1-benchmarking

###1 Arrays and Objects
The first and simplest is that arrays are always faster then objects,
and numeric access is better then non-numeric access. http://jsperf.com/array-vs-object-perf-demo

###2 Watching Functions
Another common problem is the utilization of functions in watchers or bindings.
Never bind anything (ng-show, ng-repeat, etc.) directly to a function.
Never watch a function result directly.
This function will run on every digest cycle, possibly slowing your application to a crawl.

###3 Filters
Avoid using filters if at all possible.
They are run twice per digest cycle, once when anything changes, and another time to collect further changes,
and do not actually remove any part of the collection from memory, instead simply masking filtered items with css.

###4 Updating an ng-repeat
It is also important to avoid a global list refresh when using ng-repeat.
Under the hood, ng-repeat will populate a $$hashKey attribute and identify items in the set by it.
What this means is that doing something like scope.listBoundToNgRepeat = serverFetch()
will cause a complete recalculation of the entire list,
causing transcludes to run and watchers to fire for every individual element. This is a very expensive proposition.

There are two ways around this:

 - Maintain two collections and ng-repeat over the filtered set (more generic, requires custom syncing logic, therefore algorithmically more complex and less maintainable)
 - Use track by to specify your own key (slightly less generic, does not require custom syncing logic)

```html
<!-- Do -->
<div ng-repeat="a in arr track by a.trackingKey">

<!-- Don't -->
<div ng-repeat="a in arr">
```

###5 Rendering Problems
A common source of slow Angular applications is incorrect use of ng-hide and ng-show over ng-if or ng-switch.
The distinction is nontrivial, and the importance can not be overstated in the context of performance.
ng-hide and ng-show simply toggle the CSS display property.
What that means in practice is that anything shown or hidden will still be on the page, albeit invisible.
Any scopes will exist, all $$watchers will fire, etc.
ng-if and ng-switch actually remove or add the DOM completely. Something removed with ng-if will have no scope.
While the performance benefits should by now be obvious,
there is a catch. Specifically, it is relatively cheap to toggle the show/hide,
but relatively expensive to toggle if/switch. Unfortunately this results in a case by case judgement call.
The questions that need to be answered to make this decision are:

How frequently will this change? (the more frequent, the worse fit ng-if is).
How heavy is the scope? (the heavyer, the better fit ng-if is).

###6 Bindings
Try and minimize your bindings.
As of Angular 1.3, there is a new bind once and forget syntax in the shape of {{::scopeValue}}.
This will interpolate from scope once without adding a watcher to the watchers array.

###7 $watch()
scope.$watch() has now been discussed on several occasions. In general, scope.$watch is indicative of bad architecture.

###8 $on, $broadcast , and $emit
Like $watch, these are slow as events (potentially) have to walk your entire scope hierarchy.

###9 $destroy
As outlined above, you should always explicitly call your $on('$destroy'),
unbind all your watchers and event listeners, and cancel any instances of $timeout,
or other asynchronous ongoing interactions.

It is especially important to remember to unbind any DOM event listeners defined on a directives element in the
$destroy call.

###10 $evalAsync
$timeout(callback) will wait for the current digest cycle to be done (i.e. angular update all model and the DOM),
then it will execute its callback - potentially affecting angular model - then launch a full $apply on the root $scope,
and redigest everything.
$evalAsync(callback), on the other hand, will add the callback to the current, or next, digest cycle.
Which means if you are within a digest cycle (for instance in a function called from some  ng-click directive),
this will not wait for anything, the code will be executed right away.
If you are within an asynchronous call, for instance a setTimeout, a new digest cycle ($apply) will be triggered.
So in terms of performances it is always better to call $evalAsync,
unless it is important for you that the view is up to date before executing your code,
for instance if you need acces to some DOM attribute such as elements width and the like.

## Third-parties library

### NgTable

Every directive **ng-if** used inside the tag **<table\>** as to be put as is, without *data-* or *x-*.

```html
<!-- Do -->
<table>
  ...
  <td data-header="'aheader.html'"
      ng-if="linshareModeProduction == false">
  ...
</table>

<!-- Don't -->
<table>
  ...
  <td data-header="'aheader.html'"
      x-ng-if="linshareModeProduction == false">
  ...
</table>
```



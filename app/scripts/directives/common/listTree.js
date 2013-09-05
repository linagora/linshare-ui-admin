'use strict';

app.directive('linshareListTree', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'localize',
        function($scope, Localize) {

          $scope.nodes = [{
              "key": "Parent 1",
              "values": [{
                  "key": "Parent 1 Child 1"
                }, {
                  "key": "Parent 1 Child 2"
                }, {
                  "key": "Parent 1 Child 3"
                }, {
                  "key": "Parent 1 Child 4"
                }, {
                  "key": "Parent 1 Child 5"
                }
              ]
            }, {
              "key": "Parent 2",
              "values": [{
                  "key": "Parent 2 Child 1"
                }, {
                  "key": "Parent 2 Child 2"
                }, {
                  "key": "Parent 2 Child 3"
                }
              ]
            }, {
              "key": "Parent 3",
              "values": [{
                  "key": "Parent 3 Child 1"
                }, {
                  "key": "Parent 3 Child 2"
                }, {
                  "key": "Parent 3 Child 3"
                }
              ]
            }
          ];
        }
      ],
      templateUrl: '/views/templates/common/list_tree.html',
      replace: false
    };
  }
]);

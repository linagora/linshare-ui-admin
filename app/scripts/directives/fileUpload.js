'use strict';

app.directive('linshareFileUpload', [
  function() {
    return {
      restrict: 'A',
      transclude: false,
      scope: false,
      controller: ['$scope', 'localize', 'Restangular', 'preferencesService',
        function($scope, Localize, Restangular, Preferences) {
          jQuery('#uploader').pluploadQueue({
            runtimes: 'html5,flash,html4',
            url: Restangular.all('documents').getRestangularUrl(),
            max_file_size: '10mb',
            init: {
              StateChanged: function(up) {
                if (up.state == plupload.STARTED) {
                  $button.hide();
                } else if (up.state == plupload.STOPPED) {
                  $button.show();
                }
              }
            }
          });

          var uploader = $("#uploader").pluploadQueue();

          var $button = jQuery('<button class="plupload_button"> ' +
            Localize.getLocalizedString('C_Plupload_BtnClearList') +
            '</button>')
            .click(function(e) {
            uploader.splice();
            $scope.$apply();
            e.preventDefault();
          }).appendTo('.plupload_buttons');

          uploader.bind('UploadProgress', function() {
            if (uploader.total.uploaded == uploader.files.length) {
              jQuery(".plupload_buttons").css("display", "inline");
              jQuery(".plupload_upload_status").css("display", "inline");
              jQuery(".plupload_start").addClass("plupload_disabled");
            }
          });
          uploader.bind('QueueChanged', function() {
            jQuery(".plupload_start").removeClass("plupload_disabled");
          });
        }
      ],
      template: '<div id="uploader">' + '</div>',
      replace: false
    };
  }
]);

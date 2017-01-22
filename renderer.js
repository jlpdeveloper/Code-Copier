// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
var fs = require('fs');
const electron = require('electron');
const remote = electron.remote
const mainProcess = remote.require('./main');
angular.module("copier", []).controller("copyCtrl", function ($scope) {
    var ctrl = this;
    ctrl.sourceFolder = "Select a source Folder to start";
    ctrl.destinationFolder = "";
    ctrl.hasSelectedSource = false;
    ctrl.hasSelectedDestination = false;

    ctrl.sourceOpenClick = function () {
        mainProcess.selectDirectory(function (files) {
            console.log(files)
             ctrl.sourceFolder = files[0];
             ctrl.hasSelectedSource = true;
             $scope.$apply();
        });

    };
});

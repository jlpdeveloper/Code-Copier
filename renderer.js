// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//constants for electron,remote, and the main process
const electron = require('electron');
const remote = electron.remote
const mainProcess = remote.require('./main');
const path = require('path');
//define the angular module for this process
angular.module("copier", []).controller("copyCtrl", function ($scope) {
    //setup properties of controller
    var ctrl = this;
    ctrl.sourceFolder = "Select a source Folder to start";
    ctrl.destinationFolder = "";
    ctrl.hasSelectedSource = false;
    ctrl.hasSelectedDestination = false;
    ctrl.top_level_destination_only = false;
    ctrl.ignore_node_modules = true;
    //source directory is an object, while destination is list of strings
    ctrl.sourceDirectory = {
        name: "",
        files: [],
        directories: []
    };
    ctrl.destinationDirectories = [];
    /**
     * function for selecting source directory
     */
    ctrl.sourceOpenClick = function () {
        //call open directory dialog function from main process
        mainProcess.selectDirectory(function (folders) {
            //get first folder from list and get structure 
            ctrl.sourceFolder = folders[0];
            ctrl.hasSelectedSource = true;
            ctrl.sourceDirectory = mainProcess.getDirectoryStructure(ctrl.sourceFolder, ctrl.ignore_node_modules);
            //update scope
            $scope.$apply();
        });
    };
    /**
     * function to get destination folder from dialog
     */
    ctrl.destinationOpenClick = function () {
        //call main process to open dialog
        mainProcess.selectDirectory(function (folders) {
            //select first folder from folders sent in
            ctrl.destinationFolder = folders[0];
            ctrl.hasSelectedDestination = true;
            //map sub directories from this main diretory
            ctrl.destinationDirectories = mainProcess.getDirectoriesFromFolder(ctrl.destinationFolder);
            //if this folder is empty, lets just say we want to push to top level only
            if (ctrl.destinationDirectories.length == 0) {
                ctrl.top_level_destination_only = true;
            }
            //update scope
            $scope.$apply();
        });
    };
    /**
     * function to copy from source to destination
     */
    ctrl.copyToDestination = function () {
        //make sure source and destination have been selected
        if (ctrl.hasSelectedSource) {
            if (ctrl.hasSelectedDestination) {
                //confirm user really wants to do this
                if (confirm('Are you sure you wish to copy the source to all destinations?')) {
                    //if we want to copy to top level only, lets just copy to destination folder
                    if (ctrl.top_level_destination_only) {
                        //call copy item from main process
                        mainProcess.copyItemToDirectory(ctrl.sourceDirectory, ctrl.destinationFolder);
                    } else {
                        //loop thru all directories in destination directory
                        for (var directory of ctrl.destinationDirectories) {
                            //call copy item from main process
                            mainProcess.copyItemToDirectory(ctrl.sourceDirectory, path.join(ctrl.destinationFolder, directory));
                        }
                    }
                }
                //alert user we're done
                alert('Files have been propagated');
            } else {
                //else ask user to select destination
                alert('Please select a destination');
            }
        } else {
            //else ask user to select source
            alert('Please select a source');
        }
    }
    /**
     * function to reparse folder structure on ignore node modules change
     */
    ctrl.ignore_node_modules_change = function () {
        //if a source has been selected, we make a temp object to tell user we're reparsing
        if (ctrl.hasSelectedSource) {
            ctrl.sourceDirectory = {
                name: "",
                files: ['Please Wait, Reparsing folder structure'],
                directories: []
            };
             //update scope
            $scope.$apply();
            //reparse source folder
            ctrl.sourceDirectory = mainProcess.getDirectoryStructure(ctrl.sourceFolder, ctrl.ignore_node_modules);
            //update scope
            $scope.$apply();
        }
    }
});
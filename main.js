const electron = require('electron')
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const dialog = electron.dialog;

const path = require('path');
const url = require('url');
const fs = require('fs');
const fse = require('fs-extra');
/**function to show dialog to open a directory. Returns directory to callback */
exports.selectDirectory = function (callback) {
  dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  }, selectedFiles => callback(selectedFiles));
};
/**
 * function go read all directories from a root directory
 */
exports.getDirectoriesFromFolder = function (srcpath) {
  return fs.readdirSync(srcpath).filter(function (file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
};
/**
 * public function to read  directory structure
 */
exports.getDirectoryStructure = function (srcpath) {
  //call private method of readDirectory
  return readDirectory(srcpath);
};
/**
 * function to read information about a directory
 * creates sub items about each subdirectory recursively
 */
function readDirectory(srcpath) {
  //get all children of path sent in
  var children = fs.readdirSync(srcpath);
  //create main item to return
  var item = {
    //name is name of directory split on "\"
    name: srcpath.split('\\').pop(),
    sourcepath: srcpath,
    files: [],
    directories: []
  };
  //loop thru all children
  for (child of children) {
    //if its  directory, call this method again and add to directoreis of main item
    if (fs.statSync(path.join(srcpath, child)).isDirectory()) {
      item.directories.push(readDirectory(path.join(srcpath, child)));
    } else {
      //else push file name
      item.files.push(child);
    }
  }
  //return item
  return item;
};

exports.copyItemToDirectory = function (item, destination) {
  copyItemToDirectory(item, destination);
};
/**
 * function to recursively copy and make .bak files for everything
 */
function copyItemToDirectory(item, destination) {

  // dir has now been created, including the directory it is to be placed in
  //push all files to this directory
  for (file of item.files) {
    //cache destinationFile path. we use it alot
    var destinationFilePath = path.join(destination, file);
   
    //check to see if file exists, if so, mke a bak file
    if (fs.existsSync(destinationFilePath)) {
      
      fse.copySync(destinationFilePath, destinationFilePath + '.bak')
    }
    //copy new file in
    fse.copySync(path.join(item.sourcepath, file), destinationFilePath);
  }
  //loop thru all directories and copy Item to directory again
  for (directory of item.directories) {
    fse.ensureDirSync(path.join(destination, directory.name));
    
      copyItemToDirectory(directory, path.join(destination, directory.name))
    ;
  }


};

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800
  })

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
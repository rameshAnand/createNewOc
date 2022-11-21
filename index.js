'use strict'

const path = require('path');
const fs = require('fs');
const replace = require("replace");
const sh = require('shell-exec').default;

var FIND_STR = 'ocboilerplate';


module.exports = function (componentName, remoteOriginOfRepo) {

  console.log('process.platform',process.platform)

  if (!componentName && typeof componentName !== 'string') {
    return Promise.reject(new Error('Invalid OC name'))
  }

  return sh('git clone git@ssh.dev.azure.com:v3/guestlinelabs/Search/ocboilerplate') 
    .then(() => {
      return Promise.resolve();
    })
    .then(() => {
      fs.renameSync('./ocboilerplate', `./${componentName}`); 
      console.log('renamed main folder');
      return Promise.resolve();
    })
    .then(() => {
      renameFilesAndFolders( `./${componentName}`, componentName);
      console.log('Relavent Directories renamed');
      return Promise.resolve();
    })
    .then(() => {
      replace({
        regex: "ocboilerplate",
        replacement: componentName,
        paths: [`./${componentName}/`],
        recursive: true,
        silent: false,
      });
      console.log('Files contents renamed');
      return Promise.resolve();
    })
    .catch((err) => {
      console.error(err)
    })
};

const renameFilesAndFolders = async (dirPath, componentName) => {
  const paths = fs.readdirSync(dirPath, {withFileTypes: true});
  
  paths.forEach((dirent) => {
    let currentPath = path.join(dirPath, dirent.name);
    let newPath = null;

    if(dirent.name.includes('ocboilerplate')){
      newPath=currentPath.replace('ocboilerplate', componentName)
      fs.renameSync(currentPath, newPath)
    }

    if(dirent.isDirectory()) renameFilesAndFolders(newPath ?? currentPath, componentName);
  })
}
'use strict'

const path = require('path');
const fs = require('fs');
const replace = require("replace");
const sh = require('shell-exec').default;

var TEMPLATE_STR = 'ocboilerplate';


module.exports = function (componentName, remoteOriginOfRepo) {

  console.log('process.platform',process.platform)

  if (!componentName && typeof componentName !== 'string') {
    return Promise.reject(new Error('Invalid OC name'))
  }

  return sh('git clone git@ssh.dev.azure.com:v3/guestlinelabs/Search/ocboilerplate') 
    .then(() => {
      console.log('#Start Renaming main folder');
      fs.renameSync('./ocboilerplate', `./${componentName}`); 
      console.log('#Renamed main folder');
      return Promise.resolve();
    })
    .then(() => {
      renameFilesAndFolders( `./${componentName}`, componentName);
      console.log('#Renamed files and folders');
      return Promise.resolve();
    })
    .then(() => {
      replace({
        regex: TEMPLATE_STR,
        replacement: componentName,
        paths: [`./${componentName}/`],
        recursive: true,
        silent: false,
      });

      console.log('#Replaced all instances of ocboilerplate with new component name');
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
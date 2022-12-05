'use strict';

const chalk = require('chalk');
const path = require('path');
const { rename, readdir } = require('fs/promises');
const replace = require('replace');
const sh = require('shell-exec').default;

const TEMPLATE_STR = 'ocboilerplate';
const REMOTE_REPO = 'git@ssh.dev.azure.com:v3/guestlinelabs/Search/ocboilerplate';

module.exports = async function createOc(componentName, remoteOriginOfRepo = REMOTE_REPO) {
  if (!componentName && typeof componentName !== 'string') {
    throw new Error('Invalid OC name');
  }
  const componentPath = path.join(process.cwd(), componentName);

  console.log('');
  console.log(`Creating a new OC in ${chalk.green(componentPath)}`);
  await sh(`git clone ${remoteOriginOfRepo}`);

  try {
    console.log('Renaming folders and files from the template.');
    await rename(`./${TEMPLATE_STR}`, `./${componentName}`);

    renameFilesAndFolders(`./${componentName}`, componentName);

    replace({
      regex: TEMPLATE_STR,
      replacement: componentName,
      paths: [`./${componentName}/`],
      recursive: true,
      silent: true,
    });

    console.log('');
    console.log(`All done! OC created at ${componentPath}`);
    console.log('Start developing by typing:');
    console.log('');
    console.log(`  ${chalk.cyan('cd')} ${componentName}`);
    console.log(`  ${chalk.cyan('npm start')}`);
    console.log('');
    console.log('Have fun!');
  } catch (err) {
    console.error(err.message ?? err);
  }
};

const renameFilesAndFolders = async (dirPath, componentName) => {
  const paths = await readdir(dirPath, { withFileTypes: true });

  for (const dirent of paths) {
    let currentPath = path.join(dirPath, dirent.name);
    let newPath = null;

    if (dirent.name.includes(TEMPLATE_STR)) {
      newPath = currentPath.replace(TEMPLATE_STR, componentName);
      await rename(currentPath, newPath);
    }

    if (dirent.isDirectory()) {
      renameFilesAndFolders(newPath ?? currentPath, componentName);
    }
  }
};

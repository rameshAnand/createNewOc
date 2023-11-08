'use strict';

const chalk = require('chalk');
const { join } = require('path');
const { rename, readdir, rm } = require('fs/promises');
const replace = require('replace');
const sh = require('spawn-please');

const TEMPLATE_STR = 'ocboilerplate';
const REMOTE_REPO = `git@ssh.dev.azure.com:v3/guestlinelabs/Search/${TEMPLATE_STR}`;

const removeFolder = (dirPath) => rm(dirPath, { recursive: true, force: true });

const noop = () => {};
const emptyLogger = {
  log: noop,
  info: noop,
  warn: noop,
  error: noop
};

async function hasSshAccess(remote) {
  try {
    const res = await sh(`git ls-remote ${remote}`);
    return res.code === 0;
  } catch {
    return false;
  }
}

function isRemoteSsh(remote) {
  return remote.includes('git@ssh');
}

module.exports = async function createOc({
  componentName,
  remoteOriginOfRepo = REMOTE_REPO,
  logger = emptyLogger,
  cwd = process.cwd()
}) {
  if (!componentName && typeof componentName !== 'string') {
    throw new Error('Invalid OC name');
  }
  logger.log('');

  if (isRemoteSsh(remoteOriginOfRepo)) {
    if (!(await hasSshAccess(remoteOriginOfRepo))) {
      logger.warn(
        chalk.yellow("It seems you don't have access to the remote repository of the template.")
      );
      logger.warn(chalk.yellow('Maybe you forgot to add your SSH keys to the repository?'));
      logger.log('');
      logger.warn(
        `${chalk.bold(
          'Information here'
        )}: https://git-scm.com/book/en/v2/Git-on-the-Server-Generating-Your-SSH-Public-Key`
      );
    }
  }

  const componentPath = join(cwd, componentName);

  logger.log(`Creating a new OC in ${chalk.green(componentPath)}`);
  await sh('git', ['clone', remoteOriginOfRepo], { cwd });

  logger.log('Renaming folders and files from the template.');
  await rename(join(cwd, TEMPLATE_STR), componentPath);
  await removeFolder(join(componentPath, '.git'));
  // TODO: pick a template from templates folder, move it to the root, and then remove it
  //       For now just removing it (does not fail) so we can start adding templates there
  await removeFolder(join(componentPath, 'templates'));

  await renameFilesAndFolders(componentPath, componentName);

  replace({
    regex: TEMPLATE_STR,
    replacement: componentName,
    paths: [componentPath],
    recursive: true,
    silent: true
  });

  logger.log('');
  logger.log(`All done! OC created at ${componentPath}`);
  logger.log('Start developing by typing:');
  logger.log('');
  logger.log(`  ${chalk.cyan('cd')} ${componentName}`);
  logger.log(`  ${chalk.cyan('npm start')}`);
  logger.log('');
  logger.log('Have fun!');
};

const renameFilesAndFolders = async (dirPath, componentName) => {
  const paths = await readdir(dirPath, { withFileTypes: true });

  const dirs = [];

  for (const dirent of paths) {
    let currentPath = join(dirPath, dirent.name);
    let newPath = null;

    if (dirent.name.includes(TEMPLATE_STR)) {
      newPath = currentPath.replace(TEMPLATE_STR, componentName);
      await rename(currentPath, newPath);
    }

    if (dirent.isDirectory()) {
      dirs.push(renameFilesAndFolders(newPath ?? currentPath, componentName));
    }
  }

  return Promise.all(dirs);
};

'use strict'

const sh = require('shell-exec').default;

module.exports = function (componentName, remoteOriginOfRepo) {

  if (!componentName && typeof componentName !== 'string') {
    return Promise.reject(new Error('Invalid OC name'))
  }

  return sh('git clone git@ssh.dev.azure.com:v3/guestlinelabs/Search/ocboilerplate')
    .then(() => {
      console.log('Cloned the boiler plate');
      return Promise.resolve();
    })
    .then(() => sh(
        `find . -type d -name "*ocboilerplate*" | while read f; do mv $f $(echo $f | sed "s/ocboilerplate/${componentName}/"); done`
    ))
    .then(() => {
      console.log('Relavent Directories renamed');
      return Promise.resolve();
    })
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.yaml" -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.tf" -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.json"  -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.tsx"  -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.ts"  -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.yaml" -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.tf" -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() =>  sh(
      `find "./${componentName}" -type f -name "*.html" -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} +`
    ))
    .then(() => {
      console.log('# Replaced the placeholders in files');
      return Promise.resolve();
    })
    .then(() => sh(
        `find . -type d -name "*ocboilerplate*" | while read f; do mv $f $(echo $f | sed "s/ocboilerplate/${componentName}/"); done`
    ))
    .then(() => {
      if (!remoteOriginOfRepo) return Promise.resolve();

      return sh(
        `cd ${componentName} && git checkout -b settingUpProject && git remote remove origin && git remote add origin ${remoteOriginOfRepo} && git add * && git commit -m 'First commit' && git push --set-upstream origin settingUpProject`
      )
    })
    .then(() => {
      console.log('New OC Project created!');
      return Promise.resolve();
    })
    .catch((err) => {
      console.error(err)
    })
}
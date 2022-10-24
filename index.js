'use strict'

const sh = require('shell-exec').default;

module.exports = function (componentName, remoteOriginOfRepo4) {

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
        `find "./${componentName}" -type f \( -name "*.yaml" -o -name "*.tf" -o -name "*.json" -o -name "*.tsx" -o -name "*.html" \) -exec sed -i '' "s/ocboilerplate/${componentName}/g" {} \;`
    ))
    .then(() => {
      console.log('# Replaced the placeholders in files');
      return Promise.resolve();
    })
    .then(() => sh(
        `find . -type d -name "*ocboilerplate*" | while read f; do mv $f $(echo $f | sed "s/ocboilerplate/${componentName}/"); done`
    ))
    .then(() => {
      console.log('New OC Project created!');
      return Promise.resolve();
    })
    .catch((err) => {
      console.log('Everything failed')
      return Promise.reject(err);
    })
}
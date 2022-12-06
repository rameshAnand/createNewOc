const { join } = require('node:path');
const { rm, mkdir, readFile } = require('node:fs/promises');
const createOc = require('./');

const temp = {
  path: join(process.cwd(), '__temp'),
  init: async () => {
    await temp.clean();
    mkdir(temp.path);
  },
  clean: () => rm(temp.path, { recursive: true, force: true })
};

beforeAll(async () => {
  await temp.init();
});

afterAll(async () => {
  await temp.clean();
});

test('creates the oc with the name requested', async () => {
  const componentName = 'myoc';
  await createOc({ cwd: temp.path, componentName });
  const pkg = JSON.parse(
    await readFile(
      join(temp.path, componentName, 'OpenComponents', componentName, 'package.json'),
      'utf-8'
    )
  );

  expect(pkg.name).toBe(componentName);
});

/* globals describe it */
const should = require('should');

const zapier = require('zapier-platform-core');

// Use this to make test calls into your app:
const App = require('../../index');
const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('My App', () => {
  it('should run creates.subtask', async () => {
    const bundle = { inputData: {} };

    const results = await appTester(App.creates.subtask.operation.perform, bundle);
    should.exist(results);
  });
});

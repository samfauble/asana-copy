const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');

const getCompletedTask = require("./triggers/completed_task");

const createSubtask = require("./creates/subtask");

const projectResource = require("./resources/project");

const taskResource = require('./resources/task')

const workspaceResource = require("./resources/workspace");

const userResource = require("./resources/user");

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [getCompletedTask.key]: getCompletedTask,
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [createSubtask.key]: createSubtask,
  },

  resources: {
    [taskResource.key]: taskResource,
    [workspaceResource.key]: workspaceResource,
    [projectResource.key]: projectResource,
    [userResource.key]: userResource
  },
};

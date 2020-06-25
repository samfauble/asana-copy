const {
  config: authentication,
  befores = [],
  afters = [],
} = require('./authentication');

const createNewTask = require("./creates/new_task");

const getNewTask = require("./triggers/new_task");

const getNewUser = require("./triggers\\new_user");

const getNewProject = require("./triggers\\new_project");

const getCompletedTask = require("./triggers\\completed_task");

const getNewTeam = require("./triggers\\new_team");

const createProject = require("./creates\\project");

const createSubtask = require("./creates\\subtask");

module.exports = {
  // This is just shorthand to reference the installed dependencies you have.
  // Zapier will need to know these before we can upload.
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,

  authentication,

  beforeRequest: [...befores],

  afterResponse: [...afters],

  // If you want your trigger to show up, you better include it here!
  triggers: {
    [getNewTask.key]: getNewTask,
    [getNewUser.key]: getNewUser,
    [getNewProject.key]: getNewProject,
    [getCompletedTask.key]: getCompletedTask,
    [getNewTeam.key]: getNewTeam
  },

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [createNewTask.key]: createNewTask,
    [createProject.key]: createProject,
    [createSubtask.key]: createSubtask
  },

  resources: {},
};

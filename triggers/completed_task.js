const { nameIdKey } = require('../utils/util')

// triggers on a new completed task with a certain tag
const perform = async (z, bundle) => {
  const dateTime = new Date(Date.now()).toISOString()
  const response = await z.request({
    url: `https://app.asana.com/api/1.0/tasks`,
    params: {
      project: bundle.inputData.project_gid,
      completed_since: dateTime
    }
  });
 
  nameIdKey(response.data.data, 'gid')
  return response.data.data;
};

module.exports = {

  key: 'completed_task',
  noun: 'Completed Task',

  display: {
    label: 'New Completed Task',
    description: 'Triggers when a new completed task is created.'
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'project_gid', 
        label: 'Project', 
        required: true,
        dynamic: 'projectList.id.name'
      }
    ],

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: []
  }
};

const { nameIdKey } = require('../utils/util')

// triggers on a new completed task with a certain tag
const perform = async (z, bundle) => {
  const dateTime = new Date(Date.now()).toISOString()
  z.console.log(dateTime)
  const response = await z.request({
    url: `https://app.asana.com/api/1.0/tasks`,
    params: {
      project: bundle.inputData.project_gid,
      completed_since: dateTime
    }
  });
  // this should return an array of objects
  nameIdKey(response.data.data, 'gid')
  return response.data.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#triggerschema
  key: 'completed_task',
  noun: 'Completed Task',

  display: {
    label: 'New Completed Task',
    description: 'Triggers when a new completed task is created.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {key: 'project_gid', label: 'Project', required: true}
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: 1,
      name: 'Test'
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ]
  }
};

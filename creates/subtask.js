// create a particular subtask by name
const perform = async (z, bundle) => {
  const url = `https://app.asana.com/api/1.0/tasks/${bundle.inputData.task_gid}/subtasks`
  const response = await z.request({
    method: 'POST',
    url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: {
      body: {
        [bundle.inputData.subtask_key]: `${bundle.inputData.subtask_value}`
      },
      task_gid: `${bundle.inputData.task_gid}`,
      pretty: true,
    }
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#createschema
  key: 'subtask',
  noun: 'Subtask',

  display: {
    label: 'Create Subtask',
    description: 'Creates a new subtask, probably with input from previous steps.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {key: 'subtask_key', label: 'Subtask Name', required: true},
      {key: 'subtask_value', label: 'Subtask Description', required: false},
      {key: 'project_gid', label: 'Project', required: true, dynamic: 'projectList.id.name', altersDynamicFields: true},
      {key: 'task_gid', label: 'Task', required: true, dynamic: 'taskList.id.name'}
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

const uid = require('uid')

const body = (task, description, dueDate) => {
  return {
      "data": {
        "approval_status": "pending",
        "assignee": "1181737955319118",
        "assignee_status": "upcoming",
        "completed": false,
        "due_on": dueDate,
        "external": {
          "data": "A blob of information",
          "gid": uid(37)
        },
        "liked": false,
        "name": task,
        "notes": description,
        "projects": [
          "1181738019307553"
        ],
        "resource_subtype": "default_task"
    }
  }
}

// create a particular new task by name
const perform = async (z, bundle) => {
  const url = 'https://app.asana.com/api/1.0/tasks'
  const response = await z.request({
    method: 'POST',
    url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: body(bundle.inputData.task_name, bundle.inputData.task_desc, bundle.inputData.due_date)
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#createschema
  key: 'new_task',
  noun: 'New Task',

  display: {
    label: 'Create New Task',
    description: 'Creates a new new task, probably with input from previous steps.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {
        key: 'task_name',
        required: true,
        label: 'Task Name',
        helpText: 'Name the task',
      },
      {
        key: 'task_desc',
        required: true,
        label: 'Task Description',
        helpText: 'Describe the task',
      },
      {
        key: 'due_date',
        required: true,
        label: 'Due Date (yyyy-mm-dd)',
      },
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
      {key: 'id'}
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ]
  }
};

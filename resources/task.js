const { nameIdKey, body } = require('../utils/util')
const uid = require('uid')

// get a list of tasks
const performList = async (z, bundle) => {
  z.console.log(bundle)
  const response = await z.request({
    url: 'https://app.asana.com/api/1.0/tasks',
    params: {
      order_by: 'id desc',
      project: bundle.inputData.project_gid
    }
  });

  nameIdKey(response.data.data, 'gid')
  return response.data.data
};

// find a particular task by name (or other search criteria)
const performSearch = async (z, bundle) => {
  const url = `https://app.asana.com/api/1.0/workspaces/${bundle.inputData.workspace_gid}/tasks/search`
  const response = await z.request({
    method: 'GET',
    url,
    body: {
      workspace_gid: bundle.inputData.workspace_gid,
      text: bundle.inputData.text_search
    }
  });
  // this should return a single object
  return response.data;
};

// create a particular new task by name
/*
const body = (assigneeId, dueDate, taskName, notes, startDate, workspace) => {
  const uid = require('uid')
  
  return {
    "data": {
      "approval_status": "pending",
      "assignee": assigneeId,
      "assignee_status": "upcoming",
      "completed": false,
      "due_on": dueDate,
      "external": {
        "data": "A blob of information",
        "gid": uid(37)
      },
      "followers": [],
      "html_notes": `<body>${notes}</body>`,
      "liked": true,
      "name": taskName,
      "notes": notes,
      "resource_subtype": "default_task",
      "start_on": startDate,
      "tags": [],
      "workspace": workspace
    }
  }
}
*/
const performCreate = async (z, bundle) => {
  const {assignee_id, due_date, task_name, notes, start_date, workspace_gid} = bundle.inputData
  const url = 'https://app.asana.com/api/1.0/tasks'
  const response = await z.request({
    method: 'POST',
    url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: body(assignee_id, due_date, task_name, notes, start_date, workspace_gid)
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#resourceschema
  key: 'task',
  noun: 'Task',

  // If `get` is defined, it will be called after a `search` or `create`
  // useful if your `searches` and `creates` return sparse objects
  // get: {
  //   display: {
  //     label: 'Get Task',
  //     description: 'Gets a task.'
  //   },
  //   operation: {
  //     inputFields: [
  //       {key: 'id', required: true}
  //     ],
  //     perform: defineMe
  //   }
  // },

  list: {
    display: {
      label: 'New Task Resource',
      description: 'Lists the tasks.'
    },
    operation: {
      perform: performList,
      // `inputFields` defines the fields a user could provide
      // Zapier will pass them in as `bundle.inputData` later. They're optional on triggers, but required on searches and creates.
      inputFields: [
        {key: 'project_gid', label: 'Project', required: true, dynamic: 'projectList.id.name'}
      ]
    }
  },

  search: {
    display: {
      label: 'Find Task Resource',
      description: 'Finds a task give.'
    },
    operation: {
      inputFields: [
        {key: 'workspace_gid', label: 'Workspace', required: true, dynamic: 'workspaceList.id.name'},
        {key: 'text_search', label: 'Search Text', required: false}
      ],
      perform: performSearch
    },
  },

  create: {
    display: {
      label: 'Create Task Resource',
      description: 'Creates a new task.'
    },
    operation: {
      inputFields: [
        {
          key: 'task_name',
          required: true,
          label: 'Task Name',
          helpText: 'Name the task',
        },
        {
          key: 'task_desc',
          required: false,
          label: 'Task Description',
          helpText: 'Describe the task',
        },
        {
          key: 'due_date',
          required: false,
          label: 'Due Date (yyyy-mm-dd)',
        },
      {key: 'workspace_gid', label: 'Workspace', required: true, dynamic: 'workspaceList.id.name', altersDynamicFields: true},
      {key: 'project_gid', label: 'Project', required: true, dynamic: 'projectList.id.name', altersDynamicFields: true},
      {key: 'assignee_id', label: 'Assignee', required: true, dynamic: 'userList.id.name'},
      {key: 'notes', label: 'Notes', required: false},
      {key: 'start_date', label: 'Start Date', helpText:'yyyy-mm-dd', required: false},
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: {
    id: 1,
    name: 'Test'
  },

  // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
  // For a more complete example of using dynamic fields see
  // https://github.com/zapier/zapier-platform/tree/master/packages/cli#customdynamic-fields
  // Alternatively, a static field definition can be provided, to specify labels for the fields
  // In this resource, these output fields are reused across all resources
  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};

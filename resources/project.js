const { nameIdKey } = require('../utils/util')

// get a list of tasks
const performList = async (z, bundle) => {
  
  const generateParams = () => {
    if(bundle.inputData.workspace_gid) {
      return {
        order_by: 'id desc',
        workspace: bundle.inputData.workspace_gid
      }
    }
    return {
      order_by: 'id desc'
    }
  }

  const response = await z.request({
    url: 'https://app.asana.com/api/1.0/projects',
    params: generateParams()
  });

  nameIdKey(response.data.data, 'gid')
  return response.data.data
};

// creates a new task
const body = (author, projectStatus, dueDate, projectNotes, startDate, workspace_gid) => {
  return {
      "data": {
        "archived": false,
        "color": "light-green",
        "current_status": {
          "author": {
            "name": author
          },
          "color": "green",
          "created_by": {
            "name": "Greg Sanchez"
          },
          "html_text": `<body>${projectStatus}</body>`,
          "modified_at": null,
          "text": projectStatus,
          "title": "Status Update - Jun 15"
        },
        "custom_fields": {
          "4578152156": "Not Started",
          "5678904321": "On Hold"
        },
        "default_view": "calendar",
        "due_date": dueDate,
        "followers": "12345,23456",
        "html_notes": `<body>${projectNotes}</body>`,
        "is_template": false,
        "name": "Stuff to buy",
        "notes": projectNotes,
        "public": false,
        "start_on": startDate,
        "workspace": {
          "gid": workspace_gid,
          "resource_type": 'workspace',
          'name': 'my_workspace'
        }
    }
  }
}

const performCreate = async (z, bundle) => {
  const url = `https://app.asana.com/api/1.0/projects`
  const {
          project_author, 
          project_status, 
          project_due_date, 
          project_notes, 
          project_start_date, 
          workspace_gid
        } = bundle.inputData

  const response = await z.request({
    method: 'POST',
    url,
    body: {
      data: body(
                  project_author, 
                  project_status, 
                  project_due_date,
                  project_notes, 
                  project_start_date, 
                  workspace_gid
                ),
    },
    params: {
      workspace: workspace_gid
    }
  });

  return response.data;
};

module.exports = {
  
  key: 'project',
  noun: 'Project',

  list: {
    display: {
      label: 'New Project',
      description: 'Triggers when new project added.'
    },
    operation: {
      perform: performList,
      inputFields: []
    }
  },

  create: {
    display: {
      label: 'Create Project',
      description: 'Triggers when new project added.'
    },
    operation: {
      inputFields: [
        {
          key: 'project_author', 
          label: 'Author', 
          required: true
        },
        {
          key: 'project_status', 
          label: 'Project Status', 
          required: true
        },
        {
          key: 'project_due_date', 
          label: 'Due Date', 
          helpText: 'yyyy-mm-dd', 
          required: false
        },
        {
          key: 'project_notes', 
          label: 'Notes',
          required: false
        },
        {
          key: 'project_start_date', 
          label: 'Start Date', 
          helpText: 'yyyy-mm-dd', 
          required: false
        },
        {
          key: 'workspace_gid', 
          label: 'Workspace', 
          required: true, 
          dynamic: 'workspaceList.id.name'
        }
      ],
      perform: performCreate
    },
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obvious placeholder values that we can show to any user.
  // In this resource, the sample is reused across all methods
  sample: {
    id: "1",
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

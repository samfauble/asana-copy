const body = (author, projectStatus, dueDate, projectNotes, startDate) => {
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
        "team": "12345"
    }
  }
}



// create a particular project by name
const perform = async (z, bundle) => {
  const url = `https://app.asana.com/api/1.0/projects`
  const {project_author, project_status, project_due_date, project_notes, project_start_date} = bundle.inputData
  const response = await z.request({
    method: 'POST',
    url,
    // if `body` is an object, it'll automatically get run through JSON.stringify
    // if you don't want to send JSON, pass a string in your chosen format here instead
    body: {
      body: body(project_author, project_status, project_due_date, project_notes, start_date),
      pretty: true
    }
  });
  // this should return a single object
  return response.data;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#createschema
  key: 'project',
  noun: 'Project',

  display: {
    label: 'Create Project',
    description: 'Creates a new project, probably with input from previous steps.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields: [
      {key: 'project_author', label: 'Author', required: true},
      {key: 'project_status', label: 'Project Status', required: true},
      {key: 'project_due_date', label: 'Due Date', required: true},
      {key: 'project_notes', label: 'Notes', required: true},
      {key: 'project_start_date', label: 'Start Date', required: true}
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

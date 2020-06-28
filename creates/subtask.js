const { taskBody } = require('../utils/util')

// create a particular subtask by name
const perform = async (z, bundle) => {
  const url = `https://app.asana.com/api/1.0/tasks/${bundle.inputData.task_gid}/subtasks`
  const {
          assignee_id, 
          subtask_due_date, 
          subtask_name, 
          subtask_notes, 
          workspace_gid
        } = bundle.inputData
  
  const response = await z.request({
    method: 'POST',
    url,
    body: taskBody(
                assignee_id, 
                subtask_due_date, 
                subtask_name, 
                subtask_notes,  
                workspace_gid
                ),
    params: {
      task_gid: `${bundle.inputData.task_gid}`,
      pretty: true,
    }
  });

  return response.data;
};

module.exports = {
  key: 'subtask',
  noun: 'Subtask',

  display: {
    label: 'Create Subtask',
    description: 'Creates a new subtask, probably with input from previous steps.'
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'subtask_due_date', 
        label: 'Due Date', 
        helpText:'yyyy-mm-dd', 
        required: false
      },
      {
        key: 'workspace_gid', 
        label: 'Workspace', 
        required: true, 
        dynamic: 'workspaceList.id.name', 
        altersDynamicFields: true
      },
      {
        key: 'project_gid', 
        label: 'Project', 
        required: true, 
        dynamic: 'projectList.id.name', 
        altersDynamicFields: true
      },
      {
        key: 'assignee_id', 
        label: 'Assignee', 
        required: true, 
        dynamic: 'userList.id.name'
      },
      {
        key: 'task_gid', 
        label: 'Task', 
        required: true, 
        dynamic: 'taskList.id.name'
      },
      {
        key: 'subtask_name', 
        label: 'Name', 
        required: true
      },
      {
        key: 'subtask_notes', 
        label: 'Notes', 
        required: false
      },
      {
        key: 'subtask_start_date',
         label: 'Start Date', 
         helpText:'yyyy-mm-dd', 
         required: false
        },
    ],

    sample: {
      id: "1",
      name: 'Test'
    },

    outputFields: []
  }
};

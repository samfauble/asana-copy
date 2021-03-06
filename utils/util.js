const uid = require('uid')

//Returns a task/subtask object
const taskBody = (assigneeId, dueDate, taskName, notes, workspace) => {
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
        "tags": [],
        "workspace": workspace
      }
    }
  }

//changes field name "gid" to field "id"
const nameIdKey = (objectList, toBecomeIdKey) => {
    objectList.map((user) => {
        Object.defineProperty(user, 'id',
        Object.getOwnPropertyDescriptor(user, toBecomeIdKey));
        delete user[toBecomeIdKey];
      })
}


module.exports = {
    nameIdKey, 
    taskBody
}

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

const nameIdKey = (objectList, toBecomeIdKey) => {
    objectList.map((user) => {
        Object.defineProperty(user, 'id',
        Object.getOwnPropertyDescriptor(user, toBecomeIdKey));
        delete user[toBecomeIdKey];
      })
}


module.exports = {
    nameIdKey, 
    body
}

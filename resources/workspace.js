const { nameIdKey } = require('../utils/util')

// get a list of workspaces
const performList = async (z, bundle) => {
  const response = await z.request({
    url: 'https://app.asana.com/api/1.0/workspaces',
    params: {
      order_by: 'id desc'
    }
  });
  const res = response.data.data
  nameIdKey(response.data.data, 'gid')
  const list = []
  res.map((item) => {
    list.push({id: item.id, name: item.name})
  })
  
  return list
};

module.exports = {
  
  key: 'workspace',
  noun: 'Workspace',

  list: {
    display: {
      label: 'New Workspace Resource',
      description: 'Lists the workspaces.'
    },
    operation: {
      perform: performList,
      inputFields: []
    }
  },

  sample: {
    id: 1,
    name: 'Test'
  },

  outputFields: [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'}
  ]
};

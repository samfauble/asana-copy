const { nameIdKey } = require('../utils/util')

// get a list of users
const performList = async (z, bundle) => {
  const response = await z.request({
    url: 'https://app.asana.com/api/1.0/users',
    params: {
      order_by: 'id desc'
    }
  });
  nameIdKey(response.data.data, 'gid')
  return response.data.data
};

module.exports = {

  key: 'user',
  noun: 'User',

  list: {
    display: {
      label: 'New User',
      description: 'Lists the users.'
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

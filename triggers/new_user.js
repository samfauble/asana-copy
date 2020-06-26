const { nameIdKey } = require('../utils/util')
// triggers on a new new user with a certain tag
const perform = async (z, bundle) => {
  const response = await z.request({
    url: 'https://app.asana.com/api/1.0/users',
    params: {
      tag: bundle.inputData.tagName
    }
  });
  // this should return an array of objects

  const res = response.data.data
  
  //change key 'gid' to 'id'
  nameIdKey(res, 'gid')
  return res;
};

module.exports = {
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/master/packages/schema/docs/build/schema.md#triggerschema
  key: 'new_user',
  noun: 'New User',

  display: {
    label: 'New New User',
    description: 'Triggers when a new new user is created.'
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [],

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

'use strict';
const redirect_uri = "https://zapier.com/dashboard/auth/oauth/return/App109213CLIAPI/"

const getAccessToken = async (z, bundle) => {
  const response = await z.request({
    url: 'https://app.asana.com/-/oauth_token',
    method: 'POST',
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: bundle.inputData.code,
      redirect_uri: '{{bundle.inputData.redirect_uri}}',

      // Extra data can be pulled from the querystring. For instance:
      // 'accountDomain': bundle.cleanedRequest.querystring.accountDomain
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'Unable to fetch access token: ' + response.content,
      'getAccessTokenError',
      response.status
    );
  }

  // This function should return `access_token`.
  // If your app does an app refresh, then `refresh_token` should be returned here
  // as well
  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

const refreshAccessToken = async (z, bundle) => {
  const response = await z.request({
    url: 'https://app.asana.com/-/oauth_token',
    method: 'POST',
    body: {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: bundle.authData.refresh_token,
      redirect_uri: '{{bundle.inputData.redirect_uri}}',
    },
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
  });

  if (response.status !== 200) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'Unable to fetch access token: ' + response.content,
      'refreshAccessTokenError',
      response.status
    );
  }

  // This function should return `access_token`.
  // If the refresh token stays constant, no need to return it.
  // If the refresh token does change, return it here to update the stored value in
  // Zapier
  return {
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
  };
};

// This function runs before every outbound request. You can have as many as you
// need. They'll need to each be registered in your index.js file.
const includeBearerToken = (request, z, bundle) => {
  if (bundle.authData.access_token) {
    request.headers.Authorization = `Bearer ${bundle.authData.access_token}`;
  }

  return request;
};

// This function runs after every outbound request. You can use it to check for
// errors or modify the response. You can have as many as you need. They'll need
// to each be registered in your index.js file.
const handleBadResponses = (response, z, bundle) => {
  if (response.status === 401) {
    throw new z.errors.Error(
      // This message is surfaced to the user
      'The access token you supplied is incorrect',
      'AuthenticationError',
      response.status
    );
  }

  return response;
};

// You want to make a request to an endpoint that is either specifically designed
// to test auth, or one that every user will have access to. eg: `/me`.
// By returning the entire request object, you have access to the request and
// response data for testing purposes. Your connection label can access any data
// from the returned response using the `json.` prefix. eg: `{{json.username}}`.
const test = (z, bundle) =>
  z.request({ url: 'https://auth-json-server.zapier-staging.com/me' });

module.exports = {
  config: {
    // OAuth2 is a web authentication standard. There are a lot of configuration
    // options that will fit most any situation.
    type: 'oauth2',
    oauth2Config: {
      authorizeUrl: {
        url: 'https://app.asana.com/-/oauth_authorize',
        params: {
          client_id: '{{process.env.CLIENT_ID}}',
          state: '{{bundle.inputData.state}}',
          redirect_uri: '{{bundle.inputData.redirect_uri}}',
          response_type: 'code',
        },
      },
      getAccessToken,
      refreshAccessToken,
      autoRefresh: true,
    },

    // Define any input app's auth requires here. The user will be prompted to enter
    // this info when they connect their account.
    fields: [],

    // The test method allows Zapier to verify that the credentials a user provides
    // are valid. We'll execute this method whenver a user connects their account for
    // the first time.
    test,

    // This template string can access all the data returned from the auth test. If
    // you return the test object, you'll access the returned data with a label like
    // `{{json.X}}`. If you return `response.data` from your test, then your label can
    // be `{{X}}`. This can also be a function that returns a label. That function has
    // the standard args `(z, bundle)` and data returned from the test can be accessed
    // in `bundle.inputData.X`.
    connectionLabel: '{{json.username}}',
  },
  befores: [includeBearerToken],
  afters: [handleBadResponses],
};

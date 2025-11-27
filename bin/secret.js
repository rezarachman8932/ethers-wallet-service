const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const { GoogleAuth } = require('google-auth-library');
require('dotenv').config();

const getGoogleSecret = async () => {
  if (process.env.GCLOUDENV) {
    // eslint-disable-next-line no-console
    console.log('attempting to load secrets');

    try {
      // Google Cloud Run processes the secrets authentication and stores it in the variable of choice.
      // We just have to reassign it back to process.env if the service is running from Cloud Run.
      const envVars = JSON.parse(process.env.GCLOUDENV);
      Object.assign(process.env, envVars[process.env.SM_ENV] || 'dev');
      console.log('secret manager env:', process.env.SM_ENV);
      console.log(process.env.NODE_PORT);
    } catch (exception) {
      console.warn(exception);
      try {
        // Authentication required for local device connection
        const auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });
        const client = new SecretManagerServiceClient({ auth });

        const [version] = await client.accessSecretVersion({
          name: process.env.GCLOUDENV,
        });

        const secretPayload = version.payload.data.toString('utf8');
        const envVars = JSON.parse(secretPayload);
        Object.assign(process.env, envVars[process.env.SM_ENV] || 'dev');
        // eslint-disable-next-line no-console
        console.log('loaded secrets');
        console.log('secret manager env:', process.env.SM_ENV);
        console.log(process.env.NODE_PORT);
      } catch (exception) {
        console.warn(exception);
        console.error('Failed to retrieve google secrets');
        process.exit(1);
      }
    }
  }
};

module.exports = getGoogleSecret;

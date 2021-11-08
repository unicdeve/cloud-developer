// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '3fo4a8bno5'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-8ad8olgg.us.auth0.com', // Auth0 domain
  clientId: 'S1ZY6f6AtRj34F3QPweIFA4b8GpuLrvc', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

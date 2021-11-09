const apiId = 'fbsov3ogi4'
const stage = 'dev'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/${stage}`

export const authConfig = {
  domain: 'dev-8ad8olgg.us.auth0.com', // Auth0 domain
  clientId: 'S1ZY6f6AtRj34F3QPweIFA4b8GpuLrvc', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}

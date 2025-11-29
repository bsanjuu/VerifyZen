import env from './env';

export const linkedinConfig = {
  clientId: env.LINKEDIN_CLIENT_ID,
  clientSecret: env.LINKEDIN_CLIENT_SECRET,
  apiKey: env.LINKEDIN_API_KEY,

  // LinkedIn API endpoints
  endpoints: {
    auth: 'https://www.linkedin.com/oauth/v2/authorization',
    token: 'https://www.linkedin.com/oauth/v2/accessToken',
    profile: 'https://api.linkedin.com/v2/me',
    email: 'https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))',
    positions: 'https://api.linkedin.com/v2/positions',
  },

  // OAuth scopes
  scopes: [
    'r_liteprofile',
    'r_emailaddress',
    'r_basicprofile',
  ],

  // Rate limiting
  rateLimit: {
    maxRequests: 100,
    windowMs: 60000, // 1 minute
  },
};

export default linkedinConfig;

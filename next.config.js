module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["s1.ticketm.net"], //make it 'your-domain.com'
  },
  serverRuntimeConfig: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    AUTH0_ID: process.env.AUTH0_ID,
    AUTHO_SECRET: process.env.AUTH0_SECRET,
    AUTH0_ISSUER: process.env.AUTH0_ISSUER,
  },
};

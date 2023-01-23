module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["s1.ticketm.net"], //make it 'your-domain.com'
  },
  serverRuntimeConfig: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    FACEBOOK_ID: process.env.FACEBOOK_ID,
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET,
    GITHUB_ID: process.env.GITHUB_ID,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    TWITTER_ID: process.env.TWITTER_ID,
    TWITTER_SECRET: process.env.TWITTER_SECRET,
  },
};

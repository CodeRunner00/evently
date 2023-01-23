import getConfig from "next/config";

// TODO -> This is just a "for now" fix, find long term solution
const { serverRuntimeConfig = {} } = getConfig() ?? {};

export const server = {
  NEXTAUTH_URL: serverRuntimeConfig.NEXTAUTH_URL,
  NEXTAUTH_SECRET: serverRuntimeConfig.NEXTAUTH_SECRET,
  FACEBOOK_ID: serverRuntimeConfig.FACEBOOK_ID,
  FACEBOOK_SECRET: serverRuntimeConfig.FACEBOOK_SECRET,
  GITHUB_ID: serverRuntimeConfig.GITHUB_ID,
  GITHUB_SECRET: serverRuntimeConfig.GITHUB_SECRET,
  GOOGLE_ID: serverRuntimeConfig.GOOGLE_ID,
  GOOGLE_SECRET: serverRuntimeConfig.GOOGLE_SECRET,
  TWITTER_ID: serverRuntimeConfig.TWITTER_ID,
  TWITTER_SECRET: serverRuntimeConfig.TWITTER_SECRET,
};

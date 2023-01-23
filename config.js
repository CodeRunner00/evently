import getConfig from "next/config";

// TODO -> This is just a "for now" fix, find long term solution
const { serverRuntimeConfig = {} } = getConfig() ?? {};

export const server = {
  NEXTAUTH_URL: serverRuntimeConfig.NEXTAUTH_URL,
  NEXTAUTH_SECRET: serverRuntimeConfig.NEXTAUTH_SECRET,
  GITHUB_ID: serverRuntimeConfig.GITHUB_ID,
  GITHUB_SECRET: serverRuntimeConfig.GITHUB_SECRET,
  GOOGLE_ID: serverRuntimeConfig.GOOGLE_ID,
  GOOGLE_SECRET: serverRuntimeConfig.GOOGLE_SECRET,
  AUTH0_ID: serverRuntimeConfig.AUTH0_ID,
  AUTHO_SECRET: serverRuntimeConfig.AUTHO_SECRET,
  AUTH0_ISSUER: serverRuntimeConfig.AUTH0_ISSUER,
};

import NextAuth, { NextAuthOptions } from "next-auth";
import { server } from "../../../config";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";
import initConnection from "../../../lib/mongodb";
import userModel from "../../../lib/models";
// import AppleProvider from "next-auth/providers/apple"
// import EmailProvider from "next-auth/providers/email"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
// const logger = new Amplify.Logger("EventlyNexAuthLogger");

// logger.info(`NextAuth env variable ${process.env.NEXTAUTH_URL}`);
console.log("server is ", server);
console.log("process.env.NEXTAUTH_URL is ", process.env.NEXTAUTH_URL);
process.env.NEXTAUTH_URL = server.NEXTAUTH_URL;
console.log("process.env.NEXTAUTH_URL updated is ", process.env.NEXTAUTH_URL);
export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth
  providers: [
    /* EmailProvider({
         server: process.env.EMAIL_SERVER,
         from: process.env.EMAIL_FROM,
       }),
    // Temporarily removing the Apple provider from the demo site as the
    // callback URL for it needs updating due to Vercel changing domains

    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: {
        appleId: process.env.APPLE_ID,
        teamId: process.env.APPLE_TEAM_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
        keyId: process.env.APPLE_KEY_ID,
      },
    }),
    */
    FacebookProvider({
      clientId: server.FACEBOOK_ID,
      clientSecret: server.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: server.GITHUB_ID,
      clientSecret: server.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: server.GOOGLE_ID,
      clientSecret: server.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    TwitterProvider({
      clientId: server.TWITTER_ID,
      clientSecret: server.TWITTER_SECRET,
    }),
  ],
  secret: server.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },
    async signIn({ user: signedUser, account, profile, email, credentials }) {
      console.log("signing in! ", signedUser);
      await initConnection();

      try {
        const existingUser = await userModel.findOne({
          email: signedUser.email,
        });
        console.log("existing user is ", existingUser);
        if (!existingUser) {
          const user = new userModel({ email: signedUser.email, events: [] });
          try {
            await user.save();
          } catch (error) {
            console.log("error saving user ", error);
          }
        }
        return true;
      } catch (err) {
        console.log("error finding user.. ", err);
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      console.log("in redirect callback url is ", url, " basUrl is ", baseUrl);
      return url;
    },
  },
};

export default NextAuth(authOptions);

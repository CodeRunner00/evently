import NextAuth, { NextAuthOptions } from "next-auth";
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
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
  ],
  secret: process.env.NEXT_PUBLIC_SECRET,
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
          console.log("user is ", user);
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

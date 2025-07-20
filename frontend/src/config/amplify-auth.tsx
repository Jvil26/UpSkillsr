import { type ResourcesConfig } from "aws-amplify";

const isProd = process.env.NODE_ENV === "production";

const authConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID as string,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_DOMAIN as string,
          scopes: ["openid", "email", "phone", "profile", "aws.cognito.signin.user.admin"],
          redirectSignIn: isProd
            ? ["https://main.dwvxczjg8uzxn.amplifyapp.com", "https://upskillsr.com", "https://www.upskillsr.com"]
            : ["http://localhost:3000/"],
          redirectSignOut: isProd
            ? [
                "https://main.dwvxczjg8uzxn.amplifyapp.com/sign-in",
                "https://upskillsr.com/sign-in",
                "https://www.upskillsr.com/sign-in",
              ]
            : ["http://localhost:3000/sign-in"],
          responseType: "code",
        },
        username: true,
      },
    },
  },
};

export default authConfig;

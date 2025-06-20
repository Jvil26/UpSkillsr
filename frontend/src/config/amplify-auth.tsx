import { type ResourcesConfig } from "aws-amplify";

const authConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID as string,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_USER_POOL_CLIENT_ID as string,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AWS_DOMAIN as string,
          scopes: ["openid", "email", "phone"],
          redirectSignIn: ["http://localhost:3000/"],
          redirectSignOut: ["http://localhost:3000/"],
          responseType: "code",
        },
        username: true,
      },
    },
  },
};

export default authConfig;

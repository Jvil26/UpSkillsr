"use client";

import { useEffect } from "react";
import { Amplify } from "aws-amplify";
import authConfig from "@/config/amplify-auth";

export default function AmplifyWrapper() {
  useEffect(() => {
    Amplify.configure(authConfig);
  }, []);

  return null;
}

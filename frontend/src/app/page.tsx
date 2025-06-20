"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  signOut,
  signInWithRedirect,
  getCurrentUser,
  type AuthUser,
  fetchAuthSession,
  AuthTokens,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { Amplify } from "aws-amplify";
import { useRouter } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getUser();
          break;
        case "signInWithRedirect_failure":
          console.log("An error occurred signing in");
          break;
      }
    });
    getUser();

    return unsubscribe;
  }, []);

  const getUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser(currentUser);
      setTokens(session?.tokens || null);
      console.log("Current User: ", currentUser);
      console.log("Tokens: ", tokens);
    } catch (error) {
      console.error("Not Signed in", error);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log(Amplify.getConfig());
      await signOut();
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  return (
    <div>
      <h1 className="text-center">Welcome back, {user?.username}</h1>
      <Button onClick={() => handleSignIn()}>Sign In</Button>
      <Button onClick={() => handleSignOut()}>Sign Out</Button>
    </div>
  );
}

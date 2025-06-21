"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { signInWithRedirect, getCurrentUser, type AuthUser, fetchAuthSession, AuthTokens } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getAuth();
          break;
        case "signInWithRedirect_failure":
          console.log("An error occurred signing in");
          break;
      }
    });
    getAuth();
    return unsubscribe;
  }, []);

  const getAuth = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setUser(currentUser);
      setTokens(session?.tokens || null);
      console.log("Current User: ", currentUser);
      console.log("Tokens: ", session?.tokens);
    } catch (error) {
      console.error("Not Signed in", error);
      setUser(null);
      setTokens(null);
    } finally {
      setLoading(false);
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
    <div className="flex justify-center items-center h-screen">
      {!loading && !user && !tokens && (
        <Button
          onClick={() => handleSignIn()}
          className="dark:bg-white dark:text-black dark:hover:bg-gray-200 w-60 h-14 text-2xl font-bold"
        >
          Sign In
        </Button>
      )}
    </div>
  );
}

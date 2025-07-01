"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateOrFetchUser } from "@/hooks/users";
import { signInWithRedirect, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const { login, loggedIn } = useAuthContext();
  const { mutateAsync: createFetchUser, isError } = useCreateOrFetchUser();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          getAuth();
          break;
        case "signInWithRedirect_failure":
          console.error("An error occurred signing in");
          toast.error("An error occurred signing in. Please try again.");
          break;
      }
    });

    getAuth();
    return unsubscribe;
  }, []);

  const getAuth = async () => {
    try {
      if (!loggedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        console.log("Current User: ", currentUser);
        console.log("Tokens: ", session?.tokens);
        const tokens = session?.tokens;
        if (currentUser && tokens) {
          login(currentUser, tokens);
          const userData = {
            username: tokens.idToken?.payload["cognito:username"] as string,
            email: tokens.idToken?.payload.email as string,
            gender: tokens.idToken?.payload.gender as string,
            phone: tokens.idToken?.payload.phone_number as string,
            name: tokens.idToken?.payload.name as string,
          };
          const backendUser = await createFetchUser(userData);
          console.log(backendUser);
          localStorage.setItem("currentUser", JSON.stringify(currentUser));
          localStorage.setItem("tokens", JSON.stringify(tokens));
          router.push("/");
        }
      }
    } catch (error) {
      console.error("Not Signed in", error);
      toast.error("An error occurred signing in. Please try again.");
      // await signOut();
      // logout();
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error("Error signing in: ", error);
      toast.error("An error occurred signing in. Please try again.");
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user details. Please try again.");
    }
  }, [isError]);

  useEffect(() => {
    console.log("LoggedIn: ", loggedIn, "Loading: ", loading);
  }, []);

  if (loading) {
    return <div className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent border-black" />;
  }

  return (
    <div className="flex justify-evenly items-center min-h-screen overflow-y-auto sm:flex-row flex-col">
      <Button
        onClick={() => handleSignIn()}
        className="dark:bg-white dark:text-black dark:hover:bg-gray-200 w-60 h-14 text-lg font-semibold"
      >
        Sign In with Cognito
      </Button>
    </div>
  );
}

"use client";
import { useEffect } from "react";
import { useAuthContext } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCreateOrFetchUser } from "@/hooks/users";
import { signInWithRedirect, getCurrentUser, fetchAuthSession, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function SignIn() {
  const { login, loggedIn, loading, setLoading, logout } = useAuthContext();
  const { mutateAsync: createFetchUser, isError } = useCreateOrFetchUser();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = Hub.listen("auth", async ({ payload }) => {
      switch (payload.event) {
        case "signInWithRedirect":
          await getAuth();
          break;
        case "signInWithRedirect_failure":
          console.error("An error occurred signing in", payload.data);
          toast.error("An error occurred signing in. Please try again.");
          break;
      }
    });

    return unsubscribe;
  }, []);

  const getAuth = async () => {
    setLoading(true);
    try {
      if (!loggedIn) {
        const currentUser = await getCurrentUser();
        const session = await fetchAuthSession();
        console.log("Current User: ", currentUser);
        console.log("Tokens: ", session?.tokens);
        if (currentUser && session?.tokens?.accessToken) {
          const tokens = session.tokens;
          login(currentUser);
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
    setLoading(true);
    try {
      await signInWithRedirect();
    } catch (error) {
      console.error("Error signing in: ", error);
      toast.error("An error occurred signing in. Please try again.");
      await signOut();
      logout();
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch user details. Please try again.");
    }
  }, [isError]);

  return (
    <div className="flex justify-evenly items-center min-h-screen overflow-y-auto sm:flex-row flex-col">
      {loading || loggedIn ? (
        <Loader2 className="w-15 h-15 animate-spin" />
      ) : (
        <Button
          onClick={handleSignIn}
          className="dark:bg-white dark:text-black dark:hover:bg-gray-200 w-60 h-14 text-lg font-semibold"
        >
          Sign In with Cognito
        </Button>
      )}
    </div>
  );
}

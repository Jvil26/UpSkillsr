"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loggedIn, login } = useAuthContext();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    const tokensStr = localStorage.getItem("tokens");
    if (userStr && tokensStr) {
      const user = JSON.parse(userStr);
      const tokens = JSON.parse(tokensStr);
      login(user, tokens);
      console.log(user, tokens);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (authChecked && !loggedIn) {
      console.log("not logged in");
      router.replace("/sign-in");
    }
  }, [loggedIn, router, authChecked]);

  return <>{children}</>;
}

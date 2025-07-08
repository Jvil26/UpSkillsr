"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { loggedIn, login, loading } = useAuthContext();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      login(user);
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    if (authChecked && !loggedIn && !loading) {
      console.log("Not Logged In");
      router.push("/sign-in");
    }
  }, [loggedIn, router, authChecked, loading]);

  return <>{children}</>;
}

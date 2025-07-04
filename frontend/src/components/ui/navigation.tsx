"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuContent,
} from "./navigation-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import Link from "next/link";
import { Button } from "./button";
import { signOut } from "aws-amplify/auth";
import { useAuthContext } from "@/context/auth";
import { useFetchUser } from "@/hooks/users";

export default function NavMenu() {
  const { logout, loggedIn, user } = useAuthContext();
  const { data: userDetails } = useFetchUser();

  const handleSignOut = async () => {
    try {
      await signOut();
      logout();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <NavigationMenu viewport={false} className="fixed h-[var(--nav-height)] z-50">
      <NavigationMenuList className="w-screen justify-start pl-10 dark:bg-slate py-5 dark:bg-slate-100">
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-3xl mr-10 font-bold dark:text-black dark:hover:text-white dark:focus:text-white"
            asChild
          >
            <Link href="/">SkillLog</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem></NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="text-2xl font-medium text-black" asChild>
            <Link href="/journals/">Journals</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        {loggedIn && (
          <NavigationMenuItem className="flex justify-center items-center relative ml-auto mr-8">
            <NavigationMenuTrigger className="hover:!bg-transparent focus:!bg-transparent dark:!bg-white dark:!text-black">
              <NavigationMenuLink asChild>
                <Link href={`/profile/${user?.username}`} className="text-lg">
                  <Avatar className="w-14 h-14 mt-2">
                    <AvatarImage src={userDetails?.profile.profile_pic || "https://github.com/shadcn.png"} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
              </NavigationMenuLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="!mt-4">
              <ul className="grid w-30 gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href={`/profile/${user?.username}`}>Profile</Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Button
                      onClick={() => handleSignOut()}
                      className="bg-transparent w-full dark:text-white font-normal items-start"
                    >
                      Sign Out
                    </Button>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

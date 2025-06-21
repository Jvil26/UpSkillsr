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

export default function NavMenu() {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <NavigationMenu viewport={false} className="fixed">
      <NavigationMenuList className="w-screen justify-start pl-10 dark:bg-slate py-5 dark:bg-slate-100">
        <NavigationMenuItem>
          <NavigationMenuLink
            className="text-3xl mr-10 font-bold dark:text-black dark:hover:text-white dark:focus:text-white"
            asChild
          >
            <Link href="/">SkillsSwap</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem></NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink className="text-2xl font-medium text-black" asChild>
            <Link href="/matches">Matches</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem className="flex justify-center items-center relative ml-auto mr-8">
          <NavigationMenuTrigger className="hover:!bg-transparent focus:!bg-transparent dark:!bg-white dark:!text-black">
            <NavigationMenuLink asChild>
              <Link href="/profile" className="text-lg">
                <Avatar className="w-14 h-14 mt-2">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="!mt-4">
            <ul className="grid w-30 gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <Link href="#">Profile</Link>
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
      </NavigationMenuList>
    </NavigationMenu>
  );
}

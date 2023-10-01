"use client";
import { sidebarLinks } from "@/constants";
import { SheetContent } from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Button } from "@/components/ui/button";
import { SignedOut } from "@clerk/nextjs";

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="flex h-screen flex-col gap-5 pt-[145px] dark:bg-dark-200  shadow-md min-w-[256px] p-5 overflow-hidden">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route;
        return (
          <Link
            href={item.route}
            className={`${
              isActive
                ? " flex primary-gradient rounded-lg gap-3 pt-3 px-5 text-light-900 "
                : "flex text-dark300_light900 "
            }flex items-center justify-start gap-4 p-4 px-4`}
          >
            <Image
              src={item.imgURL}
              alt={item.label}
              width={25}
              height={25}
              className={`${isActive ? "" : "invert-colors"}`}
            />
            <p className={`${isActive ? "" : "text-dark300_light900"}h3-bold `}>
              {item.label}
            </p>
          </Link>
        );
      })}
      <div className="flex flex-col gap-3 py-[175px]">
        <SignedOut>
          <Link href="/sign-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none text-primary-500">
              Login
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="small-medium light-border-2 btn-tertiray text-dark400_light900 min-h-[41px] w-full rounded-lg border px-4 py-3 shadow-none">
              Singup
            </Button>
          </Link>
        </SignedOut>
      </div>
    </section>
  );
};

export default LeftSidebar;

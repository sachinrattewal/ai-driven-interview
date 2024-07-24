"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();
  const router = useRouter();
  const navigateToDashboards = () => {
    router.push(`/dashboard`);
  };

  return (
    <div className="flex p-4 items-center justify-between bg-secondary shadow-sm">
      <Image
        onClick={navigateToDashboards}
        src={"/logo.svg"}
        width={35}
        height={20}
        alt="logo"
        className="cursor-pointer ml-5"
      />
      <ul className="hidden md:flex gap-6">
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard" && "text-primary font-bold"
          }`}
          onClick={navigateToDashboards}
        >
          Dashboard
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/questions" && "text-primary font-bold"
          }`}
        >
          Questions
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/upgrade" && "text-primary font-bold"
          }`}
        >
          Upgrade
        </li>
        <li
          className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${
            path === "/dashboard/how" && "text-primary font-bold"
          }`}
        >
          How it works ?
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;

"use client";

import Image from "next/image";
import Link from "next/link";

import logo from "#/public/svg/logo.svg";

export default function AppLogo() {
  return (
    <Link href="/">
      <Image src={logo} width={40} height={40} alt="tradify" priority />
    </Link>
  );
}

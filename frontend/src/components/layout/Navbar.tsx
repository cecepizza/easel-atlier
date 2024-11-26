"use client";
import React from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Easel-Atelier
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-4">
            <Link href="/configure">Configure</Link>
            <Link href="/preview">Preview</Link>
            <Link href="/checkout">Cart</Link>
          </div>

          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}

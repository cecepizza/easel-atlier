"use client";
import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <p className="text-center text-gray-600">
          © {new Date().getFullYear()} Easel-Atelier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

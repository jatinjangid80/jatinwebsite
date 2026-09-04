"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginModal from "@/components/LoginModal";
import Home from "../page";

export default function LoginPage() {
  const router = useRouter();

  return (
    <>
      <Home />
      <LoginModal isOpen={true} onClose={() => router.push("/")} />
    </>
  );
}

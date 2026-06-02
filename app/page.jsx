"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/auth";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(getSession() ? "/dashboard" : "/login");
  }, []);
  return null;
}

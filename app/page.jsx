"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/auth";

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    getSession().then(session => {
      router.replace(session ? "/dashboard" : "/login");
    });
  }, []);
  return null;
}

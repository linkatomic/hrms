"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/auth";
import Login from "@/src/screens/Login";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (getSession()) router.replace("/dashboard");
  }, []);

  return <Login onLogin={() => router.push("/dashboard")} />;
}

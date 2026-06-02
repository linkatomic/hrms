"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/src/auth";
import Login from "@/src/screens/Login";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Hide boot splash
    const boot = document.getElementById("boot");
    if (boot) {
      boot.style.transition = "opacity 0.4s ease";
      boot.style.opacity = "0";
      boot.style.pointerEvents = "none";
      setTimeout(() => { if (boot) boot.style.display = "none"; }, 400);
    }
    // Redirect if already logged in
    getSession().then(session => {
      if (session) router.replace("/dashboard");
    });
  }, []);

  return <Login onLogin={() => router.push("/dashboard")} />;
}

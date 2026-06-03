"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/contexts/AppContext";
import Login from "@/src/screens/Login";

export default function LoginPage() {
  const router = useRouter();
  const { user, ready } = useApp();

  // Hide boot splash
  useEffect(() => {
    const boot = document.getElementById("boot");
    if (boot) {
      boot.style.transition = "opacity 0.4s ease";
      boot.style.opacity = "0";
      boot.style.pointerEvents = "none";
      setTimeout(() => { if (boot) boot.style.display = "none"; }, 400);
    }
  }, []);

  // Auto-redirect once AppContext confirms the user is authenticated
  useEffect(() => {
    if (ready && user) router.replace("/dashboard");
  }, [ready, user]);

  return <Login onLogin={() => router.replace("/dashboard")} />;
}

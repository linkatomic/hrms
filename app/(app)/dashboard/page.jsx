"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/contexts/AppContext";
import Dashboard from "@/src/screens/Dashboard";

export default function DashboardPage() {
  const { data } = useApp();
  const router = useRouter();
  return <Dashboard data={data} setRoute={r => router.push("/" + r)} />;
}

"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/contexts/AppContext";
import Dashboard from "@/src/screens/Dashboard";

export default function DashboardPage() {
  const { data, role, clock } = useApp();
  const router = useRouter();
  return <Dashboard data={data} role={role} setRoute={r => router.push("/" + r)} clock={clock} />;
}

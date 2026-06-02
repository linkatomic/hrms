"use client";
import { useApp } from "@/src/contexts/AppContext";
import Leave from "@/src/screens/Leave";

export default function LeavePage() {
  const { data, role } = useApp();
  return <Leave data={data} role={role} />;
}

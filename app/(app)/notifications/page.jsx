"use client";
import { useRouter } from "next/navigation";
import { useApp } from "@/src/contexts/AppContext";
import Notifications from "@/src/screens/Notifications";

export default function NotificationsPage() {
  const { data } = useApp();
  const router = useRouter();
  return <Notifications data={data} setRoute={r => router.push("/" + r)} />;
}

"use client";
import { useApp } from "@/src/contexts/AppContext";
import Profile from "@/src/screens/Profile";

export default function ProfilePage() {
  const { data, role } = useApp();
  return <Profile data={data} role={role} />;
}

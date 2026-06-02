"use client";
import { useApp } from "@/src/contexts/AppContext";
import Directory from "@/src/screens/Directory";

export default function DirectoryPage() {
  const { data } = useApp();
  return <Directory data={data} />;
}

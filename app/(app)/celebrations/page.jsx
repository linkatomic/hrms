"use client";
import { useApp } from "@/src/contexts/AppContext";
import Celebrations from "@/src/screens/Celebrations";

export default function CelebrationsPage() {
  const { data } = useApp();
  return <Celebrations data={data} />;
}

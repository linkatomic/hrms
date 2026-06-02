"use client";
import { useApp } from "@/src/contexts/AppContext";
import Calendar from "@/src/screens/Calendar";

export default function CalendarPage() {
  const { data } = useApp();
  return <Calendar data={data} />;
}

"use client";
import { useApp } from "@/src/contexts/AppContext";
import Checkin from "@/src/screens/Checkin";

export default function CheckinPage() {
  const { data, clock, setClock } = useApp();
  return <Checkin data={data} clock={clock} setClock={setClock} />;
}

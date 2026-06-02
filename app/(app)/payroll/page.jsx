"use client";
import { useApp } from "@/src/contexts/AppContext";
import Payroll from "@/src/screens/Payroll";

export default function PayrollPage() {
  const { data } = useApp();
  return <Payroll data={data} />;
}

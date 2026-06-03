"use client";
import { AppProvider } from "@/src/contexts/AppContext";

export default function Providers({ children }) {
  return <AppProvider>{children}</AppProvider>;
}

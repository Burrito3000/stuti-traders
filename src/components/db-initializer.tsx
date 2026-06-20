"use client";

import { useEffect } from "react";
import { initDb } from "@/lib/db-simulator";

export function DbInitializer() {
  useEffect(() => {
    initDb();
  }, []);

  return null;
}

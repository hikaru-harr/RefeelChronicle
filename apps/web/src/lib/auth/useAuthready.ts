"use client"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export function useAuthReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, () => {
      setReady(true);
    });
    return unsub;
  }, []);

  return ready;
}

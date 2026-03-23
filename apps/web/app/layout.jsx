"use client"; // important: allows hooks and Supabase client usage

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import "../styles/index.css";

export default function RootLayout({ children }) {
  const [session, setSession] = useState(null);

  // 1️⃣ Get the current session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // 2️⃣ Listen for login/logout events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    // 3️⃣ Clean up listener on unmount
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body>
        {/* optional: you can pass session via context to children */}
        {children}
      </body>
    </html>
  );
}

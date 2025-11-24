"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function LogoutButton() {
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);

  const hidden = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoggedIn(!!token);
  }, []);

  if (hidden || !loggedIn) return null;

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <button
      onClick={logout}
      style={{
        background: "#e11d48",
        border: "none",
        color: "white",
        padding: "8px 14px",
        borderRadius: 6,
        cursor: "pointer",
        fontWeight: 600,
        whiteSpace: "nowrap",
      }}
    >
      Logout
    </button>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to log out");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={logout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}

// "use client";

// import { createClient } from "@/lib/supabase/client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// export function LogoutButton() {
//   const router = useRouter();

//   const logout = async () => {
//     const supabase = createClient();
//     await supabase.auth.signOut();
//     router.push("/login");
//   };

//   return <Button onClick={logout}>Logout</Button>;
// }

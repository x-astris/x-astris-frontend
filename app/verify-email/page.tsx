import { Suspense } from "react";
import VerifyEmailInner from "./VerifyEmailInner";

export const dynamic = "force-dynamic"; // prevents prerender

export default function Page() {
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <VerifyEmailInner />
    </Suspense>
  );
}
import { Suspense } from "react";
import Hero from "@/components/layout/Hero";
import ResetForm from "./ResetForm";

export default function ResetPasswordPage() {
  return (
    <>
      <Hero title="New Password" />
      <section className="py-24 px-6">
        <Suspense fallback={<div className="text-center text-text-secondary">Loading...</div>}>
          <ResetForm />
        </Suspense>
      </section>
    </>
  );
}

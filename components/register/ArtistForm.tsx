"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { artistRegistrationSchema, type ArtistRegistrationData } from "@/lib/validation";
import TermsOfService from "./TermsOfService";
import ConsignmentAgreement from "./ConsignmentAgreement";

export default function ArtistForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtistRegistrationData>({
    resolver: zodResolver(artistRegistrationSchema),
  });

  async function onSubmit(data: ArtistRegistrationData) {
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.push("/register/success");
    }
  }

  const inputClasses =
    "w-full px-4 py-3 border border-purple-light rounded-sm bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-green-light";
  const labelClasses = "block text-sm text-text-secondary mb-1.5";
  const errorClasses = "text-red-600 text-sm mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      {/* Personal Information */}
      <div>
        <h3 className="font-heading text-xl text-purple-dark mb-6">Personal Information</h3>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Full Name *</label>
            <input {...register("fullName")} className={inputClasses} />
            {errors.fullName && <p className={errorClasses}>{errors.fullName.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Email *</label>
            <input type="email" {...register("email")} className={inputClasses} />
            {errors.email && <p className={errorClasses}>{errors.email.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Phone</label>
            <input type="tel" {...register("phone")} className={inputClasses} />
          </div>
          <div>
            <label className={labelClasses}>Website / Portfolio URL</label>
            <input type="url" {...register("website")} placeholder="https://" className={inputClasses} />
            {errors.website && <p className={errorClasses}>{errors.website.message}</p>}
          </div>
        </div>
      </div>

      {/* About Your Work */}
      <div>
        <h3 className="font-heading text-xl text-purple-dark mb-6">About Your Work</h3>
        <div className="space-y-5">
          <div>
            <label className={labelClasses}>Primary Medium *</label>
            <select {...register("medium")} className={inputClasses}>
              <option value="">Select a medium</option>
              <option value="oil">Oil Painting</option>
              <option value="acrylic">Acrylic Painting</option>
              <option value="watercolor">Watercolor</option>
              <option value="drawing">Drawing / Graphite / Charcoal</option>
              <option value="photography">Photography</option>
              <option value="printmaking">Printmaking</option>
              <option value="sculpture">Sculpture</option>
              <option value="mixed-media">Mixed Media</option>
              <option value="vintage">Vintage / Antique Works</option>
              <option value="other">Other</option>
            </select>
            {errors.medium && <p className={errorClasses}>{errors.medium.message}</p>}
          </div>
          <div>
            <label className={labelClasses}>Brief Description of Your Work *</label>
            <textarea
              {...register("description")}
              rows={4}
              className={inputClasses}
              placeholder="Tell us about your artistic practice, inspiration, and the type of work you would like to consign..."
            />
            {errors.description && <p className={errorClasses}>{errors.description.message}</p>}
          </div>
        </div>
      </div>

      {/* Terms & Agreements */}
      <div className="space-y-8">
        <TermsOfService register={register} errors={errors} />
        <ConsignmentAgreement register={register} errors={errors} />
      </div>

      {/* Submit */}
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-10 py-3 bg-purple-dark text-cream rounded-sm hover:bg-purple transition-colors tracking-wide disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </button>
      </div>
    </form>
  );
}

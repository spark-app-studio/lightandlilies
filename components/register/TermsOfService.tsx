import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ArtistRegistrationData } from "@/lib/validation";

interface TermsOfServiceProps {
  register: UseFormRegister<ArtistRegistrationData>;
  errors: FieldErrors<ArtistRegistrationData>;
}

export default function TermsOfService({ register, errors }: TermsOfServiceProps) {
  return (
    <div>
      <h3 className="font-heading text-xl text-purple-dark mb-4">Terms of Service</h3>
      <div className="h-48 overflow-y-auto border border-purple-light rounded-sm p-4 mb-4 text-sm text-text-secondary leading-relaxed bg-white">
        <p className="mb-3">
          <strong>Light &amp; Lilies Artist Terms of Service</strong>
        </p>
        <p className="mb-3">
          Light &amp; Lilies is operated by Spark App Studios LLC. By registering as an
          artist with Light &amp; Lilies, you agree to the following terms:
        </p>
        <p className="mb-3">
          1. <strong>Original Work.</strong> All artwork submitted must be your original creation
          or you must hold the rights to sell or consign the work. Vintage and antique pieces
          must be legally owned by you with clear provenance.
        </p>
        <p className="mb-3">
          2. <strong>Representation.</strong> Light &amp; Lilies acts as a curated marketplace.
          Inclusion on our platform is at our discretion and is based on artistic quality,
          subject matter, and alignment with our mission.
        </p>
        <p className="mb-3">
          3. <strong>Pricing.</strong> Final retail pricing will be determined collaboratively
          between the artist and Light &amp; Lilies.
        </p>
        <p className="mb-3">
          4. <strong>Content Standards.</strong> All artwork must be consistent with the mission
          of Light &amp; Lilies: reflecting the beauty of God&apos;s creation, the Christian faith,
          or the quiet order of the natural world.
        </p>
        <p className="mb-3">
          5. <strong>Intellectual Property.</strong> You retain full ownership of your artwork.
          By listing with us, you grant Light &amp; Lilies a non-exclusive license to display
          images of your work on our website and in promotional materials.
        </p>
        <p className="mb-3">
          6. <strong>Termination.</strong> Either party may end the consignment arrangement
          with 30 days written notice.
        </p>
        <p>
          These terms may be updated from time to time. Continued participation constitutes
          acceptance of any changes.
        </p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register("agreeToTerms")}
          className="mt-1 w-4 h-4 accent-purple-dark"
        />
        <span className="text-sm text-text-secondary">
          I have read and agree to the Terms of Service
        </span>
      </label>
      {errors.agreeToTerms && (
        <p className="text-red-600 text-sm mt-1">{errors.agreeToTerms.message}</p>
      )}
    </div>
  );
}

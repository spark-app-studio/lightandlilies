import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ArtistRegistrationData } from "@/lib/validation";

interface ConsignmentAgreementProps {
  register: UseFormRegister<ArtistRegistrationData>;
  errors: FieldErrors<ArtistRegistrationData>;
}

export default function ConsignmentAgreement({ register, errors }: ConsignmentAgreementProps) {
  return (
    <div>
      <h3 className="font-heading text-xl text-purple-dark mb-4">Consignment Agreement</h3>
      <div className="border border-purple-light rounded-sm p-4 mb-4 text-sm text-text-secondary leading-relaxed bg-white">
        <p className="mb-3">
          <strong>Consignment Fee Structure</strong>
        </p>
        <p className="mb-3">
          Light &amp; Lilies, operated by Spark App Studios LLC, operates on a consignment model. When your artwork sells
          through our platform, a consignment fee applies to cover curation, marketing,
          platform maintenance, and transaction processing.
        </p>
        <p className="mb-3">
          <strong>Standard consignment fee: 30%</strong> of the final sale price.
        </p>
        <p className="mb-3">
          The remaining 70% is paid directly to you within 14 business days of the
          completed sale.
        </p>
        <p className="mb-3">
          There are no upfront listing fees. You are only charged when a sale is completed.
        </p>
        <p>
          Light &amp; Lilies reserves the right to adjust the consignment rate with
          30 days prior written notice.
        </p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          {...register("agreeToConsignment")}
          className="mt-1 w-4 h-4 accent-purple-dark"
        />
        <span className="text-sm text-text-secondary">
          I understand and agree to the consignment fee of 30%
        </span>
      </label>
      {errors.agreeToConsignment && (
        <p className="text-red-600 text-sm mt-1">{errors.agreeToConsignment.message}</p>
      )}
    </div>
  );
}

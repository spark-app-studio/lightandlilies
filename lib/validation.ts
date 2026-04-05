import { z } from "zod";

export const artistRegistrationSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  website: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  medium: z.string().min(1, "Please select a primary medium"),
  description: z.string().min(10, "Please describe your work (at least 10 characters)"),
  agreeToTerms: z.literal(true, {
    message: "You must agree to the Terms of Service",
  }),
  agreeToConsignment: z.literal(true, {
    message: "You must agree to the consignment terms",
  }),
});

export type ArtistRegistrationData = z.infer<typeof artistRegistrationSchema>;

export const emailSignupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const artworkSchema = z.object({
  collectionId: z.string().min(1, "Collection is required"),
  title: z.string().min(1, "Title is required").max(200),
  medium: z.string().max(200).optional().default(""),
  description: z.string().max(2000).optional().default(""),
  imagePath: z.string().min(1, "Image URL is required").max(2000),
  buyUrl: z.string().max(2000).optional().default(""),
});

export const artworkUpdateSchema = artworkSchema.partial();

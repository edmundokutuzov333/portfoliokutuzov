import { z } from "zod";

export const studioWaitlistEmailSchema = z.object({
  email: z.string().trim().email().max(200).transform((email) => email.toLowerCase()),
});

export type StudioWaitlistInput = z.infer<typeof studioWaitlistEmailSchema>;

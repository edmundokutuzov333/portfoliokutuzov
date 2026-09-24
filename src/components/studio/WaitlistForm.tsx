import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(200, "Enter a valid email."),
});

type FormValues = z.infer<typeof schema>;

export function WaitlistForm() {
  const subscribe = useServerFn(subscribeNewsletter);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await subscribe({
        data: { ...values, source: "studio", consent: true },
      });
      reset();

      if ("pendingConfirmation" in result && result.pendingConfirmation) {
        toast("Check your inbox to confirm your Studio subscription.");
      } else if ("alreadySubscribed" in result && result.alreadySubscribed) {
        toast("That email is already confirmed.");
      } else if ("pendingEmail" in result && result.pendingEmail) {
        toast("Your request is saved. The confirmation email is temporarily unavailable.");
      } else {
        toast("Studio waitlist confirmed.");
      }
    } catch {
      toast.error("The Studio waitlist is not ready for new confirmations yet.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor="studio-email" className="text-sm font-semibold text-cal">
            Email address
          </label>
          <input
            id="studio-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "studio-email-error" : "studio-email-note"}
            className="mt-2 h-12 w-full border-2 border-white/30 bg-cal px-3 text-sm text-black placeholder:text-chapa transition focus:border-[var(--work)] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 border-2 border-[var(--work)] bg-[var(--work)] px-5 text-sm font-semibold text-black transition hover:bg-cal disabled:cursor-wait disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--work)] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          {isSubmitting ? "Joining…" : "Notify me"}
        </button>
      </div>

      {errors.email ? (
        <p id="studio-email-error" className="mt-2 text-sm text-red-300" role="alert" aria-live="polite">
          {errors.email.message}
        </p>
      ) : null}

      <p id="studio-email-note" className="mt-3 text-sm leading-6 text-fumo">
        No spam. One email, the day it opens.
      </p>
    </form>
  );
}

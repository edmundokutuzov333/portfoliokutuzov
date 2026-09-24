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
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } =
    useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await subscribe({ data: { ...values, source: "studio", consent: true } });
      reset();
      if (result.alreadySubscribed) toast("That email is already on the list.");
      else if ("pendingConfirmation" in result || "pendingEmail" in result) toast("Check your inbox to confirm your subscription.");
      else toast("You're on the list.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <label htmlFor="studio-email" className="text-sm font-medium text-[#edeef0]">Email address</label>
          <input
            id="studio-email"
            {...register("email")}
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "studio-email-error" : "studio-email-note"}
            className="mt-2 h-12 w-full border-2 border-white/25 bg-[#f2f2ef] px-3 text-sm text-black placeholder:text-[#3f3e3b] transition focus:border-[#25e3c2] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 shrink-0 border-2 border-[#25e3c2] bg-[#25e3c2] px-5 text-sm font-semibold text-[#0a0c10] transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Joining..." : "Notify me"}
        </button>
      </div>
      {errors.email ? <p id="studio-email-error" className="mt-2 text-sm text-[#fca5a5]" role="alert" aria-live="polite">{errors.email.message}</p> : null}
      <p id="studio-email-note" className="mt-3 text-sm text-[#b9b7b0]">No spam. One email, the day it opens.</p>
    </form>
  );
}

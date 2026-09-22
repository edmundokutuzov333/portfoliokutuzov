import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { joinStudioWaitlist } from "@/server/studio-waitlist";

const schema = z.object({
  email: z.string().trim().email("Enter a valid email.").max(200, "Enter a valid email."),
});

type FormValues = z.infer<typeof schema>;

export function WaitlistForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    try {
      const result = await joinStudioWaitlist(values);
      if (result.status === "duplicate") {
        toast("That email's already on the list.");
        return;
      }
      toast("You're on the list. We'll email you the moment it opens.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-xl" noValidate>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1">
          <label htmlFor="studio-email" className="sr-only">
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
            className="h-11 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-sm text-white placeholder:text-white/30 transition focus:border-[#25e3c2] focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 shrink-0 rounded-md bg-[#25e3c2] px-5 text-sm font-semibold text-[#0a0c10] transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
        >
          {isSubmitting ? "Joining..." : "Notify me"}
        </button>
      </div>
      {errors.email ? (
        <p id="studio-email-error" className="mt-2 text-xs text-[#fca5a5]" role="alert">
          Enter a valid email.
        </p>
      ) : null}
      <p id="studio-email-note" className="mt-3 text-xs text-white/40">
        No spam. One email, the day it opens.
      </p>
    </form>
  );
}

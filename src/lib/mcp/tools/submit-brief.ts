import { defineTool } from "@lovable.dev/mcp-js";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

export default defineTool({
  name: "submit_brief",
  title: "Submit a project brief",
  description:
    "Submit a new project briefing to Edmundo Kutuzov. Creates a record in the briefing inbox and notifies the studio.",
  inputSchema: {
    full_name: z.string().trim().min(1).max(200).describe("Contact full name."),
    email: z.string().trim().email().max(200).describe("Contact email."),
    company_name: z.string().trim().max(200).optional().describe("Company or brand name."),
    project_type: z
      .string()
      .trim()
      .min(1)
      .max(120)
      .describe("Type of project, e.g. `Brand Identity`, `Art Direction`."),
    urgency: z
      .enum(["low", "normal", "high", "urgent"])
      .describe("How urgent the project is."),
    budget_range: z.string().trim().max(80).optional().describe("Budget bracket, e.g. `€15K - €40K`."),
    currency: z
      .enum(["EUR", "USD", "MZN", "GBP", "BRL"])
      .optional()
      .describe("Currency (default EUR)."),
    message: z
      .string()
      .trim()
      .min(10)
      .max(4000)
      .describe("Brief description of the project (10+ chars)."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: true },
  handler: async (input) => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) {
      return { content: [{ type: "text", text: "Backend not configured" }], isError: true };
    }
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase
      .from("briefing_submissions")
      .insert({
        full_name: input.full_name,
        email: input.email,
        company_name: input.company_name ?? null,
        project_type: input.project_type,
        urgency: input.urgency,
        budget_range: input.budget_range ?? null,
        currency: input.currency ?? "EUR",
        message: input.message,
      })
      .select("id")
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [
        {
          type: "text",
          text: `Brief received. Reference id: ${data.id}. Edmundo will reply within 48h.`,
        },
      ],
      structuredContent: { id: data.id },
    };
  },
});

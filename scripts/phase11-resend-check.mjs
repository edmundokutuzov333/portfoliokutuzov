const API = "https://api.resend.com/emails";
const key = process.env.RESEND_API_KEY?.trim();
const from = process.env.BRIEFING_FROM?.trim();
const admin = process.env.BRIEFING_ADMIN_EMAIL?.trim();

if (!key || !from || !admin) {
  console.log("PHASE11_RESEND_CHECK=SKIPPED");
  console.log("Reason: RESEND_API_KEY, BRIEFING_FROM or BRIEFING_ADMIN_EMAIL is not available in the execution environment.");
  process.exit(0);
}

async function send(to, subject) {
  const response = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      text: "Phase 11 end-to-end delivery check for edmundokutuzov.art contact.",
    }),
  });

  const body = await response.json();
  if (!response.ok || !body?.id) {
    throw new Error("Resend send failed: " + JSON.stringify(body));
  }
  return body.id;
}

async function inspect(id) {
  const response = await fetch(API + "/" + encodeURIComponent(id), {
    headers: { Authorization: "Bearer " + key },
  });
  const body = await response.json();
  if (!response.ok) throw new Error("Resend inspect failed: " + JSON.stringify(body));
  return body;
}

const clientId = await send(["delivered@resend.dev"], "Phase 11 delivery test");
const adminId = await send([admin], "Phase 11 internal delivery test");

let delivered = false;
for (let attempt = 0; attempt < 12; attempt += 1) {
  const client = await inspect(clientId);
  const event = String(client?.last_event ?? "").toLowerCase();
  console.log("delivery", attempt + 1, event || "pending");
  if (event === "delivered") {
    delivered = true;
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

if (!delivered) {
  throw new Error("Phase 11 delivered@resend.dev check did not reach delivered.");
}

const adminResult = await inspect(adminId);
console.log(JSON.stringify({
  phase11: "PASS",
  client_email_id: clientId,
  admin_email_id: adminId,
  admin_last_event: adminResult?.last_event ?? null,
}));

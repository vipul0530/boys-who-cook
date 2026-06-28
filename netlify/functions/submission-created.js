// Netlify event-triggered function: fires on every Netlify Forms submission.
// Sends a warm confirmation email to the parent via Resend.
// - Only processes the "waiver" form; ignores everything else.
// - Never blocks the submission from being recorded: any problem is logged
//   and the function exits 200.

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const payload = body.payload || {};

    // Only act on the waiver form.
    if (payload.form_name !== "waiver") {
      return { statusCode: 200, body: "Ignored: not the waiver form." };
    }

    const data = payload.data || {};
    const parentEmail = String(data.parent_email || "").trim();
    const parentName = String(data.parent_name || "").trim() || "there";
    const participantName = String(data.participant_name || "").trim() || "your child";
    const workshopName = String(data.workshop_name || "").trim() || "Boys Who Cook workshop";
    const workshopDate = String(data.workshop_date || "").trim();

    // Gracefully skip if the parent email is missing or invalid.
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail);
    if (!parentEmail || !emailValid) {
      console.log("Waiver submission has no valid parent email; skipping confirmation email.");
      return { statusCode: 200, body: "No valid parent email; skipped." };
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("RESEND_API_KEY is not set; skipping confirmation email.");
      return { statusCode: 200, body: "No API key configured; skipped." };
    }

    // "from" address: defaults to Resend's onboarding sender so it works
    // immediately. Set RESEND_FROM to a verified address (e.g.
    // "Boys Who Cook <noreply@boyswhocook.org>") once the domain is verified.
    const fromAddress = process.env.RESEND_FROM || "Boys Who Cook <onboarding@resend.dev>";

    const datePhrase = workshopDate ? ` on ${workshopDate}` : "";
    const text =
      `Hi ${parentName},\n\n` +
      `Thank you! We have received your signed waiver for ${participantName} for the ${workshopName}${datePhrase}. ` +
      `We are so glad your child is joining us, and we can't wait to get cooking!\n\n` +
      `If you have any questions before the workshop, just reply to this email.\n\n` +
      `Warmly,\n` +
      `The Boys Who Cook Team`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [parentEmail],
        subject: "We received your Boys Who Cook waiver",
        text,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.log("Resend send failed:", res.status, detail);
      return { statusCode: 200, body: "Email send failed; submission still recorded." };
    }

    console.log("Confirmation email sent to", parentEmail);
    return { statusCode: 200, body: "Confirmation email sent." };
  } catch (err) {
    console.log("submission-created function error:", err && err.message);
    return { statusCode: 200, body: "Handled error gracefully." };
  }
};

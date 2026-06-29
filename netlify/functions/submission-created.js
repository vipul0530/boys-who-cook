// Netlify event-triggered function: fires on every Netlify Forms submission.
// Sends a polished confirmation email (via Resend) to BOTH the parent and the
// participant when the "waiver" form is submitted.
// - Only processes the "waiver" form; ignores everything else.
// - Never blocks the submission from being recorded: any problem is logged
//   and the function exits 200.

const { buildSignedWaiverPdf } = require("../lib/signed-waiver-pdf");

const BRAND = {
  navy: "#1B3A5C",
  navyDark: "#0A1624",
  teal: "#2C7A7B",
  ink: "#374151",
  muted: "#6B7280",
  line: "#E5E7EB",
  bg: "#EEF3FA",
  logo: "https://boyswhocook.org/images/uploads/screenshot-2026-03-22-at-7.24.53-pm.png",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Convert an HTML date input value (YYYY-MM-DD) to US format MM/DD/YYYY.
// Splits on the literal string to avoid any timezone shifting.
function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso).trim());
  return m ? `${m[2]}/${m[3]}/${m[1]}` : String(iso).trim();
}

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Build the plain-text and HTML versions of the confirmation email.
function buildEmail({ greetingName, participantName, workshopName, workshopDate }) {
  const datePhrase = workshopDate ? ` on ${workshopDate}` : "";
  const subject = "We received your Boys Who Cook liability form";

  const text =
    `Dear ${greetingName},\n\n` +
    `Thank you. We are writing to confirm that we have received your completed liability form for ${participantName} for the ${workshopName}${datePhrase}.\n\n` +
    `It is our pleasure to welcome you to Boys Who Cook, and we look forward with great enthusiasm to having ${participantName} join us in the workshop. Our team is committed to providing a safe, encouraging, and inspiring environment where every young cook can learn, grow, and enjoy the experience.\n\n` +
    `Should you have any questions before the workshop, you are warmly invited to send an email to info@boyswhocook.org.\n\n` +
    `With warm regards,\n` +
    `The Boys Who Cook Team`;

  const detailRow = (label, value) =>
    value
      ? `<tr>
           <td style="padding:6px 0;color:${BRAND.muted};font-size:13px;width:140px;">${esc(label)}</td>
           <td style="padding:6px 0;color:${BRAND.ink};font-size:13px;font-weight:600;">${esc(value)}</td>
         </tr>`
      : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(10,22,36,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,${BRAND.navy} 0%,${BRAND.navyDark} 100%);padding:36px 40px;text-align:center;">
              <img src="${BRAND.logo}" alt="Boys Who Cook" width="64" height="64" style="display:inline-block;border-radius:50%;background:#ffffff;margin-bottom:12px;">
              <div style="color:#ffffff;font-size:22px;font-weight:700;letter-spacing:0.5px;">Boys Who Cook</div>
              <div style="color:rgba(255,255,255,0.7);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin-top:4px;">Empowering Boys Through Cooking</div>
            </td>
          </tr>

          <!-- Confirmation banner -->
          <tr>
            <td style="padding:28px 40px 8px;text-align:center;">
              <div style="display:inline-block;background:${BRAND.teal};color:#ffffff;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;padding:6px 16px;border-radius:999px;">Liability Form Received</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:16px 40px 8px;">
              <p style="margin:0 0 16px;color:${BRAND.ink};font-size:16px;line-height:1.6;">Dear ${esc(greetingName)},</p>
              <p style="margin:0 0 16px;color:${BRAND.ink};font-size:15px;line-height:1.7;">
                Thank you. We are writing to confirm that we have received your completed liability form for
                <strong>${esc(participantName)}</strong> for the <strong>${esc(workshopName)}</strong>${datePhrase ? ` <strong>${esc(datePhrase.trim())}</strong>` : ""}.
              </p>
              <p style="margin:0 0 16px;color:${BRAND.ink};font-size:15px;line-height:1.7;">
                It is our pleasure to welcome you to Boys Who Cook, and we look forward with great enthusiasm to having
                ${esc(participantName)} join us in the workshop. Our team is committed to providing a safe, encouraging,
                and inspiring environment where every young cook can learn, grow, and enjoy the experience.
              </p>
            </td>
          </tr>

          <!-- Details card -->
          <tr>
            <td style="padding:8px 40px 8px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};border-radius:12px;padding:16px 20px;">
                <tr><td>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                    ${detailRow("Participant", participantName)}
                    ${detailRow("Workshop", workshopName)}
                    ${detailRow("Date", workshopDate)}
                  </table>
                </td></tr>
              </table>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="padding:16px 40px 8px;">
              <p style="margin:0 0 16px;color:${BRAND.ink};font-size:15px;line-height:1.7;">
                Should you have any questions before the workshop, you are warmly invited to send an email to <a href="mailto:info@boyswhocook.org" style="color:${BRAND.teal};text-decoration:none;font-weight:600;">info@boyswhocook.org</a>.
              </p>
              <p style="margin:24px 0 4px;color:${BRAND.ink};font-size:15px;line-height:1.6;">With warm regards,</p>
              <p style="margin:0;color:${BRAND.navy};font-size:15px;font-weight:700;">The Boys Who Cook Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 40px 36px;border-top:1px solid ${BRAND.line};margin-top:16px;">
              <p style="margin:0;color:${BRAND.muted};font-size:12px;line-height:1.6;text-align:center;">
                Boys Who Cook is a youth nonprofit empowering young boys through the culinary arts.<br>
                This message confirms receipt of your liability form. Please keep it for your records.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

async function sendEmail(apiKey, from, to, message, attachments) {
  const toList = Array.isArray(to) ? to : [to];
  const payload = {
    from,
    to: toList,
    subject: message.subject,
    html: message.html,
    text: message.text,
  };
  if (attachments && attachments.length) payload.attachments = attachments;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.log("Resend send failed for", toList.join(", "), "-", res.status, detail);
    return false;
  }
  console.log("Email sent to", toList.join(", "));
  return true;
}

// Build the internal admin notification: a clean summary of every field, with
// the two signatures sent as PNG attachments (viewable in Gmail).
function buildAdminEmail(data, participantName, workshopName) {
  const subject = `New signed waiver: ${participantName}`;
  const rows = [
    ["Participant (Minor)", data.participant_name],
    ["Date of Birth", data.date_of_birth],
    ["Participant Email", data.participant_email],
    ["Participant Phone", data.participant_phone],
    ["Parent / Guardian", data.parent_name],
    ["Parent Email", data.parent_email],
    ["Parent Phone", data.parent_phone],
    ["Workshop", data.workshop_name],
    ["Workshop Date", data.workshop_date],
    ["Facility", data.facility],
    ["Allergies / Dietary", data.allergies],
    ["Emergency Contact", data.emergency_contact_name],
    ["Emergency Phone", data.emergency_contact_phone],
    ["Photo Opt-Out", data.photo_opt_out ? "YES (do not photograph)" : "No"],
    ["Parent Printed Name", data.parent_printed_name],
    ["Participant Printed Name", data.participant_printed_name],
    ["Acknowledged Terms", data.acknowledgment ? "Yes" : "No"],
    ["Date Signed", data.signed_date],
  ];

  const textRows = rows.map(([k, v]) => `${k}: ${String(v || "").trim() || "-"}`).join("\n");
  const text = `New signed waiver received.\n\n${textRows}\n\nThe full signed waiver, including both signatures, is attached as a PDF.`;

  const htmlRows = rows
    .map(
      ([k, v]) =>
        `<tr>
           <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;color:#6B7280;font-size:13px;white-space:nowrap;vertical-align:top;">${esc(k)}</td>
           <td style="padding:8px 12px;border-bottom:1px solid #E5E7EB;color:#1f2937;font-size:13px;font-weight:600;">${esc(String(v || "").trim() || "-")}</td>
         </tr>`
    )
    .join("");

  const html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#EEF3FA;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;">
      <tr><td style="background:#13294a;padding:22px 28px;">
        <div style="color:#ffffff;font-size:18px;font-weight:700;">New Signed Waiver</div>
        <div style="color:rgba(255,255,255,0.7);font-size:13px;margin-top:2px;">${esc(participantName)} &middot; ${esc(workshopName)}</div>
      </td></tr>
      <tr><td style="padding:20px 28px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${htmlRows}</table>
        <p style="margin:18px 0 0;color:#6B7280;font-size:13px;line-height:1.6;">The full signed waiver, including both signatures, is attached to this email as a PDF.</p>
      </td></tr>
    </table>
  </body></html>`;

  return { subject, text, html };
}

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
    const participantEmail = String(data.participant_email || "").trim();
    const parentName = String(data.parent_name || "").trim() || "Parent or Guardian";
    const participantName = String(data.participant_name || "").trim() || "your child";
    const workshopName = String(data.workshop_name || "").trim() || "Boys Who Cook Workshop";
    const workshopDate = formatDate(data.workshop_date || "");

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log("RESEND_API_KEY is not set; skipping confirmation email.");
      return { statusCode: 200, body: "No API key configured; skipped." };
    }

    // "from" address: defaults to Resend's onboarding sender so it works
    // immediately. Set RESEND_FROM to a verified address (e.g.
    // "Boys Who Cook <noreply@boyswhocook.org>") once the domain is verified.
    const fromAddress = process.env.RESEND_FROM || "Boys Who Cook <onboarding@resend.dev>";

    // Send a personalized email to each valid, unique recipient.
    const recipients = [];
    if (EMAIL_RE.test(parentEmail)) {
      recipients.push({ email: parentEmail, greetingName: parentName });
    }
    if (EMAIL_RE.test(participantEmail) && participantEmail.toLowerCase() !== parentEmail.toLowerCase()) {
      recipients.push({ email: participantEmail, greetingName: participantName });
    }

    if (recipients.length === 0) {
      console.log("Waiver submission has no valid parent or participant email; skipping.");
      return { statusCode: 200, body: "No valid recipient email; skipped." };
    }

    const results = await Promise.all(
      recipients.map((r) => {
        const message = buildEmail({
          greetingName: r.greetingName,
          participantName,
          workshopName,
          workshopDate,
        });
        return sendEmail(apiKey, fromAddress, r.email, message);
      })
    );

    const sent = results.filter(Boolean).length;

    // Internal admin notification with the signed-waiver PDF attached.
    const adminList = (process.env.ADMIN_EMAILS || "shaanbhavsar@gmail.com,vipul30@gmail.com")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => EMAIL_RE.test(s));

    if (adminList.length) {
      const adminMessage = buildAdminEmail(data, participantName, workshopName);

      // Generate the signed-waiver PDF (fields + terms + both signatures) and
      // attach it. If PDF generation fails, still send the summary email.
      let attachments;
      try {
        const safe = (participantName || "participant").replace(/[^a-z0-9]+/gi, "-").toLowerCase();
        const pdfBase64 = await buildSignedWaiverPdf(data);
        attachments = [
          { filename: `signed-waiver-${safe}.pdf`, content: pdfBase64, contentType: "application/pdf" },
        ];
      } catch (e) {
        console.log("Signed-waiver PDF generation failed:", e && e.message);
      }

      // Send to each admin individually so one blocked recipient (e.g. on the
      // Resend test sender, which only delivers to the account owner) does not
      // prevent the others from receiving the email + PDF.
      await Promise.all(
        adminList.map((to) => sendEmail(apiKey, fromAddress, to, adminMessage, attachments))
      );
    }

    return { statusCode: 200, body: `Confirmation emails sent: ${sent}/${recipients.length}; admin notified.` };
  } catch (err) {
    console.log("submission-created function error:", err && err.message);
    return { statusCode: 200, body: "Handled error gracefully." };
  }
};

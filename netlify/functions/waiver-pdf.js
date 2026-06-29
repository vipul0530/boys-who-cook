// Generates and returns the signed-waiver PDF for one submission.
// Guarded by the same admin password cookie as the listing page.

const { authed } = require("../lib/admin-auth");
const { buildSignedWaiverPdf } = require("../lib/signed-waiver-pdf");

exports.handler = async (event) => {
  if (!authed(event)) {
    return { statusCode: 302, headers: { Location: "/waivers/" }, body: "" };
  }

  const id = event.queryStringParameters && event.queryStringParameters.id;
  const apiToken = process.env.NETLIFY_API_TOKEN;
  if (!id || !apiToken) {
    return { statusCode: 400, body: "Missing submission id or NETLIFY_API_TOKEN." };
  }

  try {
    const res = await fetch(`https://api.netlify.com/api/v1/submissions/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${apiToken}` },
    });
    if (!res.ok) {
      return { statusCode: 404, body: "Submission not found." };
    }
    const sub = await res.json();
    const data = sub.data || {};
    const pdfBase64 = await buildSignedWaiverPdf(data);
    const safe = (data.participant_name || "waiver").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="signed-waiver-${safe}.pdf"`,
        "Cache-Control": "private, no-store",
      },
      body: pdfBase64,
      isBase64Encoded: true,
    };
  } catch (e) {
    console.log("waiver-pdf error:", e && e.message);
    return { statusCode: 500, body: "Could not generate the PDF." };
  }
};

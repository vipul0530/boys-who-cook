// Generates a signed-waiver PDF (field summary + full waiver terms + both
// signature images) and returns it as a base64 string for email attachment.
// Pure JS via pdf-lib so it runs in a Netlify serverless function.

const { PDFDocument, StandardFonts, rgb, LineCapStyle } = require("pdf-lib");

// Keep this text in sync with src/components/WaiverForm.tsx (WAIVER_PARAGRAPHS).
const WAIVER_PARAGRAPHS = [
  "Welcome, and thank you for joining us! We are so glad your child is cooking with Boys Who Cook. Our workshops are all about fun, hands on learning in a safe and friendly space. Like most youth programs, we ask every family to look over and sign this short form before the workshop. It helps us learn about your child's needs, keep everyone safe, and make sure we are all on the same page. If anything is unclear, just reach out, we are always happy to talk.",
  "In consideration of being permitted to participate in the cooking workshop, food preparation activities, and any related or incidental activities (collectively, the \"Activity\") organized, hosted, or conducted by Boys Who Cook, the undersigned participant (the \"Participant\") and the undersigned parent or legal guardian (the \"Parent\") agree to the following:",
  "1. Joining Is Voluntary",
  "Taking part in the Activity is completely voluntary. Your child is never required to participate and may step back or leave the Activity at any time.",
  "2. About the Activity and Its Risks",
  "Cooking is hands on, and like any kitchen activity it comes with some risks. We supervise closely and do our best to keep everyone safe, and we also want you to be aware that these risks include, but are not limited to: (a) cuts or scrapes from knives, graters, peelers, or other tools; (b) burns or scalds from hot food, liquids, appliances, or surfaces, whether or not heating equipment is intended to be used; (c) slips, trips, and falls from the premises, wet floors, or crowded conditions; (d) allergic reactions, including severe or life threatening reactions (anaphylaxis), from food allergens such as peanuts, tree nuts, dairy, eggs, soy, wheat or gluten, sesame, fish, and shellfish, including from cross contact in a shared kitchen; (e) foodborne illness from food prepared, handled, or served during the Activity; (f) choking or other injury from eating food; and (g) illness from communicable diseases in a group setting. Other risks, both known and unknown, may also exist.",
  "3. Assumption of Risk",
  "The Parent and Participant understand these risks and voluntarily accept them, whether described above or not and whether known or unknown, and accept responsibility for any resulting injury, illness, loss, or damage to the Participant.",
  "4. Release and Waiver of Liability",
  "To the fullest extent permitted by law, the Parent and Participant, on behalf of themselves and their heirs and successors, release, waive, and give up the right to make any legal claim against Boys Who Cook; its founder Shaan Bhavsar (and his legal guardians); its officers, members, volunteers, instructors, mentors, and agents; the parents and guardians helping with the Activity; and the facility named above, together with its owners, operators, employees, and agents (collectively, the \"Releasees\"), from any and all claims, causes of action, liabilities, damages, costs, and expenses, including attorney fees, arising out of or related to the Participant's participation in the Activity, including claims arising from the ordinary negligence of any of the Releasees.",
  "5. Hold Harmless",
  "If a claim related to the Participant's participation in the Activity is brought by or on behalf of the Participant or a third party, the Parent agrees, to the extent permitted by law, to hold the Releasees harmless from the resulting costs.",
  "6. Food Allergies",
  "Our workshops take place in a shared kitchen where many foods are handled, so we cannot promise that any food is completely free from a given allergen or from cross contact. So we can do our best to keep your child safe, please list any known food allergies, sensitivities, or dietary needs in the field provided.",
  "7. Emergency Medical Care",
  "If your child is injured or has a medical emergency, you authorize Boys Who Cook and the facility to arrange reasonable first aid and emergency medical care and to contact emergency services. You agree to be responsible for the costs of any medical treatment or transport.",
  "8. Photos and Media",
  "We love sharing the fun! With your permission, Boys Who Cook may photograph or record your child during the Activity and use those images for educational, promotional, and fundraising purposes, without compensation. This is completely optional and you may opt out using the checkbox provided.",
  "9. Authority to Sign",
  "The person signing as Parent confirms that he or she is the parent or legal guardian of the Participant and has the authority to sign this form on the Participant's behalf.",
  "10. Governing Law",
  "This form is governed by the laws of the State of California and reflects the entire understanding between the parties on this subject, replacing any earlier oral or written statements.",
  "11. Acknowledgment",
  "The Parent and Participant have read this form and understand its terms.",
];

const HEADINGS = new Set([
  "1. Joining Is Voluntary",
  "2. About the Activity and Its Risks",
  "3. Assumption of Risk",
  "4. Release and Waiver of Liability",
  "5. Hold Harmless",
  "6. Food Allergies",
  "7. Emergency Medical Care",
  "8. Photos and Media",
  "9. Authority to Sign",
  "10. Governing Law",
  "11. Acknowledgment",
]);

function formatDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
  return m ? `${m[2]}/${m[3]}/${m[1]}` : String(iso || "").trim();
}

// Sanitize text for the standard PDF font (WinAnsi) which cannot encode some
// unicode (curly quotes, dashes). Map the common ones; drop anything else.
function sanitize(s) {
  return String(s == null ? "" : s)
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/[…]/g, "...")
    .replace(/[  ]/g, " ")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

async function buildSignedWaiverPdf(data) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const navy = rgb(0.106, 0.227, 0.361);
  const gray = rgb(0.42, 0.45, 0.5);
  const black = rgb(0.13, 0.15, 0.18);
  const lineColor = rgb(0.8, 0.82, 0.85);

  const W = 612;
  const H = 792;
  const M = 50;
  const maxW = W - M * 2;

  let page = pdf.addPage([W, H]);
  let y = H - M;

  function ensure(space) {
    if (y - space < M) {
      page = pdf.addPage([W, H]);
      y = H - M;
    }
  }

  function wrap(text, f, size) {
    const words = sanitize(text).split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (f.widthOfTextAtSize(test, size) > maxW && line) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function paragraph(text, opts) {
    const o = opts || {};
    const f = o.f || font;
    const size = o.size || 10;
    const color = o.color || black;
    const gapAfter = o.gap == null ? 5 : o.gap;
    const lineGap = 3;
    for (const ln of wrap(text, f, size)) {
      ensure(size + lineGap);
      page.drawText(ln, { x: M, y: y - size, size, font: f, color });
      y -= size + lineGap;
    }
    y -= gapAfter;
  }

  // Render a signature by redrawing signature_pad's point data as vector
  // strokes. This avoids embedding a raster image (reliable + crisp at any
  // scale). `pointData` is the JSON string from SignaturePad.toData().
  function signature(label, pointData, printedName, signedDate) {
    ensure(130);
    page.drawText(sanitize(label), { x: M, y: y - 11, size: 10, font: bold, color: gray });
    y -= 18;

    let groups = [];
    try {
      const parsed = JSON.parse(pointData || "[]");
      if (Array.isArray(parsed)) groups = parsed;
    } catch (e) {
      groups = [];
    }

    const pts = [];
    for (const g of groups) for (const p of (g && g.points) || []) pts.push(p);

    if (pts.length) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of pts) {
        if (p.x < minX) minX = p.x;
        if (p.x > maxX) maxX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.y > maxY) maxY = p.y;
      }
      const w = Math.max(1, maxX - minX);
      const h = Math.max(1, maxY - minY);
      const scale = Math.min(240 / w, 90 / h);
      const drawW = w * scale;
      const drawH = h * scale;
      const pad = 8;
      const boxH = drawH + pad * 2;
      ensure(boxH + 22);

      page.drawRectangle({
        x: M,
        y: y - boxH,
        width: drawW + pad * 2,
        height: boxH,
        borderColor: lineColor,
        borderWidth: 0.5,
      });

      const originX = M + pad;
      const topY = y - pad;
      const tx = (px) => originX + (px - minX) * scale;
      const ty = (py) => topY - (py - minY) * scale; // flip: canvas y is top-down

      for (const g of groups) {
        const gp = (g && g.points) || [];
        for (let i = 1; i < gp.length; i++) {
          page.drawLine({
            start: { x: tx(gp[i - 1].x), y: ty(gp[i - 1].y) },
            end: { x: tx(gp[i].x), y: ty(gp[i].y) },
            thickness: 1.4,
            color: navy,
            lineCap: LineCapStyle.Round,
          });
        }
        if (gp.length === 1) {
          page.drawCircle({ x: tx(gp[0].x), y: ty(gp[0].y), size: 1.2, color: navy });
        }
      }
      y -= boxH + 14;
    } else {
      page.drawText("(no signature on file)", { x: M, y: y - 10, size: 9, font, color: gray });
      y -= 16;
    }

    page.drawText("Printed name: " + sanitize(printedName || "-"), { x: M, y: y - 10, size: 9.5, font, color: black });
    y -= 14;
    page.drawText("Date: " + formatDate(signedDate), { x: M, y: y - 10, size: 9.5, font, color: black });
    y -= 20;
  }

  // ── Title ──
  paragraph("Boys Who Cook", { f: bold, size: 18, color: navy, gap: 2 });
  paragraph("Workshop Participation and Release of Liability Form", { f: bold, size: 12, color: navy, gap: 6 });
  paragraph("Signed electronically on " + formatDate(data.signed_date) + ".", { size: 9, color: gray, gap: 14 });

  // ── Submission details ──
  paragraph("Submission Details", { f: bold, size: 12, color: navy, gap: 6 });
  const rows = [
    ["Participant (Minor)", data.participant_name],
    ["Date of Birth", data.date_of_birth],
    ["Participant Email", data.participant_email],
    ["Participant Phone", data.participant_phone],
    ["Parent / Guardian", data.parent_name],
    ["Parent Email", data.parent_email],
    ["Parent Phone", data.parent_phone],
    ["Workshop", data.workshop_name],
    ["Workshop Date", formatDate(data.workshop_date)],
    ["Facility", data.facility],
    ["Allergies / Dietary", data.allergies],
    ["Emergency Contact", data.emergency_contact_name],
    ["Emergency Phone", data.emergency_contact_phone],
    ["Photo Opt-Out", data.photo_opt_out ? "YES (do not photograph)" : "No"],
    ["Acknowledged Terms", data.acknowledgment ? "Yes" : "No"],
  ];
  for (const [k, v] of rows) {
    paragraph(`${k}: ${String(v || "").trim() || "-"}`, { size: 9.5, gap: 2 });
  }
  y -= 8;

  // ── Waiver terms ──
  ensure(24);
  paragraph("Waiver Terms", { f: bold, size: 12, color: navy, gap: 6 });
  for (const p of WAIVER_PARAGRAPHS) {
    const heading = HEADINGS.has(p);
    paragraph(p, { f: heading ? bold : font, size: heading ? 10.5 : 9.5, color: heading ? navy : black, gap: heading ? 3 : 6 });
  }

  // ── Signatures ──
  ensure(30);
  y -= 4;
  paragraph("Signatures", { f: bold, size: 12, color: navy, gap: 8 });
  signature("Parent or Legal Guardian Signature", data.signature, data.parent_printed_name, data.signed_date);
  signature("Participant Signature", data.participant_signature, data.participant_printed_name, data.signed_date);

  const bytes = await pdf.save();
  return Buffer.from(bytes).toString("base64");
}

module.exports = { buildSignedWaiverPdf };

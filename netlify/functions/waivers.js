// Password-protected admin page: lists every signed waiver submission with a
// link to download each as a PDF. Reads submissions from the Netlify Forms API
// (no separate database needed).
//
// Required environment variables:
//   ADMIN_PASSWORD     - password to view this page
//   NETLIFY_API_TOKEN  - a Netlify personal access token (Forms read access)

const { authed, setCookieHeader, clearCookieHeader } = require("../lib/admin-auth");

const NAVY = "#1B3A5C";

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmtDate(iso) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || "").trim());
  return m ? `${m[2]}/${m[3]}/${m[1]}` : esc(String(iso || "").trim());
}

function html(inner) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Signed Waivers</title>
<style>
  body{margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background:#EEF3FA;color:#1f2937;}
  .wrap{max-width:900px;margin:0 auto;padding:24px 16px;}
  header{background:${NAVY};color:#fff;border-radius:14px;padding:20px 24px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
  header h1{font-size:20px;margin:0;font-weight:700;}
  header a{color:#cdddef;font-size:13px;text-decoration:none;}
  .card{background:#fff;border-radius:14px;padding:8px;overflow-x:auto;}
  table{width:100%;border-collapse:collapse;font-size:14px;}
  th,td{text-align:left;padding:12px 14px;border-bottom:1px solid #E5E7EB;white-space:nowrap;}
  th{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#6B7280;}
  tr:last-child td{border-bottom:none;}
  a.btn{display:inline-block;background:${NAVY};color:#fff;text-decoration:none;padding:7px 14px;border-radius:8px;font-size:13px;font-weight:600;}
  .muted{color:#6B7280;font-size:14px;margin:0 0 16px;}
  form.login{background:#fff;border-radius:14px;padding:28px;max-width:360px;margin:40px auto;text-align:center;}
  form.login h1{color:${NAVY};font-size:20px;margin:0 0 16px;}
  form.login input{width:100%;box-sizing:border-box;padding:11px 14px;border:1px solid #d1d5db;border-radius:10px;font-size:15px;margin-bottom:12px;}
  form.login button{width:100%;background:${NAVY};color:#fff;border:0;padding:12px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;}
  .err{color:#b91c1c;font-size:13px;margin:0 0 12px;}
</style></head><body><div class="wrap">${inner}</div></body></html>`;
}

function loginPage(error) {
  return html(`<form class="login" method="POST" action="/waivers/">
    <h1>Signed Waivers</h1>
    ${error ? `<p class="err">${esc(error)}</p>` : ""}
    <input type="password" name="password" placeholder="Admin password" autofocus required>
    <button type="submit">View waivers</button>
  </form>`);
}

async function fetchWaiverSubmissions(token) {
  const formsRes = await fetch("https://api.netlify.com/api/v1/forms", { headers: { Authorization: `Bearer ${token}` } });
  if (!formsRes.ok) throw new Error("Forms API returned " + formsRes.status);
  const forms = await formsRes.json();
  const form = (Array.isArray(forms) ? forms : []).find((f) => f.name === "waiver");
  if (!form) return [];
  const subsRes = await fetch(`https://api.netlify.com/api/v1/forms/${form.id}/submissions?per_page=200`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!subsRes.ok) throw new Error("Submissions API returned " + subsRes.status);
  const subs = await subsRes.json();
  return Array.isArray(subs) ? subs : [];
}

exports.handler = async (event) => {
  const pw = process.env.ADMIN_PASSWORD;
  const apiToken = process.env.NETLIFY_API_TOKEN;
  const htmlHeaders = { "Content-Type": "text/html; charset=utf-8" };

  // Logout
  if (event.queryStringParameters && event.queryStringParameters.logout) {
    return { statusCode: 302, headers: { "Set-Cookie": clearCookieHeader(), Location: "/waivers/" }, body: "" };
  }

  // Login
  if (event.httpMethod === "POST") {
    const params = new URLSearchParams(event.body || "");
    if (pw && params.get("password") === pw) {
      return { statusCode: 302, headers: { "Set-Cookie": setCookieHeader(), Location: "/waivers/" }, body: "" };
    }
    return { statusCode: 200, headers: htmlHeaders, body: loginPage("Incorrect password. Please try again.") };
  }

  if (!pw) {
    return { statusCode: 200, headers: htmlHeaders, body: html("<p class='muted'>Set an ADMIN_PASSWORD environment variable in Netlify to enable this page.</p>") };
  }
  if (!authed(event)) {
    return { statusCode: 200, headers: htmlHeaders, body: loginPage() };
  }
  if (!apiToken) {
    return { statusCode: 200, headers: htmlHeaders, body: html("<p class='muted'>Set a NETLIFY_API_TOKEN environment variable in Netlify to load submissions.</p>") };
  }

  let subs;
  try {
    subs = await fetchWaiverSubmissions(apiToken);
  } catch (e) {
    return { statusCode: 200, headers: htmlHeaders, body: html(`<p class="muted">Could not load submissions: ${esc(e.message)}</p>`) };
  }

  subs.sort((a, b) => String(b.created_at || "").localeCompare(String(a.created_at || "")));

  const rows = subs
    .map((s) => {
      const d = s.data || {};
      return `<tr>
        <td>${esc((s.created_at || "").slice(0, 10))}</td>
        <td>${esc(d.participant_name || "-")}</td>
        <td>${esc(d.parent_name || "-")}</td>
        <td>${fmtDate(d.workshop_date)}</td>
        <td><a class="btn" href="/waivers/pdf/?id=${encodeURIComponent(s.id)}">Download PDF</a></td>
      </tr>`;
    })
    .join("");

  const body = `
    <header>
      <h1>Signed Waivers</h1>
      <a href="/waivers/?logout=1">Log out</a>
    </header>
    <p class="muted">${subs.length} signed waiver${subs.length === 1 ? "" : "s"}.</p>
    <div class="card">
      <table>
        <thead><tr><th>Signed</th><th>Participant</th><th>Parent</th><th>Workshop</th><th></th></tr></thead>
        <tbody>${rows || `<tr><td colspan="5" class="muted" style="padding:24px">No signed waivers yet.</td></tr>`}</tbody>
      </table>
    </div>`;

  return { statusCode: 200, headers: htmlHeaders, body: html(body) };
};

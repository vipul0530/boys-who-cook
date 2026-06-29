// Shared password-cookie auth for the admin waiver pages.
const crypto = require("crypto");

const COOKIE = "bwc_admin";

// The cookie stores a hash of the password (not the password itself).
function token() {
  const pw = process.env.ADMIN_PASSWORD || "";
  return crypto.createHash("sha256").update("bwc:" + pw).digest("hex");
}

function getCookie(event, name) {
  const header = (event.headers && (event.headers.cookie || event.headers.Cookie)) || "";
  const part = header.split(/;\s*/).find((c) => c.indexOf(name + "=") === 0);
  return part ? decodeURIComponent(part.slice(name.length + 1)) : null;
}

function authed(event) {
  if (!process.env.ADMIN_PASSWORD) return false;
  return getCookie(event, COOKIE) === token();
}

function setCookieHeader() {
  // 12-hour session.
  return `${COOKIE}=${token()}; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=43200`;
}

function clearCookieHeader() {
  return `${COOKIE}=; HttpOnly; Secure; Path=/; SameSite=Lax; Max-Age=0`;
}

module.exports = { COOKIE, token, getCookie, authed, setCookieHeader, clearCookieHeader };

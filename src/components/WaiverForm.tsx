"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

// ─── Waiver text (scrollable read-only box, field 11) ───────────────────────
const WAIVER_PARAGRAPHS: string[] = [
  "Boys Who Cook - Workshop Participation and Release of Liability Form",
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
  "Thank you for helping us keep every young cook safe. We can't wait to get cooking!",
];

const HEADING_LINES = new Set([
  "Boys Who Cook - Workshop Participation and Release of Liability Form",
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

const inputClass =
  "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-gray-800 placeholder-gray-400 bg-white";
const labelClass = "block text-sm font-semibold text-gray-700 mb-1.5";

// Required text/date/tel/email fields (in order, allergies handled separately)
const TEXT_FIELDS = [
  { name: "participant_name", label: "Participant (Minor) Full Name", type: "text" },
  { name: "date_of_birth", label: "Date of Birth", type: "date" },
  { name: "parent_name", label: "Parent or Legal Guardian Name", type: "text" },
  { name: "parent_email", label: "Parent Email", type: "email" },
  { name: "workshop_name", label: "Workshop Name / Event", type: "text", default: "Boys Who Cook Cooking Workshop" },
  { name: "workshop_date", label: "Workshop Date", type: "date" },
  { name: "facility", label: "Facility", type: "text", default: "Tustin Youth and Family Center" },
] as const;

interface SignaturePadInstance {
  isEmpty(): boolean;
  clear(): void;
  toDataURL(type?: string): string;
}

declare global {
  interface Window {
    SignaturePad?: new (
      canvas: HTMLCanvasElement,
      opts?: Record<string, unknown>
    ) => SignaturePadInstance;
  }
}

export default function WaiverForm() {
  const [unlocked, setUnlocked] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successName, setSuccessName] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePadInstance | null>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  // ── Load signature_pad from CDN and initialize the pad ──────────────────
  useEffect(() => {
    let cancelled = false;

    function initPad() {
      const canvas = canvasRef.current;
      if (!canvas || !window.SignaturePad) return;
      const pad = new window.SignaturePad(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(27, 58, 92)", // brand navy
      });
      padRef.current = pad;
      resizeCanvas();
    }

    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const ctx = canvas.getContext("2d");
      ctx?.scale(ratio, ratio);
      padRef.current?.clear();
    }

    if (window.SignaturePad) {
      initPad();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-signature-pad]");
      if (existing) {
        existing.addEventListener("load", () => !cancelled && initPad());
      } else {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/signature_pad@4.1.7/dist/signature_pad.umd.min.js";
        script.async = true;
        script.dataset.signaturePad = "true";
        script.onload = () => !cancelled && initPad();
        document.body.appendChild(script);
      }
    }

    window.addEventListener("resize", resizeCanvas);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // ── Scroll-to-unlock on the waiver box ──────────────────────────────────
  function handleWaiverScroll(e: React.UIEvent<HTMLDivElement>) {
    if (unlocked) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) {
      setUnlocked(true);
    }
  }

  function clearSignature() {
    padRef.current?.clear();
  }

  // ── Submit ──────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const newErrors: Record<string, string> = {};

    const requiredNames = [
      ...TEXT_FIELDS.map((f) => f.name),
      "allergies",
      "emergency_contact_name",
      "emergency_contact_phone",
      "parent_printed_name",
      "participant_printed_name",
    ];

    const fd = new FormData(form);
    for (const name of requiredNames) {
      const val = (fd.get(name) as string | null)?.trim() ?? "";
      if (!val) newErrors[name] = "This field is required.";
    }

    const email = (fd.get("parent_email") as string | null)?.trim() ?? "";
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.parent_email = "Please enter a valid email address.";
    }

    if (!fd.get("acknowledgment")) {
      newErrors.acknowledgment = "Please confirm you have read and understand this form.";
    }

    if (!padRef.current || padRef.current.isEmpty()) {
      newErrors.signature = "Please provide a signature.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      const firstKey = Object.keys(newErrors)[0];
      document.querySelector(`[data-field="${firstKey}"]`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setErrors({});
    setStatus("submitting");

    // Save signature as base64 into the hidden input so Netlify captures it.
    if (signatureInputRef.current && padRef.current) {
      signatureInputRef.current.value = padRef.current.toDataURL("image/png");
    }

    const data = new FormData(form);
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as unknown as Record<string, string>).toString(),
      });
      if (res.ok) {
        setSuccessName((data.get("participant_name") as string)?.trim() || "your child");
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="font-serif text-2xl font-semibold text-green-800 mb-2">Thank you!</h3>
        <p className="text-green-700 leading-relaxed">
          Your signed waiver has been received. We look forward to cooking with {successName}!
        </p>
      </div>
    );
  }

  return (
    <form
      name="waiver"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="space-y-6 text-left"
    >
      {/* Netlify hidden fields */}
      <input type="hidden" name="form-name" value="waiver" />
      <p className="hidden">
        <label>
          Do not fill this out: <input name="bot-field" />
        </label>
      </p>
      <input ref={signatureInputRef} type="hidden" name="signature" />

      {/* Text / date / email fields */}
      {TEXT_FIELDS.map((f) => (
        <div key={f.name} data-field={f.name}>
          <label htmlFor={f.name} className={labelClass}>
            {f.label} <span className="text-red-500">*</span>
          </label>
          <input
            id={f.name}
            name={f.name}
            type={f.type}
            defaultValue={"default" in f ? f.default : undefined}
            className={inputClass}
          />
          {errors[f.name] && <p className="text-red-500 text-xs mt-1">{errors[f.name]}</p>}
        </div>
      ))}

      {/* Allergies */}
      <div data-field="allergies">
        <label htmlFor="allergies" className={labelClass}>
          Known Food Allergies, Sensitivities, or Dietary Restrictions{" "}
          <span className="text-red-500">*</span>
        </label>
        <textarea
          id="allergies"
          name="allergies"
          rows={3}
          placeholder="Write None if none"
          className={`${inputClass} resize-none`}
        />
        {errors.allergies && <p className="text-red-500 text-xs mt-1">{errors.allergies}</p>}
      </div>

      {/* Emergency contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div data-field="emergency_contact_name">
          <label htmlFor="emergency_contact_name" className={labelClass}>
            Emergency Contact Name <span className="text-red-500">*</span>
          </label>
          <input id="emergency_contact_name" name="emergency_contact_name" type="text" className={inputClass} />
          {errors.emergency_contact_name && (
            <p className="text-red-500 text-xs mt-1">{errors.emergency_contact_name}</p>
          )}
        </div>
        <div data-field="emergency_contact_phone">
          <label htmlFor="emergency_contact_phone" className={labelClass}>
            Emergency Contact Phone <span className="text-red-500">*</span>
          </label>
          <input id="emergency_contact_phone" name="emergency_contact_phone" type="tel" className={inputClass} />
          {errors.emergency_contact_phone && (
            <p className="text-red-500 text-xs mt-1">{errors.emergency_contact_phone}</p>
          )}
        </div>
      </div>

      {/* Waiver text — scrollable read-only box */}
      <div>
        <label className={labelClass}>Full Waiver</label>
        <div
          onScroll={handleWaiverScroll}
          className="h-72 overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-600 leading-relaxed"
        >
          {WAIVER_PARAGRAPHS.map((p, i) =>
            HEADING_LINES.has(p) ? (
              <p
                key={i}
                className="font-semibold mt-4 mb-1"
                style={{ color: "var(--color-primary-700)" }}
              >
                {p}
              </p>
            ) : (
              <p key={i} className="mb-3">
                {p}
              </p>
            )
          )}
        </div>
      </div>

      {/* Photo opt-out (not required) */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" name="photo_opt_out" value="yes" className="mt-1 h-4 w-4 accent-[var(--color-primary-700)]" />
        <span className="text-sm text-gray-600">
          Check here if you do NOT want your child photographed or recorded during the workshop.
        </span>
      </label>

      {/* Signature pad */}
      <div data-field="signature">
        <p
          className="text-sm font-medium mb-2 transition-colors duration-500"
          style={{ color: unlocked ? "var(--color-secondary-600)" : "#9CA3AF" }}
        >
          {unlocked
            ? "Please sign below using your finger or mouse."
            : "Please scroll through the full waiver above to unlock signing."}
        </p>
        <label className={labelClass}>
          Parent or Legal Guardian Signature <span className="text-red-500">*</span>
        </label>
        <div
          className={`transition-opacity duration-500 ${
            unlocked ? "opacity-100" : "opacity-50 pointer-events-none"
          }`}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-48 rounded-xl border border-gray-300 bg-white"
            style={{ touchAction: "none" }}
          />
          <button
            type="button"
            onClick={clearSignature}
            disabled={!unlocked}
            className="mt-2 text-sm font-medium underline hover:no-underline disabled:opacity-50"
            style={{ color: "var(--color-primary-700)" }}
          >
            Clear
          </button>
        </div>
        {errors.signature && <p className="text-red-500 text-xs mt-1">{errors.signature}</p>}
      </div>

      {/* Printed names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div data-field="parent_printed_name">
          <label htmlFor="parent_printed_name" className={labelClass}>
            Parent Printed Name <span className="text-red-500">*</span>
          </label>
          <input id="parent_printed_name" name="parent_printed_name" type="text" className={inputClass} />
          {errors.parent_printed_name && (
            <p className="text-red-500 text-xs mt-1">{errors.parent_printed_name}</p>
          )}
        </div>
        <div data-field="participant_printed_name">
          <label htmlFor="participant_printed_name" className={labelClass}>
            Participant Printed Name <span className="text-red-500">*</span>
          </label>
          <input id="participant_printed_name" name="participant_printed_name" type="text" className={inputClass} />
          {errors.participant_printed_name && (
            <p className="text-red-500 text-xs mt-1">{errors.participant_printed_name}</p>
          )}
        </div>
      </div>

      {/* Acknowledgment */}
      <div data-field="acknowledgment">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" name="acknowledgment" value="yes" className="mt-1 h-4 w-4 accent-[var(--color-primary-700)]" />
          <span className="text-sm text-gray-700">
            I have read this form and understand its terms. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.acknowledgment && <p className="text-red-500 text-xs mt-1">{errors.acknowledgment}</p>}
      </div>

      {status === "error" && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          Something went wrong submitting the waiver. Please try again, or contact us if it keeps happening.
        </div>
      )}

      <button
        type="submit"
        disabled={!unlocked || status === "submitting"}
        className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-500"
      >
        {status === "submitting" ? "Submitting..." : "Submit Signed Waiver"}
      </button>
    </form>
  );
}

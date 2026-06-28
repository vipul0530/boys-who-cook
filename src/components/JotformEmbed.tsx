"use client";

import { useEffect, useRef } from "react";

/**
 * Embeds the Boys Who Cook waiver Jotform.
 * Jotform's "jsform" script renders the form inline relative to its own
 * <script> tag, so we inject it into a container ref. This keeps the form
 * inside our layout and lets Jotform's own resize logic handle mobile widths.
 */
export default function JotformEmbed({ formId }: { formId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://form.jotform.com/jsform/${formId}`;
    script.async = true;
    container.appendChild(script);

    return () => {
      // Clean up on unmount / navigation so the form isn't duplicated.
      container.innerHTML = "";
    };
  }, [formId]);

  return <div ref={containerRef} className="w-full" />;
}

import { useState } from "react";

const SUFFIXES = /^(ltd|limited|inc|llc|co|corp|group|nigeria|technologies|technology|tech|plc|labs?)\.?$/i;

/**
 * Two-letter monogram for a company name.
 * Drops parentheticals ("BuyPower (YC W17)") and corporate suffixes so the
 * initials come from the words that actually identify the company.
 */
export function initialsFor(company: string): string {
  const words = company
    .replace(/\(.*?\)/g, " ")
    .split(/[\s/&-]+/)
    .map((w) => w.replace(/[^\p{L}\p{N}]/gu, ""))
    .filter((w) => w.length > 0 && !SUFFIXES.test(w));

  const source = words.length ? words : [company.trim() || "?"];
  return source
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

/** Stable per-company hue offset so two fallbacks never look identical. */
function hueFor(company: string): number {
  let hash = 0;
  for (let i = 0; i < company.length; i++) hash = (hash * 31 + company.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 40) - 20;
}

interface CompanyLogoProps {
  company: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
}

export function CompanyLogo({ company, logoUrl, size = 96, className = "" }: CompanyLogoProps) {
  const [failed, setFailed] = useState(false);
  const box = { width: size, height: size };

  if (logoUrl && !failed) {
    return (
      // White plate is required: this sits on the green gradient and most
      // company logos are dark.
      <img
        src={logoUrl}
        alt={`${company} logo`}
        loading="lazy"
        onError={() => setFailed(true)}
        style={box}
        className={`shrink-0 rounded-2xl bg-white object-contain p-3 shadow-sm ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={`${company} logo`}
      style={{ ...box, filter: `hue-rotate(${hueFor(company)}deg)` }}
      className={`shrink-0 rounded-2xl grid place-items-center font-montserrat font-bold text-white select-none gradient ${className}`}
    >
      <span style={{ fontSize: size * 0.34, lineHeight: 1 }}>{initialsFor(company)}</span>
    </div>
  );
}

export default CompanyLogo;

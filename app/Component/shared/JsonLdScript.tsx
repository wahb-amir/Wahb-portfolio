import Script from "next/script";

type JsonLdScriptProps = {
  id: string;
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/** Inline JSON-LD via next/script — avoids render-blocking external fetches. */
export default function JsonLdScript({ id, data }: JsonLdScriptProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

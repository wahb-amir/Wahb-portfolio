"use client";

import dynamic from "next/dynamic";

function ContactSkeleton() {
  return (
    <div
      aria-hidden="true"
      style={{ minHeight: 480, width: "100%", contain: "layout size" }}
    />
  );
}

const ContactForm = dynamic(() => import("./Contact"), {
  ssr: false,
  loading: () => <ContactSkeleton />,
});

export default ContactForm;

import { JsonLd } from "@/components/seo/JsonLd";

export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      }}
    />
  );
}

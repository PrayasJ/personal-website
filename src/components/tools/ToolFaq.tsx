import type { ToolFaq as Faq } from "@/lib/tools";

export function ToolFaq({ faqs }: { faqs: Faq[] }) {
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="tool-docs">
      <h2 className="tool-docs-title">FAQ</h2>
      <div className="tool-faq">
        {faqs.map((faq) => (
          <details key={faq.question} className="tool-faq-item">
            <summary>
              <span>{faq.question}</span>
              <span className="tool-faq-mark" aria-hidden />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, type LegalSection } from "@/components/site/LegalPage";
import termsHero from "@/assets/legal/terms-hero.webp";

const operatorDetails = [
  ["Registered legal business name", "[REGISTERED LEGAL BUSINESS NAME]"],
  ["Trading name", "[TRADING NAME]"],
  ["Company registration number", "[COMPANY REGISTRATION NUMBER]"],
  ["Registered address", "[REGISTERED ADDRESS]"],
  ["Contact email", "[PRIVACY CONTACT EMAIL]"],
  ["Contact phone", "[PRIVACY CONTACT PHONE]"],
  ["Effective date", "[EFFECTIVE DATE]"],
] as const;

const sections: LegalSection[] = [
  {
    id: "operator",
    title: "Website operator",
    content: (
      <dl className="grid gap-3 rounded-2xl border border-line bg-sage/45 p-5 sm:grid-cols-2">
        {operatorDetails.map(([label, value]) => (
          <div key={label}>
            <dt className="type-label text-ink/68">{label}</dt>
            <dd className="mt-1 break-words font-semibold text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    ),
  },
  {
    id: "acceptance",
    title: "Acceptance and scope",
    content: (
      <>
        <p>
          These Terms and Conditions govern your use of the Healthy Pet Veterinary Clinic website.
          By using the site, you agree to these terms. If you do not agree, please stop using it.
        </p>
        <p>
          These terms apply to the public website only. Separate terms, professional duties, and
          consent arrangements may apply when the clinic provides veterinary services or when you
          use an external platform.
        </p>
      </>
    ),
  },
  {
    id: "website-purpose",
    title: "Information-only website",
    content: (
      <>
        <p>
          The website provides general information about the clinic, veterinary services, products,
          gallery content, documented cases, opening hours, and contact methods. It does not accept
          appointment bookings, payments, purchases, or public form submissions.
        </p>
        <p>
          A telephone call, email, WhatsApp message, or visit is not confirmed merely because a
          contact link appears on the site. Appointments, availability, prices, and service details
          must be confirmed directly with the clinic.
        </p>
      </>
    ),
  },
  {
    id: "medical-information",
    title: "Veterinary information and emergencies",
    content: (
      <>
        <p>
          Website content is general information and is not a diagnosis, prescription, treatment
          plan, or substitute for an examination by a qualified veterinary professional. Using the
          site does not by itself create a veterinarian-client-patient relationship.
        </p>
        <p>
          This website is not an emergency service and must not be relied on for urgent assistance.
          If an animal may need urgent care, call the clinic immediately. If the clinic is
          unavailable, contact an appropriate emergency veterinary provider without delay.
        </p>
      </>
    ),
  },
  {
    id: "services-products",
    title: "Services and products",
    content: (
      <>
        <p>
          Service and product descriptions are provided for general guidance. Availability,
          suitability, brands, stock, prices, clinical recommendations, and opening hours may
          change. Contact the clinic before relying on this information or travelling to the
          premises.
        </p>
        <p>
          Any purchase made through a third-party service such as Wolt or Foody is a transaction on
          that platform and is governed by the terms, availability, payment, delivery, cancellation,
          and refund rules shown there. This website does not process those transactions.
        </p>
      </>
    ),
  },
  {
    id: "cases-gallery",
    title: "Cases, gallery, and sensitive media",
    content: (
      <>
        <p>
          Gallery and veterinary case content is presented to show clinic activity and provide
          professional or educational context. A documented case does not predict the outcome for
          another animal and must not be used for self-diagnosis or treatment decisions.
        </p>
        <p>
          Some case images may be surgical, wound-related, or otherwise sensitive. Warnings and blur
          controls are provided to reduce accidental exposure. Visitors choose whether to reveal
          each protected image.
        </p>
        <p>
          Publication permission for all existing images must be confirmed by the clinic before
          these terms are treated as final. If you believe media infringes your rights, contact us
          using the details above for prompt review.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    title: "Third-party services and links",
    content: (
      <p>
        The site may link to Google Maps, WhatsApp, social media, Wolt, Foody, email, and other
        third-party services. Links are provided for convenience and do not mean we control or
        endorse all third-party content. Those services have their own terms, privacy practices,
        security, availability, and charges. Use them at your own discretion.
      </p>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You must not use the website to:</p>
        <ul>
          <li>break applicable law or infringe another person's rights;</li>
          <li>
            attempt to gain unauthorised access to the website, dashboard, accounts, or systems;
          </li>
          <li>
            introduce malicious code, disrupt service, probe security, or bypass access controls;
          </li>
          <li>
            scrape, copy, or reuse content in a way that infringes rights or places an unreasonable
            load on the service;
          </li>
          <li>
            misrepresent your identity or use contact channels for abusive, fraudulent, or unlawful
            purposes.
          </li>
        </ul>
        <p>
          We may restrict access where reasonably necessary to protect the website or other users.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual property",
    content: (
      <p>
        Unless otherwise stated, the website's branding, text, layout, graphics, photographs,
        videos, and other content are owned by or licensed to the operator and are protected by
        applicable intellectual-property laws. You may view the site and make limited personal,
        non-commercial use of its content. No other copying, republication, modification,
        distribution, or commercial use is permitted without prior written permission or another
        lawful basis.
      </p>
    ),
  },
  {
    id: "availability",
    title: "Accuracy and availability",
    content: (
      <p>
        We aim to keep the website accurate and available, but content may become incomplete or
        outdated and access may be interrupted for maintenance, security, provider failures, or
        events outside our control. We may correct, update, suspend, or remove website content
        without notice. Always confirm time-sensitive clinic information directly.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    content: (
      <>
        <p>
          To the fullest extent permitted by applicable law, the operator is not responsible for
          loss caused by reliance on general website content, unavailable third-party services,
          external links, or use of the site contrary to these terms. Nothing in these terms limits
          liability where limitation is prohibited by law, including liability for fraud or any
          other liability that cannot legally be excluded.
        </p>
        <p>Your mandatory rights under Cyprus and European Union consumer law remain unaffected.</p>
      </>
    ),
  },
  {
    id: "privacy",
    title: "Privacy",
    content: (
      <p>
        Our <a href="/privacy">Privacy Policy</a> explains how personal data and browser storage are
        handled. It forms part of the information governing use of this website.
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law and disputes",
    content: (
      <p>
        These terms are governed by the laws of the Republic of Cyprus. Subject to any mandatory
        consumer right to bring a claim elsewhere, the courts of Cyprus have jurisdiction over
        disputes concerning the website. Before starting formal proceedings, you are encouraged to
        contact us so the matter can be reviewed.
      </p>
    ),
  },
  {
    id: "general",
    title: "General provisions",
    content: (
      <>
        <p>
          If any provision is found invalid or unenforceable, the remaining provisions continue in
          effect. A delay in enforcing a right is not a waiver of that right. These terms do not
          create rights for a third party unless applicable law requires otherwise.
        </p>
        <p>
          We may update these terms when the website, services, or legal requirements change. The
          effective date above will be updated when revised terms are published. Questions may be
          sent to <strong>[PRIVACY CONTACT EMAIL]</strong> or{" "}
          <strong>[PRIVACY CONTACT PHONE]</strong>.
        </p>
      </>
    ),
  },
];

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms and Conditions | Healthy Pet Veterinary Clinic" },
      {
        name: "description",
        content: "Terms governing use of the Healthy Pet Veterinary Clinic website.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      intro="These terms explain how this informational website may be used and the limits that apply to its veterinary, product, gallery, and case content."
      heroImage={termsHero}
      sections={sections}
    />
  );
}

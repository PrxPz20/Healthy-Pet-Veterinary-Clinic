import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  clinic: {
    name: "Limassol Veterinary Clinic",
    legalName: "Limassol Veterinary Clinic",
    tagline: "Modern veterinary care for everyday pet health.",
    siteUrl: "https://example-vet-clinic.com",
    logoUrl: "https://example-vet-clinic.com/logo.png",
    phone: "+35725123456",
    phoneDisplay: "+357 25 123 456",
    whatsapp: "https://wa.me/35725123456",
    whatsappDisplay: "WhatsApp +357 25 123 456",
    email: "hello@example-vet-clinic.com",
    address: {
      street: "Clinic address placeholder",
      city: "Limassol",
      region: "Limassol",
      postalCode: "0000",
      country: "CY",
    },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Limassol%2C%20Cyprus%20veterinary%20clinic",
    mapEmbedUrl: "https://www.google.com/maps?q=Limassol%2C%20Cyprus%20veterinary%20clinic&output=embed",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/" },
      { label: "Facebook", href: "https://www.facebook.com/" },
    ],
  },
  media: {
    heroVideo: "https://videos.pexels.com/video-files/6235183/6235183-uhd_2560_1440_25fps.mp4",
    heroPoster: {
      src: "https://images.unsplash.com/photo-1770836037289-e00e5f351d11?auto=format&fit=crop&fm=jpg&q=80&w=2200",
      alt: "Veterinarian examining a dog in a bright clinic room",
    },
    about: {
      src: "https://images.pexels.com/photos/6816838/pexels-photo-6816838.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Veterinary nurse gently brushing a white cat in a clinic",
    },
    care: {
      src: "https://images.pexels.com/photos/6234623/pexels-photo-6234623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Veterinarian checking a dog during a routine examination",
    },
  },
  openingHours: [
    { days: "Monday to Friday", label: "Mon-Fri", opens: "09:00", closes: "19:00" },
    { days: "Saturday", label: "Saturday", opens: "09:00", closes: "14:00" },
  ],
  navigation: [
    { label: "Care", href: "/#care" },
    { label: "Services", href: "/services" },
    { label: "Products", href: "/#products" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
  hero: {
    eyebrow: "Veterinary care in Limassol",
    title: "Calm, modern care for the animals you love.",
    body: "Preventive medicine, diagnostics, dental care, nutrition support, and everyday treatment from a trusted local veterinary clinic.",
    primaryCta: { label: "Call Now", href: "tel:+35725123456" },
    secondaryCta: { label: "WhatsApp", href: "https://wa.me/35725123456", external: true },
  },
  trustPoints: [
    {
      icon: "clock",
      title: "Same-day guidance",
      body: "Clear next steps by phone or WhatsApp before you visit.",
    },
    {
      icon: "map-pin",
      title: "Limassol clinic",
      body: "Local care for dogs, cats, and small companion animals.",
    },
    {
      icon: "shield-check",
      title: "Preventive focus",
      body: "Vaccinations, parasite control, nutrition, and wellness plans.",
    },
    {
      icon: "heart-pulse",
      title: "Careful follow-up",
      body: "Treatment plans explained simply, with practical aftercare.",
    },
  ],
  services: [
    {
      slug: "vaccinations",
      icon: "syringe",
      title: "Vaccinations",
      seoTitle: "Vaccinations in Limassol",
      short: "Core vaccines, yearly boosters, puppy and kitten plans, and travel preparation.",
      detail:
        "Vaccination plans are tailored to your pet's age, lifestyle, travel needs, and health history. The clinic explains what is needed, when boosters are due, and how to keep records clear.",
      highlights: ["Puppy and kitten schedules", "Annual boosters", "Travel and record guidance"],
    },
    {
      slug: "dental-care",
      icon: "stethoscope",
      title: "Dental Care",
      seoTitle: "Dental Care",
      short: "Oral checks, gum health guidance, dental cleaning advice, and prevention.",
      detail:
        "Dental care focuses on early detection of pain, gum inflammation, tartar buildup, and eating changes. The goal is to prevent small oral issues from becoming chronic discomfort.",
      highlights: ["Oral health checks", "Bad breath assessment", "Home care advice"],
    },
    {
      slug: "surgery",
      icon: "scissors",
      title: "Surgery",
      seoTitle: "Surgery",
      short: "Planned procedures with careful preparation, monitoring, and recovery guidance.",
      detail:
        "For planned procedures, the clinic walks owners through preparation, anaesthesia considerations, post-operative care, and warning signs to watch during recovery.",
      highlights: ["Pre-surgery guidance", "Post-op care", "Recovery follow-up"],
    },
    {
      slug: "dermatology",
      icon: "activity",
      title: "Dermatology",
      seoTitle: "Dermatology",
      short: "Support for itching, skin irritation, ear problems, allergies, and coat changes.",
      detail:
        "Skin and ear problems can have many causes, from parasites and allergies to infections and diet. The clinic focuses on identifying the cause and building a realistic care plan.",
      highlights: ["Itching and allergies", "Ear checks", "Coat and skin changes"],
    },
    {
      slug: "diagnostics",
      icon: "microscope",
      title: "Diagnostics",
      seoTitle: "Diagnostics",
      short: "Clinical examination, lab guidance, imaging referrals, and treatment planning.",
      detail:
        "Diagnostics start with careful examination and owner history. When extra tests are needed, the clinic explains why they matter and how results guide the treatment path.",
      highlights: ["Clinical exams", "Lab test guidance", "Clear treatment plans"],
    },
    {
      slug: "nutrition",
      icon: "package",
      title: "Nutrition",
      seoTitle: "Nutrition",
      short: "Food guidance for growth, weight, digestion, allergies, and long-term wellness.",
      detail:
        "Nutrition advice helps owners choose food based on pet age, breed, health concerns, weight goals, and tolerance. Product recommendations are informational, not an online shop.",
      highlights: ["Weight support", "Sensitive diets", "Food transition plans"],
    },
  ],
  approach: [
    {
      step: "01",
      title: "Listen first",
      body: "Every visit starts with owner context: behavior changes, appetite, symptoms, routines, and what feels different at home.",
    },
    {
      step: "02",
      title: "Examine carefully",
      body: "The clinical check stays calm and methodical, with space for nervous pets and clear explanations for owners.",
    },
    {
      step: "03",
      title: "Treat clearly",
      body: "Treatment options are explained in plain English, including what to do now, what to monitor, and when to follow up.",
    },
    {
      step: "04",
      title: "Support prevention",
      body: "Vaccines, parasite control, dental health, nutrition, and yearly checks are planned around the pet's real life.",
    },
  ],
  products: [
    {
      name: "Digestive Support Food",
      category: "Veterinary nutrition",
      description: "A gentle daily option for pets with sensitive digestion, recommended after a clinic nutrition check.",
      image: {
        src: "https://images.pexels.com/photos/18764148/pexels-photo-18764148.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Close-up of dry pet food kibble",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Training Treats",
      category: "Treats",
      description: "Small reward treats for positive training, enrichment, and short daily sessions.",
      image: {
        src: "https://images.pexels.com/photos/7310128/pexels-photo-7310128.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Paper bag with dog treats on a table",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Skin and Coat Support",
      category: "Supplements",
      description: "Supportive daily care for coat condition, seasonal shedding, and skin comfort.",
      image: {
        src: "https://images.unsplash.com/photo-1739397640322-99ebe5c6cd20?auto=format&fit=crop&fm=jpg&q=80&w=1200",
        alt: "Dog holding a pet treat package",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Dental Chews",
      category: "Oral care",
      description: "A practical oral-care add-on for suitable pets, paired with routine dental checks.",
      image: {
        src: "https://images.pexels.com/photos/7310129/pexels-photo-7310129.jpeg?auto=compress&cs=tinysrgb&w=1200",
        alt: "Pet treats arranged on a clean table",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
  ],
  faqs: [
    {
      question: "Do I need an appointment to visit the clinic?",
      answer:
        "Call or send a WhatsApp message before visiting. The team will tell you the best time to come in and whether your pet needs urgent attention.",
    },
    {
      question: "What veterinary services are available in Limassol?",
      answer:
        "The clinic supports vaccinations, wellness checks, dermatology, dental care, diagnostics, surgery guidance, parasite control, and nutrition advice for dogs and cats.",
    },
    {
      question: "Can I ask about pet food before buying?",
      answer:
        "Yes. Product recommendations are informational and based on your pet's age, health, digestion, weight, and lifestyle. Products may link externally to Wolt or Foody.",
    },
    {
      question: "What should I bring to a first visit?",
      answer:
        "Bring vaccination records, medication details, recent test results if available, and a short note of symptoms or behavior changes you have noticed.",
    },
    {
      question: "What if my pet seems stressed at the vet?",
      answer:
        "Tell the clinic before arrival. They can suggest calmer timing, safe handling tips, and simple steps that make the visit less stressful.",
    },
  ],
  seo: {
    home: {
      title: "Veterinarian in Limassol | Modern Pet Care in Cyprus",
      description:
        "Modern veterinary clinic in Limassol, Cyprus for vaccinations, wellness checks, diagnostics, dental care, dermatology, nutrition, and pet health support.",
      canonical: "https://example-vet-clinic.com/",
      ogImage: "https://images.unsplash.com/photo-1770836037289-e00e5f351d11?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    },
    services: {
      title: "Veterinary Services in Limassol | Vaccinations, Dental Care, Surgery",
      description:
        "Explore veterinary services in Limassol including vaccinations, dental care, dermatology, surgery guidance, diagnostics, nutrition, and preventive pet care.",
      canonical: "https://example-vet-clinic.com/services",
      ogImage: "https://images.pexels.com/photos/6816838/pexels-photo-6816838.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  },
};

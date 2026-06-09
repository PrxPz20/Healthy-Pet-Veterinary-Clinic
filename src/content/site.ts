import healthyPetLogo from "@/assets/healthy_pet_logo.svg";
import nutribestPuppy from "@/assets/Nutribest-Puppy-with-Chicken-and-Rice-3kg.jpg";
import picartSalmonMenu from "@/assets/Picart-Select-ADULT-GRAIN-FREE-Salmon-Menu.jpg";
import aboutImage from "@/assets/about.jpg";
import profineSmallDog from "@/assets/profine-Dog_adult-small-chicken-&-potatoes_2kg.jpg";
import royalCaninStarter from "@/assets/royal-canin-vet-care-starter-small-dog-1-5kg.jpg";
import type { SiteContent } from "./types";

export const siteContent: SiteContent = {
  clinic: {
    name: "Healthy Pet Veterinary Clinic",
    legalName: "Healthy Pet Veterinary Clinic",
    tagline: "Established veterinary care and physiotherapy in Limassol.",
    siteUrl: "https://example-vet-clinic.com",
    logoUrl: healthyPetLogo,
    phone: "+35725101352",
    phoneDisplay: "+357 25 101352",
    vetPhone: "+35795952663",
    vetPhoneDisplay: "+357 95 952663",
    whatsapp: "https://wa.me/35795952663",
    whatsappDisplay: "WhatsApp +357 95 952663",
    email: "vetdr2000cy@gmail.com",
    address: {
      street: "Katinas Paxinou 66, Agios Athanasios",
      city: "Limassol",
      region: "Limassol",
      postalCode: "4105",
      country: "CY",
    },
    mapUrl: "https://maps.app.goo.gl/A6khHFn8mRUFN6qd9",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Katinas%20Paxinou%2066%2C%20Agios%20Athanasios%2C%20Limassol%204105%2C%20Cyprus&output=embed",
    socialLinks: [
      { label: "Instagram", href: "https://www.instagram.com/healthypet_veterinaryclinic/" },
      { label: "Facebook", href: "https://www.facebook.com/HealthyPetLimassol/" },
      { label: "TikTok", href: "https://www.tiktok.com/@dr.vetmed7?_t=ZN-8uq1vL0a8f8&_r=1" },
      { label: "YouTube", href: "https://www.youtube.com/@avgoustinostheodorou949" },
    ],
  },
  media: {
    heroVideo: "https://videos.pexels.com/video-files/6235183/6235183-uhd_2560_1440_25fps.mp4",
    heroPoster: {
      src: "https://images.unsplash.com/photo-1770836037289-e00e5f351d11?auto=format&fit=crop&fm=jpg&q=80&w=2200",
      alt: "Veterinarian examining a dog in a bright clinic room",
    },
    about: {
      src: aboutImage,
      alt: "Healthy Pet Veterinary Clinic interior and care environment",
    },
    care: {
      src: "https://images.pexels.com/photos/6234623/pexels-photo-6234623.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Veterinarian checking a dog during a routine examination",
    },
  },
  openingHours: [
    {
      day: "Monday",
      label: "Monday",
      ranges: [
        { opens: "09:00", closes: "13:00" },
        { opens: "15:00", closes: "19:00" },
      ],
    },
    {
      day: "Tuesday",
      label: "Tuesday",
      ranges: [
        { opens: "09:00", closes: "13:00" },
        { opens: "15:00", closes: "19:00" },
      ],
    },
    { day: "Wednesday", label: "Wednesday", ranges: [{ opens: "09:00", closes: "14:00" }] },
    {
      day: "Thursday",
      label: "Thursday",
      ranges: [
        { opens: "09:00", closes: "13:00" },
        { opens: "15:00", closes: "19:00" },
      ],
    },
    {
      day: "Friday",
      label: "Friday",
      ranges: [
        { opens: "09:00", closes: "13:00" },
        { opens: "15:00", closes: "19:00" },
      ],
    },
    { day: "Saturday", label: "Saturday", ranges: [{ opens: "09:00", closes: "14:00" }] },
    { day: "Sunday", label: "Sunday", ranges: [] },
  ],
  navigation: [
    { label: "Services", href: "/services" },
    { label: "About", href: "/#about" },
    { label: "Approach", href: "/#approach" },
    { label: "Products", href: "/#products" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
  hero: {
    eyebrow: "",
    title: "Established care for the companions you love.",
    body: "Veterinary medicine, physiotherapy, preventive care, diagnostics, and everyday support from Dr. Avgoustinos Theodorou.",
    primaryCta: { label: "Call Now", href: "tel:+35725101352" },
    secondaryCta: { label: "WhatsApp", href: "https://wa.me/35795952663", external: true },
  },
  about: {
    heading: "A well-established and trusted veterinary practice in Limassol.",
    paragraphs: [
      "Healthy Pet Veterinary Clinic was established by Dr. Avgoustinos Theodorou, who has been educated and specialised in both Veterinary Medicine and Veterinary Physiotherapy.",
      "Dr. Avgoustinos is a Russian-speaking doctor, also fluent in Greek and English. He looks forward to helping resolve the matters surrounding your lovely companion with clear communication and careful care.",
    ],
    badgeLocation: "Agios Athanasios, Limassol",
    badgeTitle: "Veterinary medicine and physiotherapy.",
  },
  trustPoints: [
    {
      icon: "clock",
      title: "Established practice",
      body: "Trusted veterinary care in Limassol with clear working hours and direct contact.",
    },
    {
      icon: "map-pin",
      title: "Agios Athanasios clinic",
      body: "Located on Katinas Paxinou 66 in Limassol 4105, Cyprus.",
    },
    {
      icon: "shield-check",
      title: "Veterinary physiotherapy",
      body: "Care supported by specialist education in veterinary medicine and physiotherapy.",
    },
    {
      icon: "heart-pulse",
      title: "Multilingual care",
      body: "Communication available in Russian, Greek, and English.",
    },
  ],
  services: [
    {
      slug: "pathology",
      icon: "microscope",
      title: "Pathology",
      seoTitle: "Pathology",
      short: "Tissue and fluid analysis to support accurate diagnosis and treatment decisions.",
      detail:
        "Animal pathology helps diagnose disease by analysing animal tissues and fluids. It supports care for companion animals and can also contribute to wider animal health, food safety, and wildlife conservation.",
      highlights: ["Tissue analysis", "Fluid analysis", "Disease diagnosis"],
    },
    {
      slug: "laboratory-blood-tests",
      icon: "flask-conical",
      title: "Full Laboratory Blood Tests",
      seoTitle: "Full Laboratory Blood Tests",
      short: "CBC and blood chemistry testing to understand your pet's health from the inside.",
      detail:
        "Blood and laboratory tests provide information that can only be found by collecting and analysing a blood sample. A complete blood count measures white blood cells, red blood cells, and platelets, while blood chemistry tests assess important chemical components in the blood.",
      highlights: ["Complete blood count", "Blood chemistry", "Immune and oxygen markers"],
    },
    {
      slug: "orthopedic-surgery",
      icon: "bone",
      title: "Orthopedic Surgery",
      seoTitle: "Orthopedic Surgery",
      short: "Surgical care for bones, joints, ligaments, muscles, and tendons.",
      detail:
        "Veterinary orthopedic surgery focuses on preventing, diagnosing, and treating conditions affecting the musculoskeletal system. After-surgery care is an important part of the plan so pets can recover as fully and safely as possible.",
      highlights: ["Bone and joint care", "Ligament conditions", "Recovery guidance"],
    },
    {
      slug: "soft-tissue-surgery",
      icon: "scissors",
      title: "Soft Tissue Surgery",
      seoTitle: "Soft Tissue Surgery",
      short:
        "Surgical care for internal organs, eyes, reproductive health, and other soft tissues.",
      detail:
        "Soft tissue surgery can involve many areas of the body, including gastrointestinal, bladder, liver, spleen, eye, and reproductive procedures. Common examples include removing foreign objects, stones, masses, diseased tissue, damaged eyes, cherry eye repair, and spaying or neutering.",
      highlights: ["Gastrointestinal surgery", "Bladder and organ surgery", "Spay and neuter"],
    },
    {
      slug: "dermatology",
      icon: "activity",
      title: "Dermatology",
      seoTitle: "Dermatology",
      short: "Diagnosis and treatment for allergies, skin disease, itching, and ear infections.",
      detail:
        "Dogs and cats can react badly to plants, chemicals, foods, and other triggers. Healthy Pet Veterinary Clinic treats difficult skin and ear diseases, including allergies and ear infections, with compassionate care focused on finding the cause and choosing the right treatment.",
      highlights: ["Dog and cat allergies", "Ear infections", "Skin disease treatment"],
    },
    {
      slug: "ultrasound",
      icon: "microscope",
      title: "Ultrasound",
      seoTitle: "Ultrasound",
      short: "Safe, non-invasive imaging to view internal body structures and organs.",
      detail:
        "Ultrasonography is a non-invasive imaging technique that records echoes from ultrasound waves to create images of internal structures. Unlike X-rays, ultrasound waves are considered safe and are widely used in veterinary practice.",
      highlights: ["Non-invasive imaging", "Internal organ views", "Safe ultrasound waves"],
    },
    {
      slug: "digital-x-ray",
      icon: "scan-line",
      title: "Digital X-Ray",
      seoTitle: "Digital X-Ray",
      short: "Digital radiology for examining bones, joints, organs, injuries, and recovery.",
      detail:
        "Digital X-rays are an excellent way to examine the bones, joints, and organs of a sick or injured pet. Digital radiology also helps monitor healing after orthopedic surgery, and images can be shared easily for expert consultation.",
      highlights: ["Bone and joint imaging", "Organ assessment", "Digital image sharing"],
    },
    {
      slug: "pet-hydrotherapy",
      icon: "waves",
      title: "Pet Hydrotherapy",
      seoTitle: "Pet Hydrotherapy",
      short:
        "Water-based rehabilitation to support movement, recovery, pain relief, and joint comfort.",
      detail:
        "Hydrotherapy uses buoyancy, resistance, viscosity, and hydrostatic pressure to help dogs move injured joints during rehabilitation. It can support dogs with ACL injuries, hip dysplasia, degenerative joint disease, arthritis, paralysis, or limb loss by reducing joint stress and swelling.",
      highlights: ["Injury rehabilitation", "Joint pain support", "Low-impact movement"],
    },
    {
      slug: "physiotherapy-acupuncture",
      icon: "heart-pulse",
      title: "Pet Physiotherapy & Acupuncture",
      seoTitle: "Pet Physiotherapy & Acupuncture",
      short:
        "Rehabilitation care using physiotherapy, acupuncture, massage, and therapeutic exercises.",
      detail:
        "Veterinary physiotherapy aims to restore movement and function as close to normal as possible after injury, illness, or developmental problems. Treatment options may include electrotherapy, ultrasound therapy, magnetotherapy, infrared heat therapy, acupuncture, massage, and guided exercises.",
      highlights: ["Rehabilitation plans", "Acupuncture therapy", "Exercise and massage"],
    },
    {
      slug: "endoscopy",
      icon: "camera",
      title: "Endoscopy",
      seoTitle: "Endoscopy",
      short: "Minimally invasive examination of internal organs and body cavities.",
      detail:
        "Endoscopy uses a medical instrument with a camera, microchip, and light source to examine areas such as the esophagus, stomach, intestines, urinary system, trachea, lungs, nasal cavity, abdomen, or chest. Gastrointestinal endoscopy is one of the most common uses in veterinary medicine.",
      highlights: ["Minimally invasive", "GI tract examination", "High-quality imaging"],
    },
    {
      slug: "grooming",
      icon: "scissors",
      title: "Grooming",
      seoTitle: "Grooming",
      short: "Hygienic care and cleaning to support comfort, coat health, and appearance.",
      detail:
        "Dog grooming includes hygienic care, cleaning, coat maintenance, and appearance support. Grooming can help pets stay comfortable, clean, and easier to monitor for skin or coat changes.",
      highlights: ["Coat care", "Hygienic cleaning", "Appearance support"],
    },
    {
      slug: "pet-shop",
      icon: "package",
      title: "Pet Shop",
      seoTitle: "Pet Shop",
      short:
        "Food, treats, medications, supplements, accessories, shampoos, collars, toys, and more.",
      detail:
        "The pet shop offers a wide range of products pets need or enjoy, including food and treats, prescription medications, dietary supplements, clothing, accessories, carriers, shampoos, collars, leashes, harnesses, feeding stations, flea and tick control products, and toys.",
      highlights: ["Food and treats", "Supplements and medication", "Accessories and toys"],
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
      name: "Nutribest Puppy with Chicken and Rice 3kg",
      category: "Puppy food",
      description:
        "Complete puppy food with chicken and rice, available through the clinic product selection.",
      image: {
        src: nutribestPuppy,
        alt: "Nutribest Puppy with Chicken and Rice 3kg pet food bag",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Picart Select Adult Grain Free Salmon Menu",
      category: "Adult dog food",
      description:
        "Adult grain-free salmon menu for dogs, available through the clinic product selection.",
      image: {
        src: picartSalmonMenu,
        alt: "Picart Select Adult Grain Free Salmon Menu pet food bag",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Profine Dog Adult Small Chicken & Potatoes 2kg",
      category: "Small dog food",
      description:
        "Chicken and potatoes adult food for small dogs, available through the clinic product selection.",
      image: {
        src: profineSmallDog,
        alt: "Profine Dog Adult Small Chicken and Potatoes 2kg pet food bag",
      },
      links: {
        wolt: "https://wolt.com/",
        foody: "https://www.foody.com.cy/",
      },
    },
    {
      name: "Royal Canin Vet Care Starter Small Dog 1.5kg",
      category: "Veterinary nutrition",
      description:
        "Starter nutrition for small dogs from Royal Canin Vet Care, available through the clinic product selection.",
      image: {
        src: royalCaninStarter,
        alt: "Royal Canin Vet Care Starter Small Dog 1.5kg pet food bag",
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
        "The clinic supports pathology, full laboratory blood tests, orthopedic and soft tissue surgery, dermatology, ultrasound, digital X-ray, hydrotherapy, physiotherapy, acupuncture, endoscopy, grooming, and pet shop products.",
    },
    {
      question: "Can I ask about pet food before buying?",
      answer:
        "Yes. Food guidance should match your pet's age, health, digestion, weight, and lifestyle. When suitable, product links can send you to Wolt or Foody.",
    },
    {
      question: "What should I bring to a first visit?",
      answer:
        "Bring vaccination records, medication details, recent test results if available, and a short note of symptoms or behavior changes you have noticed.",
    },
    {
      question: "What if my pet seems stressed at the vet?",
      answer:
        "Tell the clinic before arrival. Dr. Avgoustinos can suggest calmer timing, safe handling tips, and simple steps that make the visit less stressful.",
    },
  ],
  seo: {
    home: {
      title: "Healthy Pet Veterinary Clinic | Veterinarian in Limassol",
      description:
        "Healthy Pet Veterinary Clinic in Agios Athanasios, Limassol, established by Dr. Avgoustinos Theodorou for veterinary medicine, physiotherapy, preventive care, and pet health support.",
      canonical: "https://example-vet-clinic.com/",
      ogImage:
        "https://images.unsplash.com/photo-1770836037289-e00e5f351d11?auto=format&fit=crop&fm=jpg&q=80&w=1200",
    },
    services: {
      title: "Veterinary Services in Limassol | Healthy Pet Veterinary Clinic",
      description:
        "Explore veterinary services in Limassol from Healthy Pet Veterinary Clinic, including pathology, laboratory blood tests, surgery, dermatology, ultrasound, digital X-ray, hydrotherapy, physiotherapy, acupuncture, endoscopy, grooming, and pet shop support.",
      canonical: "https://example-vet-clinic.com/services",
      ogImage:
        "https://images.pexels.com/photos/6816838/pexels-photo-6816838.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  },
};

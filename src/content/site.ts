import healthyPetLogo from "@/assets/healthy_pet_logo.svg";
import nutribestPuppy from "@/assets/Nutribest-Puppy-with-Chicken-and-Rice-3kg.jpg";
import picartSalmonMenu from "@/assets/Picart-Select-ADULT-GRAIN-FREE-Salmon-Menu.jpg";
import aboutImage from "@/assets/about.jpg";
import galleryClinicTable from "@/assets/gallery/image_1.jpg";
import galleryMyRescues from "@/assets/gallery/image_2_MY_RESCUES.jpg";
import galleryPuppies from "@/assets/gallery/image_3_PUPPIES.jpg";
import galleryFroza from "@/assets/gallery/image_4_FROZA.jpg";
import galleryTsitsis from "@/assets/gallery/image_5_TSITSIS.jpg";
import galleryTedy from "@/assets/gallery/image_6_tedy.jpg";
import galleryGreta from "@/assets/gallery/image_7_greta.jpg";
import galleryDj from "@/assets/gallery/image_8_dj.jpg";
import caseGoldie from "@/assets/cases/GOLDIE_bone_removed.jpg";
import caseLana from "@/assets/cases/LANA_cesarean.jpg";
import caseSpongos from "@/assets/cases/SPONGOS_tumor.jpg";
import caseMavroulias from "@/assets/cases/mavroulias_broken_front_right_leg.jpg";
import caseRocky from "@/assets/cases/rocky_dog_bite.jpg";
import caseJiroud from "@/assets/cases/JIROUD_cherry_eye.webp";
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
    { label: "Services", href: "/#services" },
    { label: "Doctor", href: "/#doctor" },
    { label: "Gallery", href: "/#gallery" },
    { label: "Cases", href: "/#cases" },
    { label: "Products", href: "/#products" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/#contact" },
  ],
  hero: {
    eyebrow: "",
    title: "Veterinary care for the companions you love.",
    body: "Veterinary medicine, physiotherapy, diagnostics, and preventive care in Agios Athanasios, Limassol.",
    primaryCta: { label: "Call Now", href: "tel:+35725101352" },
    secondaryCta: { label: "WhatsApp", href: "https://wa.me/35795952663", external: true },
  },
  homepage: {
    services: {
      label: "SERVICES",
      heading: "Veterinary services, delivered with patience.",
      ctaLabel: "See all care services",
    },
    approach: {
      label: "CARE APPROACH",
      heading: "Built for prevention, not panic.",
      body: "The clinic experience is designed around steady communication: what is happening, why it matters, and what owners should do next.",
    },
    gallery: {
      heading: "Real moments from the clinic.",
      body: "A few familiar faces and everyday clinic moments from Healthy Pet Veterinary Clinic.",
      ctaLabel: "View gallery",
    },
    cases: {
      heading: "Documented veterinary cases.",
      body: "Selected case images are shared for educational review. Sensitive media stays protected until the viewer chooses to open it.",
      ctaLabel: "View cases",
    },
    products: {
      heading: "Pet food and everyday essentials.",
      body: "A selection of food and care products available through the clinic. Contact the clinic to ask about current availability and suitable options for your pet.",
      helpHeading: "Need help choosing a product?",
      helpBody:
        "Ask the clinic about food, supplements, or everyday care items before choosing what is right for your pet.",
      ctaLabel: "Contact the clinic",
    },
    ctaStrip: {
      heading: "Need help? Call or WhatsApp us.",
      body: "Speak with the clinic before you visit, ask about your pet's symptoms, or check the next step.",
    },
    testimonials: {
      heading: "What pet owners say.",
      body: "A few words from pet owners who shared their experience with the clinic.",
      emptyState: "Testimonials will be added after the clinic approves the reviews.",
      reviewsUrl:
        "https://www.google.com/maps/place/Healthy+Pet+Veterinary+Clinic+-+Dr.+Avgoustinos+Theodorou/@34.7086804,33.0384632,839m/data=!3m1!1e3!4m8!3m7!1s0x14e73354438e4781:0x3e9c9815f6d172bd!8m2!3d34.709082!4d33.0432822!9m1!1b1!16s%2Fg%2F11h57xx0yl?entry=ttu&g_ep=EgoyMDI2MDYyOC4wIKXMDSoASAFQAw%3D%3D",
    },
    faq: {
      heading: "Direct answers before you call.",
    },
    contact: {
      label: "CONTACT",
      heading: "Visit Healthy Pet",
      body: "",
      mapCtaLabel: "Open map",
    },
    servicesCta: { label: "Explore our services", href: "/services" },
    finalCta: {
      heading: "Ready to speak with the clinic?",
      body: "Call or send a WhatsApp message and the clinic will guide you on the next step.",
    },
  },
  about: {
    label: "About Us",
    heading: "Veterinary medicine and physiotherapy in one practice.",
    paragraphs: [
      "Healthy Pet Veterinary Clinic was established by Dr. Avgoustinos Theodorou, who studied Veterinary Medicine and specialised in Veterinary Physiotherapy.",
      "Dr. Avgoustinos speaks Russian, Greek, and English, helping owners discuss their pet's care clearly and comfortably.",
    ],
    badgeLocation: "Agios Athanasios, Limassol",
    badgeTitle: "Veterinary medicine and physiotherapy.",
    metrics: [
      { label: "Years of experience", value: 20, suffix: "+" },
      { label: "Completed cases", value: 1000, suffix: "+" },
    ],
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
  serviceCategories: [
    {
      id: "diagnostics",
      label: "Diagnostics",
      description: "Testing and imaging that help the clinic understand what is happening.",
      serviceSlugs: [
        "pathology",
        "laboratory-blood-tests",
        "ultrasound",
        "digital-x-ray",
        "endoscopy",
      ],
    },
    {
      id: "surgery",
      label: "Surgery",
      description: "Surgical care for orthopedic conditions, soft tissues, and recovery planning.",
      serviceSlugs: ["orthopedic-surgery", "soft-tissue-surgery"],
    },
    {
      id: "skin-care",
      label: "Skin & Ears",
      description: "Support for itching, allergies, difficult skin problems, and ear infections.",
      serviceSlugs: ["dermatology"],
    },
    {
      id: "rehabilitation",
      label: "Rehabilitation",
      description: "Physiotherapy, acupuncture, and water-based movement support.",
      serviceSlugs: ["pet-hydrotherapy", "physiotherapy-acupuncture"],
    },
    {
      id: "daily-care",
      label: "Daily Care",
      description: "Everyday hygiene and grooming support for comfort and coat health.",
      serviceSlugs: ["grooming"],
    },
    {
      id: "shop-products",
      label: "Pet Shop",
      description: "Food, accessories, supplements, hygiene products, toys, and essentials.",
      serviceSlugs: ["pet-shop"],
    },
  ],
  services: [
    {
      slug: "pathology",
      icon: "microscope",
      category: "diagnostics",
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
      category: "diagnostics",
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
      category: "surgery",
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
      category: "surgery",
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
      category: "skin-care",
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
      category: "diagnostics",
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
      category: "diagnostics",
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
      category: "rehabilitation",
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
      category: "rehabilitation",
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
      category: "diagnostics",
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
      category: "daily-care",
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
      category: "shop-products",
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
  gallery: [
    {
      slug: "clinic-table",
      title: "Clinic Table",
      description: "A real clinic moment with a dog on the examination table.",
      orientation: "portrait",
      image: {
        src: galleryClinicTable,
        alt: "Golden brown dog sitting on a veterinary examination table.",
      },
    },
    {
      slug: "my-rescues",
      title: "My Rescues",
      description: "Dr. Avgoustinos with two cats at the clinic.",
      orientation: "portrait",
      image: {
        src: galleryMyRescues,
        alt: "Dr. Avgoustinos Theodorou holding two cats in front of pet food shelves.",
      },
    },
    {
      slug: "puppies",
      title: "Puppies",
      description: "Two puppies during a clinic visit.",
      orientation: "landscape",
      image: {
        src: galleryPuppies,
        alt: "Two puppies sitting together in a red carrier on a clinic table.",
      },
    },
    {
      slug: "froza",
      title: "Froza",
      description: "Froza with Dr. Avgoustinos in the clinic room.",
      orientation: "portrait",
      image: {
        src: galleryFroza,
        alt: "Dr. Avgoustinos Theodorou holding a small tan dog named Froza.",
      },
    },
    {
      slug: "tsitsis",
      title: "Tsitsis",
      description: "Tsitsis with Dr. Avgoustinos at the clinic.",
      orientation: "portrait",
      image: {
        src: galleryTsitsis,
        alt: "Dr. Avgoustinos Theodorou holding a white dog named Tsitsis.",
      },
    },
    {
      slug: "tedy",
      title: "Tedy",
      description: "Tedy with Dr. Avgoustinos in the treatment room.",
      orientation: "portrait",
      image: {
        src: galleryTedy,
        alt: "Dr. Avgoustinos Theodorou holding a guinea pig named Tedy near veterinary instruments.",
      },
    },
    {
      slug: "greta",
      title: "Greta",
      description: "Greta travelling calmly with a familiar person.",
      orientation: "portrait",
      image: {
        src: galleryGreta,
        alt: "A man sitting on an airplane with a cat named Greta tucked safely beside him.",
      },
    },
    {
      slug: "dj",
      title: "DJ",
      description: "DJ visiting the clinic shop area.",
      orientation: "landscape",
      image: {
        src: galleryDj,
        alt: "Dr. Avgoustinos Theodorou standing with a client and a golden dog named DJ in the clinic shop area.",
      },
    },
  ],
  cases: [
    {
      id: "goldie-care-case",
      title: "Goldie Care Case",
      category: "Surgical case",
      description: "A documented veterinary case from the clinic for educational review.",
      isSensitive: true,
      homepagePreview: true,
      orientation: "landscape",
      image: {
        src: caseGoldie,
        alt: "Sensitive veterinary case image for Goldie documented inside the clinic.",
      },
    },
    {
      id: "lana-cesarean-case",
      title: "Lana Cesarean Case",
      category: "Surgical case",
      description: "A documented surgical case from the clinic for educational purposes.",
      isSensitive: true,
      homepagePreview: true,
      orientation: "landscape",
      image: {
        src: caseLana,
        alt: "Sensitive veterinary surgical case image for Lana.",
      },
    },
    {
      id: "spongos-care-case",
      title: "Spongos Care Case",
      category: "Veterinary case",
      description: "A veterinary case image documented for professional review.",
      isSensitive: true,
      homepagePreview: true,
      orientation: "portrait",
      image: {
        src: caseSpongos,
        alt: "Sensitive veterinary case image for Spongos documented at the clinic.",
      },
    },
    {
      id: "mavroulias-orthopedic-case",
      title: "Mavroulias Orthopedic Case",
      category: "Orthopedic case",
      description: "A documented orthopedic case from the clinic for educational purposes.",
      isSensitive: true,
      homepagePreview: true,
      orientation: "landscape",
      image: {
        src: caseMavroulias,
        alt: "Sensitive veterinary orthopedic case image for Mavroulias.",
      },
    },
    {
      id: "rocky-wound-care-case",
      title: "Rocky Wound Care Case",
      category: "Wound care case",
      description: "A documented wound care case from the clinic for educational purposes.",
      isSensitive: true,
      orientation: "portrait",
      image: {
        src: caseRocky,
        alt: "Sensitive veterinary wound care case image for Rocky.",
      },
    },
    {
      id: "jiroud-cherry-eye-case",
      title: "JIROUD",
      category: "Surgical case",
      description: "JIROUD had a Cherry eye correction surgery.",
      isSensitive: true,
      orientation: "portrait",
      image: {
        src: caseJiroud,
        alt: "Sensitive veterinary cherry eye correction surgery case image for JIROUD.",
      },
    },
  ],
  products: [
    {
      name: "Nutribest Puppy with Chicken and Rice 3kg",
      category: "Puppy food",
      description: "Nutribest puppy food with chicken and rice in a 3kg bag.",
      image: {
        src: nutribestPuppy,
        alt: "Nutribest Puppy with Chicken and Rice 3kg pet food bag",
      },
      links: {},
    },
    {
      name: "Picart Select Adult Grain Free Salmon Menu",
      category: "Adult dog food",
      description: "Picart Select grain-free salmon menu for adult dogs.",
      image: {
        src: picartSalmonMenu,
        alt: "Picart Select Adult Grain Free Salmon Menu pet food bag",
      },
      links: {},
    },
    {
      name: "Profine Dog Adult Small Chicken & Potatoes 2kg",
      category: "Small dog food",
      description: "Profine chicken and potatoes food for adult small dogs in a 2kg bag.",
      image: {
        src: profineSmallDog,
        alt: "Profine Dog Adult Small Chicken and Potatoes 2kg pet food bag",
      },
      links: {},
    },
    {
      name: "Royal Canin Vet Care Starter Small Dog 1.5kg",
      category: "Veterinary nutrition",
      description: "Royal Canin Vet Care starter food for small dogs in a 1.5kg bag.",
      image: {
        src: royalCaninStarter,
        alt: "Royal Canin Vet Care Starter Small Dog 1.5kg pet food bag",
      },
      links: {},
    },
  ],
  testimonials: [
    {
      name: "Andonis",
      rating: 5,
      text: "Very experienced vet, great approach, very friendly and smooth with the dog, made it feel very calm and comfortable. Generally very happy and if you care about your pet to take it to a good vet, I recommend him.",
    },
    {
      name: "Yiannis",
      rating: 5,
      text: "A small clinic but very helpful! My dog was not eating at the time, and I had no idea what the reason could be. I took him to the clinic and they were very patient with him and tried different things to determine why he had lost his appetite. They were very attentive and I could tell they have a lot of love for animals and that made me trust them. I would recommend them!",
    },
    {
      name: "Дмитрий",
      rating: 5,
      text: "I think the Russian storyteller Chukovsky could take the example of Dr. Abolit from Dr. Avgustinos. A very attentive and helpful doctor, always surrounded by cats. Speaks Russian well. My highest recommendations. We have sterilized our cat and regularly carry out the necessary vaccinations with him.",
    },
    {
      name: "Anna",
      rating: 5,
      text: "Fantastic service, open and informative communication about my cats condition, his diagnosis and prognosis and professional approach to future treatment. He saved our little baby Lucy for a certain death! It was a miracle! Dr. Augoustinos is very knowledgeable and offers detail explanations and practical advice. I was surprised how much he loves his job and animals. His experience shows and instills confidence!",
    },
    {
      name: "Dia",
      rating: 5,
      text: "The service at this clinic is exceptional! Dr Avgoustinos is a very knowledgeable, experienced and caring vet. He has treated my dog with great care and genuine concern. He is open to questions and explains everything you need to know in detail. Highly recommended!",
    },
    {
      name: "Alisa",
      rating: 5,
      text: "Great doctor, very empathetic and helped us with our adopted kitten!",
    },
    {
      name: "Yulia",
      rating: 5,
      text: "Thanks a lot for your care and attention to our dog Shibi!",
    },
  ],
  faqs: [
    {
      question: "How can I contact the clinic before visiting?",
      answer:
        "Call +357 25 101352 or send a WhatsApp message to +357 95 952663 during working hours to ask about visit timing.",
    },
    {
      question: "What veterinary services are available in Limassol?",
      answer:
        "The clinic supports pathology, full laboratory blood tests, orthopedic and soft tissue surgery, dermatology, ultrasound, digital X-ray, hydrotherapy, physiotherapy, acupuncture, endoscopy, grooming, and pet shop products.",
    },
    {
      question: "Can I ask about pet food before buying?",
      answer:
        "Yes. Contact the clinic to ask about current product availability and options suited to your pet's age and needs.",
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
    gallery: {
      title: "Gallery | Healthy Pet Veterinary Clinic",
      description:
        "Real clinic moments and pet photos from Healthy Pet Veterinary Clinic in Agios Athanasios, Limassol.",
      canonical: "https://example-vet-clinic.com/gallery",
      ogImage: galleryMyRescues,
    },
    cases: {
      title: "Cases | Healthy Pet Veterinary Clinic",
      description:
        "Documented veterinary case examples from Healthy Pet Veterinary Clinic, with sensitive images protected by a viewing warning.",
      canonical: "https://example-vet-clinic.com/cases",
      ogImage: caseLana,
    },
  },
};

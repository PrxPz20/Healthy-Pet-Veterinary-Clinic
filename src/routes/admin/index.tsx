import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  GripVertical,
  Info,
  ImagePlus,
  List,
  ListFilter,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  PawPrint,
  Plus,
  RotateCcw,
  Save,
  Search,
  Phone,
  Stethoscope,
  Tags,
  Clock,
  Trash2,
  HelpCircle,
  Star,
  UserRound,
  X,
} from "lucide-react";
import type { FormEvent, InvalidEvent, ReactNode } from "react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  archiveRecord,
  bulkContentAction,
  createCategory,
  createCaseItem,
  createFaq,
  createGalleryItem,
  createProduct,
  createService,
  createTestimonial,
  deleteCategory,
  getAdminSessionState,
  getAboutSettings,
  getContactSettings,
  getDashboardCounts,
  listCases,
  listCategories,
  listFaqs,
  listGallery,
  listProducts,
  listServices,
  listTestimonials,
  publicStorageUrl,
  purgeExpiredArchives,
  reorderRecords,
  renameCategory,
  restoreRecord,
  saveAboutSettings,
  saveContactAddress,
  saveContactMethods,
  saveOpeningHours,
  seedStaticContent,
  signOutAdmin,
  updateCaseItem,
  updateFaq,
  updateGalleryItem,
  updateProduct,
  updateService,
  updateStatus,
  updateTestimonial,
  type AboutSettingsRow,
  type CaseRow,
  type AdminContactSettings,
  type BulkContentAction,
  type CategoryRow,
  type CmsStatus,
  type DashboardCounts,
  type FaqRow,
  type GalleryRow,
  type AdminOpeningHour,
  type ProductRow,
  type ServiceRow,
  type TestimonialRow,
} from "@/lib/admin/repository";
import {
  contactAddressSchema,
  contactMethodsSchema,
  caseFormSchema,
  faqFormSchema,
  galleryFormSchema,
  normalizeInternationalPhone,
  openingHoursSchema,
  aboutFormSchema,
  productFormSchema,
  serviceFormSchema,
  testimonialFormSchema,
  validateAdminImage,
} from "@/lib/admin/validators";
import logoUrl from "@/assets/healthy_pet_logo_admin_white.png";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin dashboard | Healthy Pet Veterinary Clinic" }],
    links: [{ rel: "preload", as: "image", href: logoUrl, type: "image/png" }],
  }),
  component: AdminDashboardPage,
});

type LoadState = "loading" | "ready" | "error";
type AdminSection =
  | "overview"
  | "gallery"
  | "cases"
  | "services"
  | "products"
  | "contact"
  | "faq"
  | "about"
  | "reviews";

const MAX_FAQS = 12;
const MAX_REVIEWS = 12;
const ADMIN_QUERY_KEY = "admin-section";
const ADMIN_CACHE_TIME = 5 * 60 * 1000;
const MAINTENANCE_INTERVAL = 24 * 60 * 60 * 1000;
const MAINTENANCE_KEY = "healthy-pet-admin-maintenance";
const countedSections = new Set<AdminSection>([
  "gallery",
  "cases",
  "services",
  "products",
  "faq",
  "reviews",
]);

const adminSections: {
  id: AdminSection;
  label: string;
  icon: ReactNode;
}[] = [
  { id: "overview", label: "Overview", icon: <CheckCircle2 className="h-4 w-4" /> },
  { id: "services", label: "Services", icon: <Stethoscope className="h-4 w-4" /> },
  { id: "gallery", label: "Gallery", icon: <ImagePlus className="h-4 w-4" /> },
  { id: "cases", label: "Cases", icon: <PawPrint className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
  { id: "faq", label: "FAQ", icon: <HelpCircle className="h-4 w-4" /> },
  { id: "about", label: "About Us", icon: <UserRound className="h-4 w-4" /> },
  { id: "reviews", label: "Google reviews", icon: <Star className="h-4 w-4" /> },
  { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
];

type AdminSectionData =
  | { section: "overview"; counts: DashboardCounts }
  | { section: "gallery"; items: GalleryRow[] }
  | { section: "cases"; items: CaseRow[]; categories: CategoryRow[] | null }
  | { section: "services"; items: ServiceRow[]; categories: CategoryRow[] | null }
  | { section: "products"; items: ProductRow[]; categories: CategoryRow[] | null }
  | { section: "faq"; items: FaqRow[] }
  | { section: "about"; value: AboutSettingsRow }
  | { section: "reviews"; items: TestimonialRow[] }
  | { section: "contact"; value: AdminContactSettings };

async function loadAdminSection(section: AdminSection): Promise<AdminSectionData> {
  switch (section) {
    case "overview":
      return { section, counts: await getDashboardCounts() };
    case "gallery":
      return { section, items: await listGallery() };
    case "cases": {
      const [items, categories] = await Promise.all([listCases(), listCategories("cases")]);
      return { section, items, categories };
    }
    case "services": {
      const [items, categories] = await Promise.all([listServices(), listCategories("services")]);
      return { section, items, categories };
    }
    case "products": {
      const [items, categories] = await Promise.all([listProducts(), listCategories("products")]);
      return { section, items, categories };
    }
    case "faq":
      return { section, items: await listFaqs() };
    case "about":
      return { section, value: await getAboutSettings() };
    case "reviews":
      return { section, items: await listTestimonials() };
    case "contact":
      return { section, value: await getContactSettings() };
  }
}

function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sessionStatus, setSessionStatus] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  useEffect(() => {
    let active = true;

    void getAdminSessionState()
      .then(async (session) => {
        if (!active) return;
        if (session.status === "unconfigured" || session.status === "signed-out") {
          await navigate({ to: "/admin/login" });
          return;
        }
        if (session.status === "forbidden") {
          setError("This account is signed in, but it is not listed as an active admin.");
          setSessionStatus("error");
          return;
        }
        setSessionStatus("ready");
      })
      .catch((currentError) => {
        if (!active) return;
        setError(
          currentError instanceof Error ? currentError.message : "Unable to load dashboard.",
        );
        setSessionStatus("error");
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  const sectionQuery = useQuery({
    queryKey: [ADMIN_QUERY_KEY, activeSection],
    queryFn: () => loadAdminSection(activeSection),
    enabled: sessionStatus === "ready",
    staleTime: ADMIN_CACHE_TIME,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (sessionStatus !== "ready") return;

    let lastRun = 0;
    try {
      lastRun = Number(localStorage.getItem(MAINTENANCE_KEY) ?? 0);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    }
    if (Date.now() - lastRun < MAINTENANCE_INTERVAL) return;

    const timeout = window.setTimeout(() => {
      void Promise.all([seedStaticContent(), purgeExpiredArchives()])
        .then(() => {
          try {
            localStorage.setItem(MAINTENANCE_KEY, String(Date.now()));
          } catch {
            // Storage can be unavailable in privacy-restricted browsers.
          }
        })
        .catch((currentError) => {
          console.warn(
            "Background dashboard maintenance did not complete.",
            currentError instanceof Error ? currentError.message : currentError,
          );
        });
    }, 3000);

    return () => window.clearTimeout(timeout);
  }, [sessionStatus]);

  async function withRefresh(action: () => Promise<void>, section = activeSection) {
    setBusy(true);
    setError("");
    try {
      await action();
      await queryClient.invalidateQueries({
        queryKey: [ADMIN_QUERY_KEY, section],
        exact: true,
        refetchType: "active",
      });
      if (countedSections.has(section)) {
        await queryClient.invalidateQueries({
          queryKey: [ADMIN_QUERY_KEY, "overview"],
          exact: true,
          refetchType: "none",
        });
      }
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : "Unable to save changes.");
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setSessionStatus("loading");
    try {
      await signOutAdmin();
    } finally {
      await navigate({ to: "/admin/login", replace: true });
    }
  }

  if (sessionStatus === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4] px-5 text-ink">
        <div
          role="status"
          className="inline-flex items-center gap-3 text-sm font-semibold text-ink/62"
        >
          <Loader2 className="h-5 w-5 animate-spin text-vet-green" aria-hidden="true" />
          Checking secure session...
        </div>
      </main>
    );
  }

  if (sessionStatus === "error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f8f4] px-5 text-ink">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="type-card-title">Unable to open the dashboard</p>
          <p className="mt-3 text-sm leading-relaxed text-red-700">{error}</p>
          <a
            href="/admin/login"
            className="focus-ring type-button mt-5 inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-white"
          >
            Return to login
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-ink" aria-busy={busy}>
      {busy ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-[120] inline-flex min-h-11 items-center gap-2 rounded-full border border-vet-green/20 bg-ink px-4 text-sm font-semibold text-white shadow-xl sm:bottom-6 sm:right-6"
        >
          <Loader2 className="h-4 w-4 animate-spin text-vet-green" aria-hidden="true" />
          Saving changes...
        </div>
      ) : null}
      <header className="border-b border-line bg-ink px-5 py-5 text-white sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="Healthy Pet Veterinary Clinic"
              width={448}
              height={115}
              fetchPriority="high"
              className="h-12 w-auto max-w-[12rem] object-contain sm:h-14 sm:max-w-[14rem]"
            />
            <span className="hidden h-9 w-px bg-white/18 sm:block" aria-hidden="true" />
            <h1 className="type-card-title hidden text-white/88 sm:block">Content dashboard</h1>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-ink transition-colors hover:bg-sage"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-0 md:py-10">
        {error ? (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {sessionStatus === "ready" ? (
          <div className="grid min-w-0 gap-5 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
            <aside className="min-w-0 rounded-[1.5rem] border border-line bg-white p-2 shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] lg:sticky lg:top-6 lg:p-3">
              <nav
                aria-label="Admin sections"
                className="flex min-w-0 gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0"
              >
                {adminSections.map((section) => {
                  const active = activeSection === section.id;

                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => setActiveSection(section.id)}
                      className={`focus-ring focus-ring-dark type-button inline-flex min-h-11 shrink-0 items-center gap-3 rounded-2xl px-4 text-left transition-colors lg:w-full ${
                        active ? "bg-ink text-white" : "text-ink/68 hover:bg-sage hover:text-ink"
                      }`}
                    >
                      {section.icon}
                      {section.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 space-y-6">
              {sectionQuery.isPending ? (
                <section
                  role="status"
                  className="flex min-h-56 items-center justify-center rounded-[1.5rem] border border-line bg-white p-6"
                >
                  <span className="inline-flex items-center gap-3 text-sm font-semibold text-ink/62">
                    <Loader2 className="h-5 w-5 animate-spin text-vet-green" aria-hidden="true" />
                    Loading {adminSections.find((section) => section.id === activeSection)?.label}
                    ...
                  </span>
                </section>
              ) : null}

              {sectionQuery.isError ? (
                <section className="rounded-[1.5rem] border border-red-200 bg-white p-6">
                  <p className="type-card-title">This section did not load</p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-red-700">
                    {sectionQuery.error instanceof Error
                      ? sectionQuery.error.message
                      : "Unable to load this dashboard section."}
                  </p>
                  <button
                    type="button"
                    onClick={() => void sectionQuery.refetch()}
                    className="focus-ring type-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-white transition-colors hover:bg-vet-green"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                    Try again
                  </button>
                </section>
              ) : null}

              {activeSection === "overview" && sectionQuery.data?.section === "overview" ? (
                <section className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  <Metric title="Gallery" value={sectionQuery.data.counts.gallery} />
                  <Metric title="Cases" value={sectionQuery.data.counts.cases} />
                  <Metric title="Services" value={sectionQuery.data.counts.services} />
                  <Metric title="Products" value={sectionQuery.data.counts.products} />
                  <Metric title="FAQs" value={sectionQuery.data.counts.faqs} />
                  <Metric title="Reviews" value={sectionQuery.data.counts.reviews} />
                </section>
              ) : null}

              {activeSection === "gallery" && sectionQuery.data?.section === "gallery" ? (
                <GalleryManager
                  items={sectionQuery.data.items}
                  disabled={busy}
                  onCreate={(values) => withRefresh(() => createGalleryItem(values))}
                  onUpdate={(id, values) => withRefresh(() => updateGalleryItem(id, values))}
                  onStatus={(id, status) =>
                    withRefresh(() => updateStatus("gallery_items", id, status))
                  }
                  onArchive={(id) => withRefresh(() => archiveRecord("gallery_items", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("gallery_items", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("gallery_items", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("gallery_items", ids))}
                />
              ) : null}

              {activeSection === "cases" && sectionQuery.data?.section === "cases" ? (
                <CasesManager
                  items={sectionQuery.data.items}
                  categories={sectionQuery.data.categories ?? []}
                  categoriesConfigured={sectionQuery.data.categories !== null}
                  disabled={busy}
                  onCreateCategory={(name) => withRefresh(() => createCategory("cases", name))}
                  onRenameCategory={(id, name) => withRefresh(() => renameCategory(id, name))}
                  onDeleteCategory={(id) => withRefresh(() => deleteCategory(id))}
                  onCreate={(values) => withRefresh(() => createCaseItem(values))}
                  onUpdate={(id, values) => withRefresh(() => updateCaseItem(id, values))}
                  onStatus={(id, status) =>
                    withRefresh(() => updateStatus("case_items", id, status))
                  }
                  onArchive={(id) => withRefresh(() => archiveRecord("case_items", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("case_items", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("case_items", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("case_items", ids))}
                />
              ) : null}

              {activeSection === "services" && sectionQuery.data?.section === "services" ? (
                <ServicesManager
                  items={sectionQuery.data.items}
                  categories={sectionQuery.data.categories ?? []}
                  categoriesConfigured={sectionQuery.data.categories !== null}
                  disabled={busy}
                  onCreateCategory={(name) => withRefresh(() => createCategory("services", name))}
                  onRenameCategory={(id, name) => withRefresh(() => renameCategory(id, name))}
                  onDeleteCategory={(id) => withRefresh(() => deleteCategory(id))}
                  onCreate={(values) => withRefresh(() => createService(values))}
                  onUpdate={(id, values) => withRefresh(() => updateService(id, values))}
                  onStatus={(id, status) => withRefresh(() => updateStatus("services", id, status))}
                  onArchive={(id) => withRefresh(() => archiveRecord("services", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("services", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("services", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("services", ids))}
                />
              ) : null}

              {activeSection === "products" && sectionQuery.data?.section === "products" ? (
                <ProductsManager
                  items={sectionQuery.data.items}
                  categories={sectionQuery.data.categories ?? []}
                  categoriesConfigured={sectionQuery.data.categories !== null}
                  disabled={busy}
                  onCreateCategory={(name) => withRefresh(() => createCategory("products", name))}
                  onRenameCategory={(id, name) => withRefresh(() => renameCategory(id, name))}
                  onDeleteCategory={(id) => withRefresh(() => deleteCategory(id))}
                  onCreate={(values) => withRefresh(() => createProduct(values))}
                  onUpdate={(id, values) => withRefresh(() => updateProduct(id, values))}
                  onStatus={(id, status) => withRefresh(() => updateStatus("products", id, status))}
                  onArchive={(id) => withRefresh(() => archiveRecord("products", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("products", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("products", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("products", ids))}
                />
              ) : null}

              {activeSection === "faq" && sectionQuery.data?.section === "faq" ? (
                <FaqManager
                  items={sectionQuery.data.items}
                  disabled={busy}
                  onCreate={(values) => withRefresh(() => createFaq(values))}
                  onUpdate={(id, values) => withRefresh(() => updateFaq(id, values))}
                  onStatus={(id, status) =>
                    withRefresh(() => updateStatus("faq_items", id, status))
                  }
                  onArchive={(id) => withRefresh(() => archiveRecord("faq_items", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("faq_items", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("faq_items", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("faq_items", ids))}
                />
              ) : null}

              {activeSection === "about" && sectionQuery.data?.section === "about" ? (
                <AboutManager
                  value={sectionQuery.data.value}
                  disabled={busy}
                  onSave={(values) => withRefresh(() => saveAboutSettings(values))}
                />
              ) : null}

              {activeSection === "reviews" && sectionQuery.data?.section === "reviews" ? (
                <TestimonialsManager
                  items={sectionQuery.data.items}
                  disabled={busy}
                  onCreate={(values) => withRefresh(() => createTestimonial(values))}
                  onUpdate={(id, values) => withRefresh(() => updateTestimonial(id, values))}
                  onStatus={(id, status) =>
                    withRefresh(() => updateStatus("testimonials", id, status))
                  }
                  onArchive={(id) => withRefresh(() => archiveRecord("testimonials", id))}
                  onRestore={(id) => withRefresh(() => restoreRecord("testimonials", id))}
                  onBulkAction={(ids, action) =>
                    withRefresh(() => bulkContentAction("testimonials", ids, action))
                  }
                  onReorder={(ids) => withRefresh(() => reorderRecords("testimonials", ids))}
                />
              ) : null}

              {activeSection === "contact" && sectionQuery.data?.section === "contact" ? (
                <ContactManager
                  contact={sectionQuery.data.value}
                  onSaveAddress={(values) =>
                    withRefresh(() => saveContactAddress(values), "contact")
                  }
                  onSaveMethods={(values) =>
                    withRefresh(() => saveContactMethods(values), "contact")
                  }
                  onSaveHours={(values) => withRefresh(() => saveOpeningHours(values), "contact")}
                />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function Metric({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-[1.25rem] border border-line bg-white p-4 shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)]">
      <div className="type-label text-ink/52">{title}</div>
      <div className="type-card-title mt-2">{value}</div>
    </div>
  );
}

function Panel({
  icon,
  title,
  body,
  children,
}: {
  icon: ReactNode;
  title: string;
  body?: string;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0">
      <div className="rounded-[1.5rem] border border-line bg-white p-4 shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] sm:p-6">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
            {icon}
          </div>
          <h2 className="type-card-title">{title}</h2>
        </div>
        {body ? <p className="type-card-copy mt-3 text-ink/62">{body}</p> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AdminBlock({
  icon,
  title,
  body,
  info,
  editing = false,
  children,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  info?: string[];
  editing?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`min-w-0 rounded-[1.25rem] border p-4 transition-colors sm:p-5 ${
        editing ? "border-sky-200 bg-sky-50/80" : "border-line bg-white"
      }`}
    >
      <div className="mb-4 flex items-start gap-3">
        {icon ? (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="type-card-title text-ink">{title}</h3>
          {body ? <p className="type-card-copy mt-1 max-w-2xl text-ink/60">{body}</p> : null}
        </div>
        {info?.length ? (
          <div className="group/info relative ml-auto shrink-0">
            <button
              type="button"
              className="focus-ring grid h-9 w-9 place-items-center rounded-full text-ink/45 transition-colors hover:bg-sage hover:text-vet-green"
              aria-label={`Information about ${title}`}
            >
              <Info className="h-4 w-4" />
            </button>
            <div className="pointer-events-none invisible absolute right-0 top-11 z-30 w-64 translate-y-1 rounded-2xl border border-line bg-ink p-4 opacity-0 shadow-xl transition-all group-hover/info:visible group-hover/info:translate-y-0 group-hover/info:opacity-100 group-focus-within/info:visible group-focus-within/info:translate-y-0 group-focus-within/info:opacity-100">
              <ul className="grid gap-2 text-xs font-medium leading-relaxed text-white/80">
                {info.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lime" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  required = false,
  error,
}: {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="type-label text-ink/62">
        {label}
        {required ? <span className="ml-1 text-red-600">*</span> : null}
      </span>
      <div className="mt-2">{children}</div>
      {error ? (
        <span role="alert" className="mt-2 block text-sm font-semibold text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function categoryOptions(items: (string | null | undefined)[], fallback: string[] = []) {
  return Array.from(
    new Set([...fallback, ...items].map((item) => item?.trim()).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));
}

function categoryItemCounts(items: (string | null | undefined)[]) {
  return items.reduce<Record<string, number>>((counts, item) => {
    const key = item?.trim().toLowerCase();
    if (key) {
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  }, {});
}

function scrollToEditor(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const categoryInfo = [
  "Renaming a category updates its current items.",
  "A category can only be deleted when it is empty.",
];
const existingItemsInfo = [
  "Unpublish an item before editing it.",
  "Delete archives an item for seven days before permanent removal.",
  "Select multiple items to publish, unpublish, archive, or permanently delete them.",
];

type ValidatableField = HTMLInputElement | HTMLTextAreaElement;

function errorMessage(error: unknown, fallback = "Unable to save changes.") {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string" && message) return message;
  }
  return fallback;
}

function validationMessage(field: ValidatableField, label: string) {
  return field.validity.valueMissing
    ? `${label} is required.`
    : field.validity.typeMismatch
      ? `Enter a valid ${label.toLowerCase()}.`
      : field.validity.tooShort
        ? `${label} is too short.`
        : `Check the ${label.toLowerCase()}.`;
}

function validationProps(label: string, placeholder: string) {
  return {
    placeholder,
    onInvalid(event: InvalidEvent<ValidatableField>) {
      const field = event.currentTarget;
      field.dataset.invalid = "true";
      requestAnimationFrame(() => {
        field.placeholder = validationMessage(field, label);
      });
    },
    onInput(event: FormEvent<ValidatableField>) {
      const field = event.currentTarget;
      if (field.validity.valid) {
        delete field.dataset.invalid;
        field.placeholder = placeholder;
      } else if (field.dataset.invalid) {
        requestAnimationFrame(() => {
          field.placeholder = validationMessage(field, label);
        });
      }
    },
  };
}

function UploadHint() {
  return (
    <p className="mt-2 text-xs font-medium leading-relaxed text-ink/45">
      JPG or WebP recommended; PNG supported. Maximum 10 MB per image.
    </p>
  );
}

function ImageUploadField({
  files,
  onChange,
  multiple = false,
  required = false,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  required?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files],
  );

  useEffect(
    () => () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    },
    [previews],
  );

  useEffect(() => {
    if (!files.length && inputRef.current) inputRef.current.value = "";
  }, [files.length]);

  function selectImages(input: HTMLInputElement) {
    const selected = Array.from(input.files ?? []);
    const nextError = selected.map(validateAdminImage).find(Boolean) ?? "";
    setError(nextError);
    input.setCustomValidity(nextError);
    if (nextError) return;

    if (!multiple) {
      onChange(selected.slice(-1));
      return;
    }

    const existing = new Set(files.map((file) => `${file.name}:${file.size}:${file.lastModified}`));
    onChange([
      ...files,
      ...selected.filter((file) => !existing.has(`${file.name}:${file.size}:${file.lastModified}`)),
    ]);
  }

  return (
    <div>
      <label
        className={`focus-within:ring-vet-green/30 relative flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-6 text-center transition-colors focus-within:ring-2 hover:border-vet-green hover:bg-sage/35 ${
          error ? "border-red-500 bg-red-50/60" : "border-line bg-[#fafbf8]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          required={required && files.length === 0}
          onChange={(event) => selectImages(event.currentTarget)}
          onInvalid={() => setError("Select at least one image.")}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={multiple ? "Choose images" : "Choose image"}
        />
        <span className="grid h-10 w-10 place-items-center rounded-full bg-sage text-vet-green">
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="type-button mt-3 text-ink">
          {files.length
            ? multiple
              ? "Add more images"
              : "Replace image"
            : multiple
              ? "Choose images"
              : "Choose image"}
        </span>
        <span className="mt-1 text-xs font-medium text-ink/48">Click or tap to browse</span>
      </label>
      <UploadHint />
      {error ? (
        <p role="alert" className="mt-2 text-sm font-semibold text-red-600">
          {error}
        </p>
      ) : null}
      {previews.length ? (
        <ul className="mt-3 grid gap-2" aria-label="Selected images">
          {previews.map(({ file, url }, index) => (
            <li
              key={`${file.name}:${file.size}:${file.lastModified}`}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-line bg-white p-2"
            >
              <img
                src={url}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-lg object-cover"
              />
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink/72">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  onChange(files.filter((_, fileIndex) => fileIndex !== index));
                  setError("");
                }}
                className="focus-ring grid h-10 w-10 shrink-0 cursor-pointer place-items-center rounded-full text-red-600 transition-colors hover:bg-red-50"
                aria-label={`Remove ${file.name}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CategoryPicker({
  categories,
  configured,
  itemCounts,
  disabled,
  onCreate,
  onRename,
  onDelete,
  onEditingChange,
}: {
  categories: CategoryRow[];
  configured: boolean;
  itemCounts: Record<string, number>;
  disabled?: boolean;
  onCreate: (name: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEditingChange?: (editing: boolean) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState("");
  const [editingName, setEditingName] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmRequest | null>(null);

  async function addCategory() {
    const next = newCategory.trim();
    if (!next) {
      return;
    }

    await onCreate(next);
    setNewCategory("");
  }

  async function saveCategory() {
    const next = editingName.trim();
    if (!editingId || !next) {
      return;
    }

    await onRename(editingId, next);
    setEditingId("");
    setEditingName("");
    onEditingChange?.(false);
  }

  function cancelEditing() {
    setEditingId("");
    setEditingName("");
    onEditingChange?.(false);
  }

  if (!configured) {
    return (
      <AdminBlock
        icon={<Tags className="h-4 w-4" />}
        title="Categories"
        body="Available categories"
        info={categoryInfo}
      >
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold leading-relaxed text-amber-800">
          Category management needs the latest Supabase migration. Other dashboard sections remain
          available.
        </div>
      </AdminBlock>
    );
  }

  return (
    <>
      <AdminBlock
        icon={<Tags className="h-4 w-4" />}
        title="Categories"
        body="Available categories"
        info={categoryInfo}
      >
        <div className="grid min-w-0 gap-5">
          {categories.length ? (
            <details className="group/categories min-w-0">
              <summary className="focus-ring flex min-h-12 cursor-pointer list-none items-center justify-between rounded-2xl border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors marker:hidden hover:border-vet-green hover:bg-sage/35">
                <span className="flex items-center gap-3">
                  <span className="group-open/categories:hidden">Show categories</span>
                  <span className="hidden group-open/categories:inline">Hide categories</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs text-ink/48 shadow-sm">
                    {categories.length}
                  </span>
                </span>
                <ChevronDown className="h-4 w-4 text-ink/45 transition-transform group-open/categories:rotate-180" />
              </summary>
              <div className="grid min-w-0 gap-2 pt-3 sm:grid-cols-2 xl:grid-cols-3">
                {categories.map((category) => {
                  const count = itemCounts[category.name.toLowerCase()] ?? 0;
                  const editing = editingId === category.id;

                  return (
                    <div
                      key={category.id}
                      inert={Boolean(editingId && !editing)}
                      className={`grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-2xl border p-3 transition-opacity ${
                        editing ? "border-sky-200 bg-sky-50" : "border-line bg-white shadow-sm"
                      } ${editingId && !editing ? "pointer-events-none opacity-35" : ""}`}
                    >
                      <div className="min-w-0 flex-1">
                        {editing ? (
                          <input
                            value={editingName}
                            onChange={(event) => setEditingName(event.target.value)}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                void saveCategory();
                              }
                            }}
                            className={`${inputClass} min-h-9 rounded-xl px-3 py-1.5`}
                            {...validationProps("Category name", "Category name")}
                            minLength={2}
                            maxLength={80}
                            required
                            autoFocus
                          />
                        ) : (
                          <p className="type-button truncate text-ink">{category.name}</p>
                        )}
                        <p className="mt-1 text-xs font-semibold text-ink/48">
                          {count} {count === 1 ? "item" : "items"}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 self-start">
                        {editing ? (
                          <>
                            <button
                              type="button"
                              onClick={() => void saveCategory()}
                              disabled={disabled || editingName.trim().length < 2}
                              className="focus-ring grid h-9 w-9 place-items-center rounded-full text-vet-green transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Save ${category.name} category`}
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                cancelEditing();
                              }}
                              className="focus-ring grid h-9 w-9 place-items-center rounded-full text-ink/52 transition-colors hover:bg-white hover:text-ink"
                              aria-label="Cancel category edit"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(category.id);
                              setEditingName(category.name);
                              onEditingChange?.(true);
                            }}
                            disabled={disabled}
                            className="focus-ring grid h-9 w-9 place-items-center rounded-full text-ink/58 transition-colors hover:bg-white hover:text-vet-green disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={`Rename ${category.name} category`}
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                        )}
                        {!editing ? (
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmation({
                                title: "Delete category?",
                                message: `Delete the empty “${category.name}” category? This cannot be undone.`,
                                confirmLabel: "Delete category",
                                action: () => onDelete(category.id),
                              });
                            }}
                            disabled={disabled || count > 0}
                            title={count > 0 ? "Move or delete its items first" : "Delete category"}
                            className="focus-ring grid h-9 w-9 place-items-center rounded-full text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={`Delete ${category.name} category`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </details>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-sage/40 p-4 text-sm font-semibold text-ink/52">
              No categories yet.
            </div>
          )}

          <div
            inert={Boolean(editingId)}
            className={`grid min-w-0 gap-3 transition-opacity sm:max-w-xl sm:grid-cols-[minmax(0,1fr)_auto] ${
              editingId ? "pointer-events-none opacity-35" : ""
            }`}
          >
            <input
              value={newCategory}
              onChange={(event) => setNewCategory(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void addCategory();
                }
              }}
              {...validationProps("Category name", "e.g. Preventive care")}
              className={inputClass}
              minLength={2}
              maxLength={80}
            />
            <button
              type="button"
              onClick={() => void addCategory()}
              disabled={disabled || newCategory.trim().length < 2}
              className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-vet-green px-5 text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>
        </div>
      </AdminBlock>
      <ConfirmDialog request={confirmation} onClose={() => setConfirmation(null)} />
    </>
  );
}

const inputClass =
  "focus-ring min-h-11 w-full min-w-0 rounded-2xl border border-line bg-white px-4 py-2.5 text-base leading-normal text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-vet-green data-[invalid=true]:border-red-500 data-[invalid=true]:placeholder:text-red-600 data-[invalid=true]:focus:border-red-500 data-[invalid=true]:focus:ring-2 data-[invalid=true]:focus:ring-red-200";
const textareaClass =
  "focus-ring min-h-28 w-full min-w-0 rounded-2xl border border-line bg-white px-4 py-3 text-base leading-relaxed text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-vet-green data-[invalid=true]:border-red-500 data-[invalid=true]:placeholder:text-red-600 data-[invalid=true]:focus:border-red-500 data-[invalid=true]:focus:ring-2 data-[invalid=true]:focus:ring-red-200";
const editorLockedClass = "pointer-events-none select-none opacity-35 transition-opacity";

function AdminSelect({
  value,
  onChange,
  options,
  compact = false,
  label = "Select an option",
}: {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  compact?: boolean;
  label?: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const selected = options.find((option) => option.value === value)?.label ?? label;

  useEffect(() => {
    function close(event: PointerEvent) {
      if (detailsRef.current && !detailsRef.current.contains(event.target as Node)) {
        detailsRef.current.removeAttribute("open");
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);

  return (
    <details
      ref={detailsRef}
      onToggle={(event) => {
        const isOpen = event.currentTarget.open;
        setOpen(isOpen);

        if (isOpen && summaryRef.current) {
          const bounds = summaryRef.current.getBoundingClientRect();
          const panelHeight = Math.min(256, options.length * 40 + 16);
          const spaceBelow = window.innerHeight - bounds.bottom;
          setOpenUpwards(spaceBelow < panelHeight + 12 && bounds.top > spaceBelow);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.removeAttribute("open");
          setOpen(false);
        }
      }}
      className="relative min-w-0"
    >
      <summary
        ref={summaryRef}
        className={`focus-ring flex cursor-pointer list-none items-center justify-between gap-3 border bg-white font-semibold text-ink transition-colors marker:hidden hover:border-vet-green ${
          compact ? "min-h-10 rounded-xl px-3 text-sm" : "min-h-11 rounded-2xl px-4 text-base"
        } ${open ? "border-vet-green bg-sage/45 text-vet-green" : "border-line"}`}
      >
        <span className="truncate">{selected}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </summary>
      <div
        className={`absolute left-0 z-40 max-h-64 w-full min-w-48 overflow-y-auto rounded-2xl border border-line bg-white p-2 shadow-xl ${
          openUpwards ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
        }`}
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                detailsRef.current?.removeAttribute("open");
                setOpen(false);
              }}
              className={`focus-ring flex min-h-10 w-full items-center justify-between gap-3 rounded-xl px-3 text-left text-sm font-semibold transition-colors ${
                active ? "bg-vet-green text-white" : "text-ink/68 hover:bg-sage/55 hover:text-ink"
              }`}
            >
              <span className="truncate">{option.label}</span>
              {active ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : null}
            </button>
          );
        })}
      </div>
    </details>
  );
}

function CategorySelect({
  value,
  onChange,
  categories,
  optional = false,
}: {
  value: string;
  onChange: (value: string) => void;
  categories: string[];
  optional?: boolean;
}) {
  const options = value && !categories.includes(value) ? [value, ...categories] : categories;

  return (
    <AdminSelect
      value={value}
      onChange={onChange}
      label={optional ? "No category" : "Select category"}
      options={[
        ...(optional ? [{ value: "", label: "No category" }] : []),
        ...options.map((category) => ({ value: category, label: category })),
      ]}
    />
  );
}

function StatusSelect({
  value,
  onChange,
}: {
  value: CmsStatus;
  onChange: (value: CmsStatus) => void;
}) {
  return (
    <AdminSelect
      value={value}
      onChange={(nextValue) => onChange(nextValue as CmsStatus)}
      options={[
        { value: "published", label: "Published" },
        { value: "draft", label: "Draft" },
      ]}
    />
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  title,
  variant = "neutral",
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  variant?: "neutral" | "primary" | "danger";
}) {
  const className =
    variant === "primary"
      ? "border-vet-green bg-vet-green text-white hover:border-ink hover:bg-ink"
      : variant === "danger"
        ? "border-red-200 bg-red-50 text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white"
        : "border-line bg-white text-ink hover:border-vet-green hover:text-vet-green";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`focus-ring type-button inline-flex min-h-10 items-center justify-center rounded-full border px-4 transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
    >
      {children}
    </button>
  );
}

type ConfirmRequest = {
  title: string;
  message: string;
  confirmLabel: string;
  action: () => void | Promise<void>;
};

function ConfirmDialog({
  request,
  onClose,
}: {
  request: ConfirmRequest | null;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!request) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) onClose();
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, request, submitting]);

  if (!request) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      aria-describedby="confirm-message"
      className="fixed inset-0 z-[130] flex items-end justify-center bg-ink/60 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) onClose();
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-2xl">
        <div className="flex items-start gap-4 p-5 sm:p-6">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 id="confirm-title" className="type-card-title text-ink">
              {request.title}
            </h3>
            <p
              id="confirm-message"
              className="mt-2 text-sm font-medium leading-relaxed text-ink/60"
            >
              {request.message}
            </p>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-line bg-[#f7f8f4] p-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="focus-ring type-button min-h-11 cursor-pointer rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-ink disabled:cursor-not-allowed disabled:opacity-45"
          >
            Cancel
          </button>
          <button
            type="button"
            autoFocus
            disabled={submitting}
            onClick={async () => {
              setSubmitting(true);
              try {
                await request.action();
                onClose();
              } finally {
                setSubmitting(false);
              }
            }}
            className="focus-ring type-button inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
            {submitting ? "Working..." : request.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function RecordActions({
  id,
  status,
  archived,
  disabled,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onEdit,
  archivedAt,
  onConfirm,
}: {
  id: string;
  status: CmsStatus;
  archived: boolean;
  disabled?: boolean;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onEdit: (id: string) => void;
  archivedAt: string | null;
  onConfirm: (request: ConfirmRequest) => void;
}) {
  if (archived) {
    const deleteAt = archivedAt ? new Date(archivedAt).getTime() + 7 * 24 * 60 * 60 * 1000 : 0;
    const daysLeft = deleteAt ? Math.max(0, Math.ceil((deleteAt - Date.now()) / 86400000)) : 7;
    return (
      <div className="mt-4 sm:mt-0">
        <div className="flex flex-wrap gap-2">
          <ActionButton disabled={disabled} onClick={() => onRestore(id)} variant="primary">
            <RotateCcw className="mr-2 h-4 w-4" />
            Restore
          </ActionButton>
          <ActionButton
            disabled={disabled}
            variant="danger"
            onClick={() => {
              onConfirm({
                title: "Permanently delete item?",
                message:
                  "This removes the item and its uploaded files. This action cannot be undone.",
                confirmLabel: "Delete permanently",
                action: () => onBulkAction([id], "permanent_delete"),
              });
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete permanently
          </ActionButton>
        </div>
        <p className="mt-2 text-xs font-semibold text-ink/42">
          Automatic deletion in {daysLeft} {daysLeft === 1 ? "day" : "days"}.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 sm:mt-0">
      {status === "published" ? (
        <ActionButton disabled={disabled} onClick={() => onStatus(id, "draft")}>
          Unpublish
        </ActionButton>
      ) : (
        <ActionButton
          disabled={disabled}
          onClick={() => onStatus(id, "published")}
          variant="primary"
        >
          Publish
        </ActionButton>
      )}
      <ActionButton
        disabled={disabled || status === "published"}
        title={status === "published" ? "Unpublish this item before editing" : "Edit item"}
        onClick={() => onEdit(id)}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Edit
      </ActionButton>
      <ActionButton
        disabled={disabled}
        variant="danger"
        onClick={() => {
          onConfirm({
            title: "Archive item?",
            message: "This removes the item from the website. You can restore it from Archived.",
            confirmLabel: "Archive item",
            action: () => onArchive(id),
          });
        }}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </ActionButton>
    </div>
  );
}

type ContactPanel = "address" | "methods" | "hours";
type ContactNotice = { panel: ContactPanel; type: "success" | "error"; message: string } | null;
type ContactErrors = Record<string, string>;

function ContactManager({
  contact,
  onSaveAddress,
  onSaveMethods,
  onSaveHours,
}: {
  contact: AdminContactSettings;
  onSaveAddress: (values: AdminContactSettings["address"]) => Promise<void>;
  onSaveMethods: (
    values: Pick<AdminContactSettings, "phones" | "whatsapp" | "email">,
  ) => Promise<void>;
  onSaveHours: (values: AdminOpeningHour[]) => Promise<void>;
}) {
  const [address, setAddress] = useState(contact.address);
  const [phones, setPhones] = useState(contact.phones);
  const [whatsapp, setWhatsapp] = useState(contact.whatsapp);
  const [email, setEmail] = useState(contact.email);
  const [hours, setHours] = useState(contact.openingHours);
  const [saving, setSaving] = useState<ContactPanel | null>(null);
  const [notice, setNotice] = useState<ContactNotice>(null);
  const [errors, setErrors] = useState<ContactErrors>({});

  useEffect(() => {
    if (saving) return;
    setAddress(contact.address);
    setPhones(contact.phones);
    setWhatsapp(contact.whatsapp);
    setEmail(contact.email);
    setHours(contact.openingHours);
  }, [contact, saving]);

  async function submit(panel: ContactPanel, action: () => Promise<void>) {
    setSaving(panel);
    setNotice(null);
    try {
      await action();
      setNotice({ panel, type: "success", message: "Changes saved." });
    } catch (currentError) {
      setNotice({
        panel,
        type: "error",
        message: errorMessage(currentError),
      });
    } finally {
      setSaving(null);
    }
  }

  function clearError(key: string, panel: ContactPanel) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setNotice((current) => (current?.panel === panel && current.type === "error" ? null : current));
  }

  function invalid(key: string) {
    return {
      "aria-invalid": Boolean(errors[key]) as true | false,
      "data-invalid": errors[key] ? "true" : undefined,
    };
  }

  function contactNotice(panel: ContactPanel) {
    if (notice?.panel !== panel) return null;
    return (
      <p
        role={notice.type === "error" ? "alert" : "status"}
        className={`rounded-xl border px-4 py-3 text-sm font-semibold ${
          notice.type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-vet-green/20 bg-sage/45 text-vet-green"
        }`}
      >
        {notice.message}
      </p>
    );
  }

  return (
    <Panel icon={<Phone className="h-5 w-5" />} title="Contact">
      <div className="grid gap-5">
        <AdminBlock
          icon={<MapPin className="h-4 w-4" />}
          title="Address & Google Maps"
          info={[
            "The address is required because the clinic receives visitors.",
            "The map preview is generated from the saved address.",
          ]}
        >
          <form
            noValidate
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const result = contactAddressSchema.safeParse(address);
              if (!result.success) {
                const nextErrors = Object.fromEntries(
                  result.error.issues.map((issue) => [String(issue.path[0]), issue.message]),
                );
                setErrors(nextErrors);
                setNotice({
                  panel: "address",
                  type: "error",
                  message: result.error.issues[0]?.message ?? "Check the highlighted fields.",
                });
                return;
              }
              setErrors({});
              void submit("address", () =>
                onSaveAddress({ ...address, ...result.data, region: address.region }),
              );
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Street address" required error={errors.street}>
                <input
                  className={inputClass}
                  value={address.street}
                  onChange={(event) => {
                    setAddress({ ...address, street: event.target.value });
                    clearError("street", "address");
                  }}
                  {...invalid("street")}
                  minLength={2}
                  maxLength={160}
                  required
                  {...validationProps("Street address", "Katinas Paxinou 66, Agios Athanasios")}
                />
              </Field>
              <Field label="City" required error={errors.city}>
                <input
                  className={inputClass}
                  value={address.city}
                  onChange={(event) => {
                    setAddress({ ...address, city: event.target.value });
                    clearError("city", "address");
                  }}
                  {...invalid("city")}
                  minLength={2}
                  maxLength={80}
                  required
                  {...validationProps("City", "Limassol")}
                />
              </Field>
              <Field label="Postal code" required error={errors.postalCode}>
                <input
                  className={inputClass}
                  value={address.postalCode}
                  onChange={(event) => {
                    setAddress({ ...address, postalCode: event.target.value });
                    clearError("postalCode", "address");
                  }}
                  {...invalid("postalCode")}
                  minLength={2}
                  maxLength={20}
                  required
                  {...validationProps("Postal code", "4105")}
                />
              </Field>
              <Field label="Country" required error={errors.country}>
                <input
                  className={inputClass}
                  value={address.country}
                  onChange={(event) => {
                    setAddress({ ...address, country: event.target.value });
                    clearError("country", "address");
                  }}
                  {...invalid("country")}
                  minLength={2}
                  maxLength={80}
                  required
                  {...validationProps("Country", "Cyprus")}
                />
              </Field>
              <Field label="Google Maps link" error={errors.mapUrl}>
                <input
                  type="url"
                  className={inputClass}
                  value={address.mapUrl}
                  onChange={(event) => {
                    setAddress({ ...address, mapUrl: event.target.value });
                    clearError("mapUrl", "address");
                  }}
                  {...invalid("mapUrl")}
                  maxLength={1000}
                  {...validationProps("Google Maps link", "https://maps.app.goo.gl/...")}
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton
                disabled={saving === "address"}
                icon={
                  saving === "address" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {saving === "address" ? "Saving..." : "Save address"}
              </SubmitButton>
              {contactNotice("address")}
            </div>
          </form>
        </AdminBlock>

        <AdminBlock
          icon={<MessageCircle className="h-4 w-4" />}
          title="Phone, WhatsApp & Email"
          info={[
            "The first phone number is used by Call Now buttons.",
            "Add at least one phone number, WhatsApp number, or email.",
            "Use international format, for example +35795952663.",
          ]}
        >
          <form
            noValidate
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const result = contactMethodsSchema.safeParse({
                phones: phones.map((phone) => ({
                  ...phone,
                  label: phone.label.trim(),
                  number: normalizeInternationalPhone(phone.number),
                })),
                whatsapp: normalizeInternationalPhone(whatsapp),
                email: email.trim(),
              });
              if (!result.success) {
                const nextErrors = Object.fromEntries(
                  result.error.issues
                    .filter((issue) => issue.path.length)
                    .map((issue) => [issue.path.join("."), issue.message]),
                );
                setErrors(nextErrors);
                setNotice({
                  panel: "methods",
                  type: "error",
                  message: result.error.issues[0]?.message ?? "Check the highlighted fields.",
                });
                return;
              }
              setErrors({});
              setPhones(result.data.phones);
              setWhatsapp(result.data.whatsapp);
              setEmail(result.data.email);
              void submit("methods", () => onSaveMethods(result.data));
            }}
          >
            <div className="grid gap-3">
              {phones.map((phone, index) => {
                const labelError = errors[`phones.${index}.label`];
                const numberError = errors[`phones.${index}.number`];
                return (
                  <div
                    key={phone.id ?? index}
                    className={`grid gap-3 rounded-2xl border p-3 transition-colors sm:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_auto] sm:items-end ${
                      labelError || numberError
                        ? "border-red-300 bg-red-50/60"
                        : "border-line bg-[#fafbf8]"
                    }`}
                  >
                    <Field label="Phone label" required error={labelError}>
                      <input
                        className={inputClass}
                        value={phone.label}
                        onChange={(event) => {
                          setPhones((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index ? { ...item, label: event.target.value } : item,
                            ),
                          );
                          clearError(`phones.${index}.label`, "methods");
                        }}
                        {...invalid(`phones.${index}.label`)}
                        minLength={2}
                        maxLength={40}
                        required
                        {...validationProps(
                          "Phone label",
                          index === 0 ? "Clinic Phone" : "Vet Phone",
                        )}
                      />
                    </Field>
                    <Field label="Phone number" required error={numberError}>
                      <input
                        type="tel"
                        inputMode="tel"
                        className={inputClass}
                        value={phone.number}
                        onChange={(event) => {
                          setPhones((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? {
                                    ...item,
                                    number: normalizeInternationalPhone(event.target.value),
                                  }
                                : item,
                            ),
                          );
                          clearError(`phones.${index}.number`, "methods");
                        }}
                        {...invalid(`phones.${index}.number`)}
                        pattern="\+[1-9][0-9]{7,14}"
                        minLength={8}
                        maxLength={24}
                        required
                        {...validationProps("Phone number", "+357 25 101352")}
                      />
                    </Field>
                    <div className="flex min-h-11 items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setPhones((current) => {
                            if (index === 0) return current;
                            const next = [...current];
                            [next[index - 1], next[index]] = [next[index], next[index - 1]];
                            return next;
                          })
                        }
                        disabled={index === 0 || saving === "methods"}
                        className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-full text-ink/55 transition-colors hover:bg-white hover:text-vet-green disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move phone up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPhones((current) => {
                            if (index === current.length - 1) return current;
                            const next = [...current];
                            [next[index], next[index + 1]] = [next[index + 1], next[index]];
                            return next;
                          })
                        }
                        disabled={index === phones.length - 1 || saving === "methods"}
                        className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-full text-ink/55 transition-colors hover:bg-white hover:text-vet-green disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Move phone down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPhones((current) => current.filter((_, i) => i !== index))
                        }
                        disabled={saving === "methods"}
                        className="focus-ring grid h-10 w-10 cursor-pointer place-items-center rounded-full text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="Remove phone"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
              {phones.length < 3 ? (
                <button
                  type="button"
                  onClick={() =>
                    setPhones((current) => [
                      ...current,
                      { id: crypto.randomUUID(), label: "", number: "" },
                    ])
                  }
                  className="focus-ring type-button inline-flex min-h-11 w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-5 text-ink transition-colors hover:border-vet-green hover:bg-sage"
                >
                  <Plus className="h-4 w-4" />
                  Add phone
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="WhatsApp number" error={errors.whatsapp}>
                <input
                  type="tel"
                  inputMode="tel"
                  className={inputClass}
                  value={whatsapp}
                  onChange={(event) => {
                    setWhatsapp(normalizeInternationalPhone(event.target.value));
                    clearError("whatsapp", "methods");
                  }}
                  {...invalid("whatsapp")}
                  pattern="\+[1-9][0-9]{7,14}"
                  maxLength={24}
                  {...validationProps("WhatsApp number", "+357 95 952663")}
                />
              </Field>
              <Field label="Email address" error={errors.email}>
                <input
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError("email", "methods");
                  }}
                  {...invalid("email")}
                  maxLength={254}
                  {...validationProps("Email address", "clinic@example.com")}
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton
                disabled={saving === "methods"}
                icon={
                  saving === "methods" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {saving === "methods" ? "Saving..." : "Save contact methods"}
              </SubmitButton>
              {contactNotice("methods")}
            </div>
          </form>
        </AdminBlock>

        <AdminBlock
          icon={<Clock className="h-4 w-4" />}
          title="Weekly opening hours"
          info={[
            "Mark closed days instead of entering times.",
            "Use the second period only for split opening hours.",
          ]}
        >
          <form
            aria-label="Weekly opening hours"
            noValidate
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const result = openingHoursSchema.safeParse(hours);
              if (!result.success) {
                const nextErrors: ContactErrors = {};
                result.error.issues.forEach((issue) => {
                  const dayIndex = issue.path[0];
                  nextErrors[typeof dayIndex === "number" ? `hours.${dayIndex}` : "hours"] =
                    issue.message;
                });
                setErrors(nextErrors);
                setNotice({
                  panel: "hours",
                  type: "error",
                  message: result.error.issues[0]?.message ?? "Check the highlighted days.",
                });
                return;
              }
              setErrors({});
              setHours(result.data);
              void submit("hours", () => onSaveHours(result.data));
            }}
          >
            <div className="flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={!hours.some((day) => day.opens1 || day.closes1)}
                onClick={() => {
                  setHours((current) =>
                    current.map((day) => ({ ...day, opens1: "", closes1: "" })),
                  );
                  setErrors({});
                  setNotice((current) => (current?.panel === "hours" ? null : current));
                }}
                className="focus-ring type-button inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 text-ink transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear all first periods
              </button>
              <button
                type="button"
                disabled={!hours.some((day) => day.opens2 || day.closes2)}
                onClick={() => {
                  setHours((current) =>
                    current.map((day) => ({ ...day, opens2: "", closes2: "" })),
                  );
                  setErrors({});
                  setNotice((current) => (current?.panel === "hours" ? null : current));
                }}
                className="focus-ring type-button inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 text-ink transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <X className="h-4 w-4" aria-hidden="true" />
                Clear all second periods
              </button>
              <button
                type="button"
                disabled={
                  !hours.some((day) => day.opens1 || day.closes1 || day.opens2 || day.closes2)
                }
                onClick={() => {
                  setHours((current) =>
                    current.map((day) => ({
                      ...day,
                      opens1: "",
                      closes1: "",
                      opens2: "",
                      closes2: "",
                    })),
                  );
                  setErrors({});
                  setNotice((current) => (current?.panel === "hours" ? null : current));
                }}
                className="focus-ring focus-ring-dark type-button inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-red-600 bg-red-600 px-4 text-white transition-colors hover:border-ink hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
                Clear all
              </button>
            </div>
            <div className="grid gap-3">
              {hours.map((day, index) => {
                const dayError = errors[`hours.${index}`];
                return (
                  <div
                    key={day.dayIndex}
                    className={`grid gap-3 rounded-2xl border p-4 transition-colors lg:grid-cols-[9rem_auto_minmax(0,1fr)_minmax(0,1fr)] lg:items-center ${
                      dayError ? "border-red-300 bg-red-50/60" : "border-line bg-[#fafbf8]"
                    }`}
                  >
                    <div className="type-button text-ink">{day.dayName}</div>
                    <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-semibold text-ink/65">
                      <input
                        type="checkbox"
                        checked={day.isClosed}
                        onChange={(event) => {
                          setHours((current) =>
                            current.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, isClosed: event.target.checked }
                                : item,
                            ),
                          );
                          clearError(`hours.${index}`, "hours");
                          clearError("hours", "hours");
                        }}
                        className="h-4 w-4 accent-vet-green"
                      />
                      Closed
                    </label>
                    {day.isClosed ? (
                      <span className="type-card-copy text-ink/45 lg:col-span-2">
                        Closed all day
                      </span>
                    ) : (
                      <>
                        <TimeRange
                          label="First period"
                          opens={day.opens1}
                          closes={day.closes1}
                          required
                          onChange={(key, value) => {
                            setHours((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, [key]: value } : item,
                              ),
                            );
                            clearError(`hours.${index}`, "hours");
                          }}
                        />
                        <TimeRange
                          label="Second period (optional)"
                          opens={day.opens2}
                          closes={day.closes2}
                          onChange={(key, value) => {
                            setHours((current) =>
                              current.map((item, itemIndex) =>
                                itemIndex === index ? { ...item, [key]: value } : item,
                              ),
                            );
                            clearError(`hours.${index}`, "hours");
                          }}
                        />
                      </>
                    )}
                    {dayError ? (
                      <p role="alert" className="text-sm font-semibold text-red-600 lg:col-span-4">
                        {dayError}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {errors.hours ? (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {errors.hours}
              </p>
            ) : null}
            <div className="flex flex-wrap items-center gap-3">
              <SubmitButton
                disabled={saving === "hours"}
                icon={
                  saving === "hours" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )
                }
              >
                {saving === "hours" ? "Saving..." : "Save opening hours"}
              </SubmitButton>
              {contactNotice("hours")}
            </div>
          </form>
        </AdminBlock>
      </div>
    </Panel>
  );
}

function TimeRange({
  label,
  opens,
  closes,
  required,
  onChange,
}: {
  label: string;
  opens: string;
  closes: string;
  required?: boolean;
  onChange: (key: "opens1" | "closes1" | "opens2" | "closes2", value: string) => void;
}) {
  const second = label.startsWith("Second");
  const opensKey = second ? "opens2" : "opens1";
  const closesKey = second ? "closes2" : "closes1";

  return (
    <fieldset className="min-w-0">
      <div className="mb-2 flex min-h-6 items-center justify-between gap-2">
        <legend className="type-label text-ink/52">{label}</legend>
        {opens || closes ? (
          <button
            type="button"
            onClick={() => {
              onChange(second ? "opens2" : "opens1", "");
              onChange(second ? "closes2" : "closes1", "");
            }}
            className="focus-ring inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        ) : null}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2">
        <TimePicker
          label={required ? "Opens" : "Opens (optional)"}
          value={opens}
          onChange={(value) => onChange(opensKey, value)}
        />
        <span className="pb-3 text-ink/35">to</span>
        <TimePicker
          label={required ? "Closes" : "Closes (optional)"}
          value={closes}
          onChange={(value) => onChange(closesKey, value)}
        />
      </div>
    </fieldset>
  );
}

const hourOptions = Array.from({ length: 24 }, (_, value) => String(value).padStart(2, "0"));
const minuteOptions = Array.from({ length: 60 }, (_, value) => String(value).padStart(2, "0"));

function normalizeTypedTime(value: string) {
  const raw = value.trim();
  if (!raw) return "";

  let hour = "";
  let minute = "";
  if (raw.includes(":")) {
    [hour = "", minute = ""] = raw.split(":", 2);
  } else {
    const digits = raw.replace(/\D/g, "");
    if (digits.length <= 2) {
      hour = digits;
      minute = "00";
    } else {
      hour = digits.slice(0, -2);
      minute = digits.slice(-2);
    }
  }

  const hourNumber = Number(hour);
  const minuteNumber = Number(minute);
  if (
    !hour ||
    !minute ||
    !Number.isInteger(hourNumber) ||
    hourNumber < 0 ||
    hourNumber > 23 ||
    !Number.isInteger(minuteNumber) ||
    minuteNumber < 0 ||
    minuteNumber > 59
  ) {
    return null;
  }

  return `${String(hourNumber).padStart(2, "0")}:${String(minuteNumber).padStart(2, "0")}`;
}

function TimePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  const normalizedDraft = normalizeTypedTime(draft);
  const [selectedHour = "", selectedMinute = ""] = (normalizedDraft ?? value).split(":");

  function showPicker() {
    if (rootRef.current) {
      const bounds = rootRef.current.getBoundingClientRect();
      setOpenUpwards(window.innerHeight - bounds.bottom < 300 && bounds.top > 300);
    }
    setOpen(true);
  }

  function commit(next: string) {
    setDraft(next);
    onChange(next);
  }

  function finishTyping() {
    const normalized = normalizeTypedTime(draft);
    if (normalized !== null) commit(normalized);
  }

  useEffect(() => {
    if (!open) return;

    function close(event: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        finishTyping();
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  });

  return (
    <div ref={rootRef} className="relative min-w-0">
      <p className="mb-1.5 text-xs font-semibold text-ink/48">{label}</p>
      <div className="relative">
        <input
          type="text"
          inputMode="numeric"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-time-options`}
          aria-label={label}
          value={draft}
          onFocus={showPicker}
          onBlur={(event) => {
            if (!rootRef.current?.contains(event.relatedTarget as Node)) {
              finishTyping();
              setOpen(false);
            }
          }}
          onChange={(event) => {
            const next = event.target.value.replace(/[^\d:]/g, "").slice(0, 5);
            setDraft(next);
            onChange(next);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") showPicker();
            if (event.key === "Enter") {
              event.preventDefault();
              finishTyping();
              setOpen(false);
            }
            if (event.key === "Escape") {
              setDraft(value);
              setOpen(false);
            }
          }}
          placeholder="HH:MM"
          maxLength={5}
          className={`${inputClass} min-h-10 rounded-xl py-2 pl-3 pr-10 text-sm`}
        />
        <button
          type="button"
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => {
            if (open) {
              finishTyping();
              setOpen(false);
            } else {
              showPicker();
            }
          }}
          className="focus-ring absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink/45 transition-colors hover:bg-sage hover:text-vet-green"
          aria-label={`${open ? "Close" : "Open"} ${label.toLowerCase()} time picker`}
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      {open ? (
        <div
          id={`${id}-time-options`}
          className={`absolute left-0 z-50 w-[min(16rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white p-2 shadow-xl ${
            openUpwards ? "bottom-[calc(100%+0.5rem)]" : "top-[calc(100%+0.5rem)]"
          }`}
        >
          <div className="grid grid-cols-2 gap-2">
            <div className="min-w-0">
              <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase text-ink/40">Hour</p>
              <div className="grid max-h-48 gap-1 overflow-y-auto pr-1">
                {hourOptions.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => commit(`${hour}:${selectedMinute || "00"}`)}
                    className={`focus-ring min-h-9 cursor-pointer rounded-xl text-sm font-semibold transition-colors ${
                      selectedHour === hour
                        ? "bg-vet-green text-white"
                        : "text-ink/65 hover:bg-sage hover:text-ink"
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>
            <div className="min-w-0 border-l border-line pl-2">
              <p className="px-2 pb-2 pt-1 text-xs font-bold uppercase text-ink/40">Minute</p>
              <div className="grid max-h-48 gap-1 overflow-y-auto pr-1">
                {minuteOptions.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      commit(`${selectedHour || "00"}:${minute}`);
                      setOpen(false);
                    }}
                    className={`focus-ring min-h-9 cursor-pointer rounded-xl text-sm font-semibold transition-colors ${
                      selectedMinute === minute
                        ? "bg-vet-green text-white"
                        : "text-ink/65 hover:bg-sage hover:text-ink"
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FaqManager({
  items,
  disabled,
  onCreate,
  onUpdate,
  ...actions
}: {
  items: FaqRow[];
  disabled?: boolean;
  onCreate: (values: Pick<FaqRow, "question" | "answer" | "status">) => Promise<void>;
  onUpdate: (id: string, values: Pick<FaqRow, "question" | "answer" | "status">) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [status, setStatus] = useState<CmsStatus>("published");
  const activeCount = items.filter((item) => !item.archived_at).length;
  const limitReached = !editingId && activeCount >= MAX_FAQS;
  const reset = () => {
    setEditingId("");
    setQuestion("");
    setAnswer("");
    setStatus("published");
  };
  const edit = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || item.status === "published") return;
    setEditingId(id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setStatus(item.status);
    scrollToEditor("faq-editor");
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = faqFormSchema.parse({ question, answer, status });
    await (editingId ? onUpdate(editingId, values) : onCreate(values));
    reset();
  };

  return (
    <Panel
      icon={<HelpCircle className="h-5 w-5" />}
      title="FAQ"
      body={`Add up to ${MAX_FAQS} FAQs to keep the website clear and fast. ${activeCount}/${MAX_FAQS} used.`}
    >
      <div className="space-y-5">
        <AdminBlock
          icon={editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          title={editingId ? `Editing FAQ “${question}”` : "Add FAQ"}
          body={!editingId ? "Fields marked * are required." : undefined}
          editing={Boolean(editingId)}
        >
          <form id="faq-editor" onSubmit={submit} className="grid gap-4">
            <Field label="Question" required>
              <input
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                {...validationProps("Question", "e.g. What should I bring to my appointment?")}
                className={inputClass}
                minLength={5}
                maxLength={180}
                required
              />
            </Field>
            <Field label="Answer" required>
              <textarea
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                {...validationProps("Answer", "Give pet owners a clear, concise answer")}
                className={textareaClass}
                minLength={5}
                maxLength={1200}
                required
              />
            </Field>
            <Field label="Status" required>
              <StatusSelect value={status} onChange={setStatus} />
            </Field>
            <div className="flex flex-wrap gap-3">
              <SubmitButton disabled={disabled || limitReached}>
                {editingId ? "Save FAQ" : limitReached ? "FAQ limit reached" : "Add FAQ"}
              </SubmitButton>
              {editingId ? (
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-ink transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminBlock>
        <AdminBlock icon={<List className="h-4 w-4" />} title="Existing FAQs">
          <RecordList
            items={items.map((item) => ({
              id: item.id,
              title: item.question,
              status: item.status,
              archived: Boolean(item.archived_at),
              archivedAt: item.archived_at,
              updatedAt: item.updated_at,
            }))}
            disabled={disabled}
            onEdit={edit}
            {...actions}
          />
        </AdminBlock>
      </div>
    </Panel>
  );
}

function TestimonialsManager({
  items,
  disabled,
  onCreate,
  onUpdate,
  ...actions
}: {
  items: TestimonialRow[];
  disabled?: boolean;
  onCreate: (
    values: Pick<TestimonialRow, "name" | "rating" | "review_text" | "status">,
  ) => Promise<void>;
  onUpdate: (
    id: string,
    values: Pick<TestimonialRow, "name" | "rating" | "review_text" | "status">,
  ) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [status, setStatus] = useState<CmsStatus>("published");
  const activeCount = items.filter((item) => !item.archived_at).length;
  const limitReached = !editingId && activeCount >= MAX_REVIEWS;
  const reset = () => {
    setEditingId("");
    setName("");
    setRating(5);
    setReviewText("");
    setStatus("published");
  };
  const edit = (id: string) => {
    const item = items.find((entry) => entry.id === id);
    if (!item || item.status === "published") return;
    setEditingId(id);
    setName(item.name);
    setRating(item.rating);
    setReviewText(item.review_text);
    setStatus(item.status);
    scrollToEditor("review-editor");
  };
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = testimonialFormSchema.parse({ name, rating, review_text: reviewText, status });
    await (editingId ? onUpdate(editingId, values) : onCreate(values));
    reset();
  };

  return (
    <Panel
      icon={<Star className="h-5 w-5" />}
      title="Google reviews"
      body={`${MAX_REVIEWS} reviews are allowed so the website stays clean and organised. ${activeCount}/${MAX_REVIEWS} used.`}
    >
      <div className="space-y-5">
        <AdminBlock
          icon={editingId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          title={editingId ? `Editing review “${name}”` : "Add review"}
          body={
            !editingId ? "Copy only approved reviews. Fields marked * are required." : undefined
          }
          editing={Boolean(editingId)}
        >
          <form id="review-editor" onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <Field label="Reviewer name" required>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                {...validationProps("Reviewer name", "e.g. Maria")}
                className={inputClass}
                minLength={2}
                maxLength={100}
                required
              />
            </Field>
            <Field label="Rating" required>
              <AdminSelect
                label="Rating"
                value={String(rating)}
                onChange={(value) => setRating(Number(value))}
                options={[1, 2, 3, 4, 5].map((value) => ({
                  value: String(value),
                  label: `${value} star${value === 1 ? "" : "s"}`,
                }))}
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Review" required>
                <textarea
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  {...validationProps("Review", "Paste the approved Google review text")}
                  className={textareaClass}
                  minLength={5}
                  maxLength={2000}
                  required
                />
              </Field>
            </div>
            <Field label="Status" required>
              <StatusSelect value={status} onChange={setStatus} />
            </Field>
            <div className="flex flex-wrap items-end gap-3 md:col-span-2">
              <SubmitButton disabled={disabled || limitReached}>
                {editingId ? "Save review" : limitReached ? "Review limit reached" : "Add review"}
              </SubmitButton>
              {editingId ? (
                <button
                  type="button"
                  onClick={reset}
                  className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-ink transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </AdminBlock>
        <AdminBlock icon={<List className="h-4 w-4" />} title="Existing reviews">
          <RecordList
            items={items.map((item) => ({
              id: item.id,
              title: item.name,
              category: `${item.rating} stars`,
              status: item.status,
              archived: Boolean(item.archived_at),
              archivedAt: item.archived_at,
              updatedAt: item.updated_at,
            }))}
            disabled={disabled}
            onEdit={edit}
            {...actions}
          />
        </AdminBlock>
      </div>
    </Panel>
  );
}

function AboutManager({
  value,
  disabled,
  onSave,
}: {
  value: AboutSettingsRow;
  disabled?: boolean;
  onSave: (values: AboutSettingsRow) => Promise<void>;
}) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const numberValue = (value: string) => (value === "" ? null : Number(value));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSave(aboutFormSchema.parse(draft));
  };
  return (
    <Panel icon={<UserRound className="h-5 w-5" />} title="About Us">
      <AdminBlock
        icon={<Pencil className="h-4 w-4" />}
        title="About section"
        body="Edit approved clinic facts only. Layout and styling remain protected."
      >
        <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
          <Field label="Section label" required>
            <input
              value={draft.label}
              onChange={(event) => setDraft({ ...draft, label: event.target.value })}
              {...validationProps("Section label", "About Us")}
              className={inputClass}
              minLength={2}
              maxLength={40}
              required
            />
          </Field>
          <Field label="Heading" required>
            <input
              value={draft.heading}
              onChange={(event) => setDraft({ ...draft, heading: event.target.value })}
              {...validationProps(
                "Heading",
                "Veterinary medicine and physiotherapy in one practice.",
              )}
              className={inputClass}
              minLength={5}
              maxLength={180}
              required
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="First paragraph" required>
              <textarea
                value={draft.paragraph_one}
                onChange={(event) => setDraft({ ...draft, paragraph_one: event.target.value })}
                {...validationProps("First paragraph", "Introduce the clinic and doctor")}
                className={textareaClass}
                minLength={5}
                maxLength={1200}
                required
              />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="Second paragraph">
              <textarea
                value={draft.paragraph_two}
                onChange={(event) => setDraft({ ...draft, paragraph_two: event.target.value })}
                {...validationProps(
                  "Second paragraph",
                  "Add another approved clinic detail (optional)",
                )}
                className={textareaClass}
                maxLength={1200}
              />
            </Field>
          </div>
          <Field label="Years of experience">
            <input
              type="number"
              min="0"
              max="100"
              value={draft.years_experience ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, years_experience: numberValue(event.target.value) })
              }
              {...validationProps("Years of experience", "20")}
              className={inputClass}
            />
          </Field>
          <Field label="Completed cases">
            <input
              type="number"
              min="0"
              max="1000000"
              value={draft.completed_cases ?? ""}
              onChange={(event) =>
                setDraft({ ...draft, completed_cases: numberValue(event.target.value) })
              }
              {...validationProps("Completed cases", "1000")}
              className={inputClass}
            />
          </Field>
          <div className="md:col-span-2">
            <SubmitButton disabled={disabled} icon={<Save className="h-4 w-4" />}>
              Save About Us
            </SubmitButton>
          </div>
        </form>
      </AdminBlock>
    </Panel>
  );
}

function GalleryManager({
  items,
  disabled,
  onCreate,
  onUpdate,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onReorder,
}: {
  items: GalleryRow[];
  disabled?: boolean;
  onCreate: (values: {
    title: string;
    description?: string;
    status: CmsStatus;
    files: File[];
  }) => Promise<void>;
  onUpdate: (
    id: string,
    values: {
      title: string;
      description?: string;
      status: CmsStatus;
      files: File[];
    },
  ) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CmsStatus>("published");
  const [files, setFiles] = useState<File[]>([]);

  function resetForm() {
    setEditingId("");
    setTitle("");
    setDescription("");
    setFiles([]);
    setStatus("published");
  }

  function editItem(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item) {
      return;
    }

    if (item.status === "published") {
      return;
    }

    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setStatus(item.status);
    setFiles([]);
    scrollToEditor("gallery-editor");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = galleryFormSchema.parse({ title, description, status });
    if (editingId) {
      await onUpdate(editingId, { ...values, files });
    } else {
      await onCreate({ ...values, files });
    }
    resetForm();
  }

  return (
    <Panel icon={<ImagePlus className="h-5 w-5" />} title="Gallery">
      <div className="space-y-5">
        <div id="gallery-editor" className="scroll-mt-6">
          <AdminBlock
            icon={editingId ? <Pencil className="h-4 w-4" /> : <ImagePlus className="h-4 w-4" />}
            title={editingId ? `Editing gallery “${title}”` : "Add gallery item"}
            body={!editingId ? "Fields marked * are required." : undefined}
            editing={Boolean(editingId)}
          >
            <form onSubmit={submit} className="grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Title" required>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  {...validationProps("Title", "e.g. Luna after her clinic visit")}
                  className={inputClass}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </Field>
              <Field label="Status" required>
                <StatusSelect value={status} onChange={setStatus} />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description optional">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    {...validationProps("Description", "Add a short caption (optional)")}
                    className={textareaClass}
                    maxLength={600}
                  />
                </Field>
              </div>
              <Field label={editingId ? "Add more images" : "Images"} required={!editingId}>
                <ImageUploadField
                  files={files}
                  onChange={setFiles}
                  multiple
                  required={!editingId}
                />
              </Field>
              <div className="flex flex-wrap items-end gap-3 pt-1 md:col-span-2">
                <SubmitButton disabled={disabled}>
                  {editingId ? "Save gallery item" : "Add gallery item"}
                </SubmitButton>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </AdminBlock>
        </div>

        <div inert={Boolean(editingId)} className={editingId ? editorLockedClass : ""}>
          <AdminBlock
            icon={<List className="h-4 w-4" />}
            title="Existing gallery items"
            info={existingItemsInfo}
          >
            <RecordList
              items={items.map((item) => ({
                id: item.id,
                title: item.title,
                status: item.status,
                archived: Boolean(item.archived_at),
                updatedAt: item.updated_at,
                archivedAt: item.archived_at,
                mediaCount: item.gallery_media?.length ?? 0,
                image: publicStorageUrl(
                  "site-gallery",
                  item.gallery_media
                    ?.slice()
                    .sort(
                      (a, b) =>
                        Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
                    )[0]?.image_path,
                ),
              }))}
              disabled={disabled}
              onStatus={onStatus}
              onArchive={onArchive}
              onRestore={onRestore}
              onBulkAction={onBulkAction}
              onEdit={editItem}
              onReorder={onReorder}
            />
          </AdminBlock>
        </div>
      </div>
    </Panel>
  );
}

function CasesManager({
  items,
  categories,
  categoriesConfigured,
  disabled,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
  onCreate,
  onUpdate,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onReorder,
}: {
  items: CaseRow[];
  categories: CategoryRow[];
  categoriesConfigured: boolean;
  disabled?: boolean;
  onCreateCategory: (name: string) => Promise<void>;
  onRenameCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreate: (values: {
    title: string;
    description?: string;
    category?: string;
    is_sensitive: boolean;
    status: CmsStatus;
    files: File[];
  }) => Promise<void>;
  onUpdate: (
    id: string,
    values: {
      title: string;
      description?: string;
      category?: string;
      is_sensitive: boolean;
      status: CmsStatus;
      files: File[];
    },
  ) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [categoryEditing, setCategoryEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isSensitive, setIsSensitive] = useState(true);
  const [status, setStatus] = useState<CmsStatus>("published");
  const [files, setFiles] = useState<File[]>([]);
  const categoryNames = categoryOptions([
    ...categories.map((item) => item.name),
    ...items.map((item) => item.category),
  ]);

  function resetForm() {
    setEditingId("");
    setTitle("");
    setDescription("");
    setCategory("");
    setFiles([]);
    setIsSensitive(true);
    setStatus("published");
  }

  function editItem(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item) {
      return;
    }

    if (item.status === "published") {
      return;
    }

    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description ?? "");
    setCategory(item.category ?? "");
    setIsSensitive(item.is_sensitive);
    setStatus(item.status);
    setFiles([]);
    scrollToEditor("case-editor");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = caseFormSchema.parse({
      title,
      description,
      category,
      is_sensitive: isSensitive,
      status,
    });
    if (editingId) {
      await onUpdate(editingId, { ...values, files });
    } else {
      await onCreate({ ...values, files });
    }
    resetForm();
  }

  return (
    <Panel icon={<PawPrint className="h-5 w-5" />} title="Cases">
      <div className="space-y-5">
        <div inert={Boolean(editingId)} className={editingId ? editorLockedClass : ""}>
          <CategoryPicker
            categories={categories}
            configured={categoriesConfigured}
            itemCounts={categoryItemCounts(
              items.filter((item) => !item.archived_at).map((item) => item.category),
            )}
            disabled={disabled}
            onCreate={onCreateCategory}
            onRename={onRenameCategory}
            onDelete={onDeleteCategory}
            onEditingChange={setCategoryEditing}
          />
        </div>
        <div
          id="case-editor"
          inert={categoryEditing}
          className={`scroll-mt-6 ${categoryEditing ? editorLockedClass : ""}`}
        >
          <AdminBlock
            icon={editingId ? <Pencil className="h-4 w-4" /> : <PawPrint className="h-4 w-4" />}
            title={editingId ? `Editing case “${title}”` : "Add case"}
            body={!editingId ? "Fields marked * are required." : undefined}
            editing={Boolean(editingId)}
          >
            <form onSubmit={submit} className="grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Title" required>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  {...validationProps("Title", "e.g. Dental care case")}
                  className={inputClass}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </Field>
              <Field label="Status" required>
                <StatusSelect value={status} onChange={setStatus} />
              </Field>
              <Field label="Category">
                <CategorySelect
                  value={category}
                  onChange={setCategory}
                  categories={categoryNames}
                  optional
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description optional">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    {...validationProps(
                      "Description",
                      "Briefly describe this documented case (optional)",
                    )}
                    className={textareaClass}
                    maxLength={700}
                  />
                </Field>
              </div>
              <Field label="Images">
                <ImageUploadField files={files} onChange={setFiles} multiple />
              </Field>
              <Field label="Sensitive media">
                <label className={`${inputClass} flex cursor-pointer items-center gap-3`}>
                  <input
                    type="checkbox"
                    checked={isSensitive}
                    onChange={(event) => setIsSensitive(event.target.checked)}
                    className="h-4 w-4 accent-vet-green"
                  />
                  <span className="type-button">Sensitive images</span>
                </label>
              </Field>
              <div className="flex flex-wrap items-end gap-3 pt-1 md:col-span-2">
                <SubmitButton disabled={disabled}>
                  {editingId ? "Save case" : "Add case"}
                </SubmitButton>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </AdminBlock>
        </div>

        <div
          inert={Boolean(editingId || categoryEditing)}
          className={editingId || categoryEditing ? editorLockedClass : ""}
        >
          <AdminBlock
            icon={<List className="h-4 w-4" />}
            title="Existing cases"
            info={existingItemsInfo}
          >
            <RecordList
              items={items.map((item) => ({
                id: item.id,
                title: item.title,
                category: item.category ?? "",
                status: item.status,
                archived: Boolean(item.archived_at),
                updatedAt: item.updated_at,
                archivedAt: item.archived_at,
                mediaCount: item.case_media?.length ?? 0,
                image:
                  item.case_media
                    ?.slice()
                    .sort(
                      (a, b) =>
                        Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
                    )[0]?.signed_url ?? "",
              }))}
              disabled={disabled}
              onStatus={onStatus}
              onArchive={onArchive}
              onRestore={onRestore}
              onBulkAction={onBulkAction}
              onEdit={editItem}
              onReorder={onReorder}
            />
          </AdminBlock>
        </div>
      </div>
    </Panel>
  );
}

function ServicesManager({
  items,
  categories,
  categoriesConfigured,
  disabled,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
  onCreate,
  onUpdate,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onReorder,
}: {
  items: ServiceRow[];
  categories: CategoryRow[];
  categoriesConfigured: boolean;
  disabled?: boolean;
  onCreateCategory: (name: string) => Promise<void>;
  onRenameCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreate: (values: {
    title: string;
    detail: string;
    category: string;
    status: CmsStatus;
    file?: File | null;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    values: {
      title: string;
      detail: string;
      category: string;
      status: CmsStatus;
      file?: File | null;
    },
  ) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [categoryEditing, setCategoryEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [category, setCategory] = useState("General care");
  const [status, setStatus] = useState<CmsStatus>("published");
  const [file, setFile] = useState<File | null>(null);
  const categoryNames = categoryOptions(
    [...categories.map((item) => item.name), ...items.map((item) => item.category)],
    ["General care"],
  );
  const editingItem = items.find((item) => item.id === editingId);
  const imageRequired = !editingItem?.image_path;

  function resetForm() {
    setEditingId("");
    setTitle("");
    setDetail("");
    setCategory("General care");
    setStatus("published");
    setFile(null);
  }

  function editItem(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item) {
      return;
    }

    if (item.status === "published") {
      return;
    }

    setEditingId(item.id);
    setTitle(item.title);
    setDetail(item.detail);
    setCategory(item.category);
    setStatus(item.status);
    setFile(null);
    scrollToEditor("service-editor");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = serviceFormSchema.parse({ title, detail, category, status });
    if (editingId) {
      await onUpdate(editingId, { ...values, file });
    } else {
      await onCreate({ ...values, file });
    }
    resetForm();
  }

  return (
    <Panel icon={<Stethoscope className="h-5 w-5" />} title="Services">
      <div className="space-y-5">
        <div inert={Boolean(editingId)} className={editingId ? editorLockedClass : ""}>
          <CategoryPicker
            categories={categories}
            configured={categoriesConfigured}
            itemCounts={categoryItemCounts(
              items.filter((item) => !item.archived_at).map((item) => item.category),
            )}
            disabled={disabled}
            onCreate={onCreateCategory}
            onRename={onRenameCategory}
            onDelete={onDeleteCategory}
            onEditingChange={setCategoryEditing}
          />
        </div>
        <div
          id="service-editor"
          inert={categoryEditing}
          className={`scroll-mt-6 ${categoryEditing ? editorLockedClass : ""}`}
        >
          <AdminBlock
            icon={editingId ? <Pencil className="h-4 w-4" /> : <Stethoscope className="h-4 w-4" />}
            title={editingId ? `Editing service “${title}”` : "Add service"}
            body={!editingId ? "Fields marked * are required." : undefined}
            editing={Boolean(editingId)}
          >
            <form onSubmit={submit} className="grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Title" required>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  {...validationProps("Title", "e.g. Dental Care")}
                  className={inputClass}
                  minLength={2}
                  maxLength={120}
                  required
                />
              </Field>
              <Field label="Status" required>
                <StatusSelect value={status} onChange={setStatus} />
              </Field>
              <Field label="Category" required>
                <CategorySelect
                  value={category}
                  onChange={setCategory}
                  categories={categoryNames}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Full description" required>
                  <textarea
                    value={detail}
                    onChange={(event) => setDetail(event.target.value)}
                    {...validationProps(
                      "Full description",
                      "Explain what the service includes and when pet owners may need it",
                    )}
                    className={`${textareaClass} min-h-44`}
                    minLength={2}
                    maxLength={3200}
                    required
                  />
                </Field>
              </div>
              <Field label={editingId ? "Replace image" : "Image"} required={imageRequired}>
                <ImageUploadField
                  files={file ? [file] : []}
                  onChange={(nextFiles) => setFile(nextFiles[0] ?? null)}
                  required={imageRequired}
                />
              </Field>
              <div className="flex flex-wrap items-end gap-3 pt-1 md:col-span-2">
                <SubmitButton disabled={disabled}>
                  {editingId ? "Save service" : "Add service"}
                </SubmitButton>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </AdminBlock>
        </div>

        <div
          inert={Boolean(editingId || categoryEditing)}
          className={editingId || categoryEditing ? editorLockedClass : ""}
        >
          <AdminBlock
            icon={<List className="h-4 w-4" />}
            title="Existing services"
            info={existingItemsInfo}
          >
            <RecordList
              items={items.map((item) => ({
                id: item.id,
                title: item.title,
                category: item.category,
                status: item.status,
                archived: Boolean(item.archived_at),
                updatedAt: item.updated_at,
                archivedAt: item.archived_at,
                image: publicStorageUrl("site-services", item.image_path),
              }))}
              disabled={disabled}
              onStatus={onStatus}
              onArchive={onArchive}
              onRestore={onRestore}
              onBulkAction={onBulkAction}
              onEdit={editItem}
              onReorder={onReorder}
            />
          </AdminBlock>
        </div>
      </div>
    </Panel>
  );
}

function ProductsManager({
  items,
  categories,
  categoriesConfigured,
  disabled,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
  onCreate,
  onUpdate,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onReorder,
}: {
  items: ProductRow[];
  categories: CategoryRow[];
  categoriesConfigured: boolean;
  disabled?: boolean;
  onCreateCategory: (name: string) => Promise<void>;
  onRenameCategory: (id: string, name: string) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onCreate: (values: {
    name: string;
    category: string;
    description?: string;
    wolt_url?: string;
    foody_url?: string;
    status: CmsStatus;
    file?: File | null;
  }) => Promise<void>;
  onUpdate: (
    id: string,
    values: {
      name: string;
      category: string;
      description?: string;
      wolt_url?: string;
      foody_url?: string;
      status: CmsStatus;
      file?: File | null;
    },
  ) => Promise<void>;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [editingId, setEditingId] = useState("");
  const [categoryEditing, setCategoryEditing] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [woltUrl, setWoltUrl] = useState("");
  const [foodyUrl, setFoodyUrl] = useState("");
  const [status, setStatus] = useState<CmsStatus>("published");
  const [file, setFile] = useState<File | null>(null);
  const categoryNames = categoryOptions(
    [...categories.map((item) => item.name), ...items.map((item) => item.category)],
    ["Food", "Accessories"],
  );
  const editingItem = items.find((item) => item.id === editingId);
  const imageRequired = !editingItem?.image_path;

  function resetForm() {
    setEditingId("");
    setName("");
    setCategory("Food");
    setDescription("");
    setWoltUrl("");
    setFoodyUrl("");
    setStatus("published");
    setFile(null);
  }

  function editItem(id: string) {
    const item = items.find((currentItem) => currentItem.id === id);
    if (!item) {
      return;
    }

    if (item.status === "published") {
      return;
    }

    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setDescription(item.description);
    setWoltUrl(item.wolt_url ?? "");
    setFoodyUrl(item.foody_url ?? "");
    setStatus(item.status);
    setFile(null);
    scrollToEditor("product-editor");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = productFormSchema.parse({
      name,
      category,
      description,
      wolt_url: woltUrl,
      foody_url: foodyUrl,
      status,
    });
    if (editingId) {
      await onUpdate(editingId, { ...values, file });
    } else {
      await onCreate({ ...values, file });
    }
    resetForm();
  }

  return (
    <Panel icon={<Package className="h-5 w-5" />} title="Products">
      <div className="space-y-5">
        <div inert={Boolean(editingId)} className={editingId ? editorLockedClass : ""}>
          <CategoryPicker
            categories={categories}
            configured={categoriesConfigured}
            itemCounts={categoryItemCounts(
              items.filter((item) => !item.archived_at).map((item) => item.category),
            )}
            disabled={disabled}
            onCreate={onCreateCategory}
            onRename={onRenameCategory}
            onDelete={onDeleteCategory}
            onEditingChange={setCategoryEditing}
          />
        </div>
        <div
          id="product-editor"
          inert={categoryEditing}
          className={`scroll-mt-6 ${categoryEditing ? editorLockedClass : ""}`}
        >
          <AdminBlock
            icon={editingId ? <Pencil className="h-4 w-4" /> : <Package className="h-4 w-4" />}
            title={editingId ? `Editing product “${name}”` : "Add product"}
            body={!editingId ? "Fields marked * are required." : undefined}
            editing={Boolean(editingId)}
          >
            <form onSubmit={submit} className="grid min-w-0 gap-4 md:grid-cols-2">
              <Field label="Name" required>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  {...validationProps("Name", "e.g. Adult dog food")}
                  className={inputClass}
                  minLength={2}
                  maxLength={140}
                  required
                />
              </Field>
              <Field label="Status" required>
                <StatusSelect value={status} onChange={setStatus} />
              </Field>
              <Field label="Category" required>
                <CategorySelect
                  value={category}
                  onChange={setCategory}
                  categories={categoryNames}
                />
              </Field>
              <div className="md:col-span-2">
                <Field label="Description optional">
                  <textarea
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    {...validationProps(
                      "Description",
                      "Add a short product description (optional)",
                    )}
                    className={textareaClass}
                    maxLength={500}
                  />
                </Field>
              </div>
              <Field label="Wolt URL">
                <input
                  type="url"
                  value={woltUrl}
                  onChange={(event) => setWoltUrl(event.target.value)}
                  {...validationProps("Wolt URL", "https://wolt.com/...")}
                  className={inputClass}
                />
              </Field>
              <Field label="Foody URL">
                <input
                  type="url"
                  value={foodyUrl}
                  onChange={(event) => setFoodyUrl(event.target.value)}
                  {...validationProps("Foody URL", "https://foody.com.cy/...")}
                  className={inputClass}
                />
              </Field>
              <Field label={editingId ? "Replace image" : "Image"} required={imageRequired}>
                <ImageUploadField
                  files={file ? [file] : []}
                  onChange={(nextFiles) => setFile(nextFiles[0] ?? null)}
                  required={imageRequired}
                />
              </Field>
              <div className="flex flex-wrap items-end gap-3 pt-1 md:col-span-2">
                <SubmitButton disabled={disabled}>
                  {editingId ? "Save product" : "Add product"}
                </SubmitButton>
                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="focus-ring type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-red-500 hover:bg-red-50 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                ) : null}
              </div>
            </form>
          </AdminBlock>
        </div>

        <div
          inert={Boolean(editingId || categoryEditing)}
          className={editingId || categoryEditing ? editorLockedClass : ""}
        >
          <AdminBlock
            icon={<List className="h-4 w-4" />}
            title="Existing products"
            info={existingItemsInfo}
          >
            <RecordList
              items={items.map((item) => ({
                id: item.id,
                title: item.name,
                category: item.category,
                status: item.status,
                archived: Boolean(item.archived_at),
                updatedAt: item.updated_at,
                archivedAt: item.archived_at,
                image: publicStorageUrl("site-products", item.image_path),
              }))}
              disabled={disabled}
              onStatus={onStatus}
              onArchive={onArchive}
              onRestore={onRestore}
              onBulkAction={onBulkAction}
              onEdit={editItem}
              onReorder={onReorder}
            />
          </AdminBlock>
        </div>
      </div>
    </Panel>
  );
}

function SubmitButton({
  children,
  disabled,
  icon = <Plus className="h-4 w-4" />,
}: {
  children: ReactNode;
  disabled?: boolean;
  icon?: ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-vet-green px-5 text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-45"
    >
      {icon}
      {children}
    </button>
  );
}

type RecordListItem = {
  id: string;
  title: string;
  category?: string;
  status: CmsStatus;
  archived: boolean;
  updatedAt: string;
  archivedAt: string | null;
  image?: string;
  mediaCount?: number;
};

function SortableRecord({ item }: { item: RecordListItem }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={item.id}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.015 }}
      className="flex min-w-0 items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-sm"
    >
      <button
        type="button"
        onPointerDown={(event) => controls.start(event)}
        className="focus-ring grid h-10 w-10 shrink-0 touch-none cursor-grab place-items-center rounded-xl bg-sage/55 text-vet-green active:cursor-grabbing"
        aria-label={`Drag to reorder ${item.title}`}
      >
        <GripVertical className="h-5 w-5" />
      </button>
      {item.image ? (
        <img
          src={item.image}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-xl object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="type-button truncate text-ink">{item.title}</p>
        {item.category ? (
          <p className="mt-1 truncate text-xs font-semibold text-ink/48">{item.category}</p>
        ) : null}
        {item.mediaCount && item.mediaCount > 1 ? (
          <p className="mt-1 text-xs font-semibold text-vet-green">{item.mediaCount} images</p>
        ) : null}
      </div>
    </Reorder.Item>
  );
}

function RecordList({
  items,
  disabled,
  onStatus,
  onArchive,
  onRestore,
  onBulkAction,
  onEdit,
  onReorder,
}: {
  items: RecordListItem[];
  disabled?: boolean;
  onStatus: (id: string, status: CmsStatus) => Promise<void>;
  onArchive: (id: string) => Promise<void>;
  onRestore: (id: string) => Promise<void>;
  onBulkAction: (ids: string[], action: BulkContentAction) => Promise<void>;
  onEdit: (id: string) => void;
  onReorder: (ids: string[]) => Promise<void>;
}) {
  const [view, setView] = useState<"all" | "archived">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | CmsStatus>("all");
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [reordering, setReordering] = useState(false);
  const [draftOrder, setDraftOrder] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmation, setConfirmation] = useState<ConfirmRequest | null>(null);
  const filterRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    function closeFilter(event: PointerEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        filterRef.current.removeAttribute("open");
        setFilterOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeFilter);
    return () => document.removeEventListener("pointerdown", closeFilter);
  }, []);

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [categoryFilters, pageSize, query, statusFilter, view]);

  useEffect(() => {
    const availableIds = new Set(items.map((item) => item.id));
    setSelectedIds((current) => current.filter((id) => availableIds.has(id)));
  }, [items]);

  useEffect(() => {
    if (!reordering) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setReordering(false);
      }
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [reordering]);

  if (!items.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line p-5 text-sm font-semibold text-ink/52">
        Nothing here yet.
      </div>
    );
  }

  const activeCount = items.filter((item) => !item.archived).length;
  const archivedCount = items.length - activeCount;
  const categories = Array.from(
    new Set(items.map((item) => item.category?.trim()).filter(Boolean) as string[]),
  ).sort((a, b) => a.localeCompare(b));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredItems = items.filter((item) => {
    const inView = view === "archived" ? item.archived : !item.archived;
    const inStatus = statusFilter === "all" || item.status === statusFilter;
    const inCategory =
      !categoryFilters.length || categoryFilters.includes(item.category?.toLowerCase() ?? "");
    const searchableText = `${item.title} ${item.category ?? ""}`.toLowerCase();
    return inView && inStatus && inCategory && searchableText.includes(normalizedQuery);
  });
  const categoryOrder = new Map(
    categories.map((category, index) => [category.toLowerCase(), index]),
  );
  const groupedItems = [...filteredItems].sort((a, b) => {
    const aCategory = a.category?.toLowerCase() ?? "";
    const bCategory = b.category?.toLowerCase() ?? "";
    return (
      (categoryOrder.get(aCategory) ?? categories.length) -
      (categoryOrder.get(bCategory) ?? categories.length)
    );
  });
  const totalPages = Math.max(1, Math.ceil(groupedItems.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = groupedItems.slice(startIndex, startIndex + pageSize);
  const visibleIds = visibleItems.map((item) => item.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id));
  const hasActiveFilters = statusFilter !== "all" || categoryFilters.length > 0;
  const filterActive = filterOpen || hasActiveFilters;
  const activeItems = items.filter((item) => !item.archived);

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-center gap-2">
          <details
            ref={filterRef}
            onToggle={(event) => setFilterOpen(event.currentTarget.open)}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.currentTarget.removeAttribute("open");
                setFilterOpen(false);
              }
            }}
            className="group/filter relative shrink-0"
          >
            <summary
              className={`focus-ring grid h-11 w-11 cursor-pointer list-none place-items-center rounded-2xl border transition-colors marker:hidden ${
                filterActive
                  ? "border-vet-green bg-vet-green text-white"
                  : "border-line bg-white text-ink/58 hover:border-vet-green hover:text-vet-green"
              }`}
            >
              <ListFilter className="h-4 w-4" />
              <span className="sr-only">Filter existing items</span>
            </summary>
            <div className="absolute left-0 top-[3.25rem] z-30 w-56 rounded-2xl border border-line bg-white p-2 shadow-xl">
              <div className="flex items-center justify-between gap-3 px-3 pb-1 pt-2">
                <p className="text-xs font-bold uppercase text-ink/40">Status</p>
                {hasActiveFilters ? (
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter("all");
                      setCategoryFilters([]);
                    }}
                    className="focus-ring inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-red-600 transition-colors hover:bg-red-50"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </button>
                ) : null}
              </div>
              {(
                [
                  ["all", "All"],
                  ["published", "Published"],
                  ["draft", "Unpublished"],
                ] as const
              ).map(([value, label]) => (
                <label
                  key={value}
                  className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink/68 hover:bg-sage/55"
                >
                  <input
                    type="checkbox"
                    checked={statusFilter === value}
                    onChange={() => setStatusFilter(value)}
                    className="h-4 w-4 accent-vet-green"
                  />
                  {label}
                </label>
              ))}
              {categories.length ? (
                <div className="mt-2 border-t border-line pt-2">
                  <p className="px-3 pb-1 pt-2 text-xs font-bold uppercase text-ink/40">Category</p>
                  <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink/68 hover:bg-sage/55">
                    <input
                      type="checkbox"
                      checked={!categoryFilters.length}
                      onChange={() => setCategoryFilters([])}
                      className="h-4 w-4 accent-vet-green"
                    />
                    All categories
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category}
                      className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink/68 hover:bg-sage/55"
                    >
                      <input
                        type="checkbox"
                        checked={categoryFilters.includes(category.toLowerCase())}
                        onChange={() =>
                          setCategoryFilters((current) =>
                            current.includes(category.toLowerCase())
                              ? current.filter((item) => item !== category.toLowerCase())
                              : [...current, category.toLowerCase()],
                          )
                        }
                        className="h-4 w-4 accent-vet-green"
                      />
                      <span className="truncate">{category}</span>
                    </label>
                  ))}
                </div>
              ) : null}
            </div>
          </details>

          <div className="inline-flex min-w-0 flex-1 rounded-2xl border border-line bg-sage/35 p-1 sm:flex-none">
            {(
              [
                ["all", "All", activeCount],
                ["archived", "Archived", archivedCount],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                onClick={() => setView(value)}
                className={`focus-ring type-button min-h-10 flex-1 rounded-xl px-3 transition-colors sm:flex-none sm:px-4 ${
                  view === value ? "bg-ink text-white" : "text-ink/58 hover:bg-white hover:text-ink"
                }`}
              >
                {label} <span className="ml-1 opacity-65">{count}</span>
              </button>
            ))}
          </div>
          {activeCount > 1 ? (
            <button
              type="button"
              onClick={() => {
                setDraftOrder(activeItems.map((item) => item.id));
                setReordering(true);
              }}
              className="focus-ring type-button inline-flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-line bg-white px-3 text-ink/68 transition-colors hover:border-vet-green hover:text-vet-green sm:px-4"
            >
              <ArrowUpDown className="h-4 w-4" />
              Reorder
            </button>
          ) : null}
        </div>

        <label className="group relative ml-auto h-11 w-full transition-[width] duration-300 ease-out sm:w-32 sm:hover:w-64 sm:focus-within:w-64">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search"
            aria-label="Search existing items"
            className="focus-ring h-full w-full rounded-2xl border border-line bg-white pl-10 pr-4 text-sm font-semibold text-ink outline-none transition-colors placeholder:text-ink/48 focus:border-vet-green"
          />
        </label>
      </div>

      {visibleItems.length ? (
        <div
          className={`mb-4 flex max-w-full flex-col gap-3 rounded-2xl border border-line p-2 sm:flex-row sm:items-center sm:justify-between ${selectedIds.length ? "w-full bg-sage/30" : "w-fit bg-white"}`}
        >
          <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-xl px-2 text-sm font-semibold text-ink/68 transition-colors hover:bg-sage/55">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={() =>
                setSelectedIds((current) =>
                  allVisibleSelected
                    ? current.filter((id) => !visibleIds.includes(id))
                    : Array.from(new Set([...current, ...visibleIds])),
                )
              }
              className="h-4 w-4 accent-vet-green"
            />
            {selectedIds.length ? `${selectedIds.length} selected` : "Select All"}
          </label>
          {selectedIds.length ? (
            <div className="flex flex-wrap gap-2">
              {view === "all" ? (
                <>
                  <ActionButton
                    disabled={disabled}
                    variant="primary"
                    onClick={async () => {
                      await onBulkAction(selectedIds, "publish");
                      setSelectedIds([]);
                    }}
                  >
                    Publish
                  </ActionButton>
                  <ActionButton
                    disabled={disabled}
                    onClick={async () => {
                      await onBulkAction(selectedIds, "unpublish");
                      setSelectedIds([]);
                    }}
                  >
                    Unpublish
                  </ActionButton>
                  <ActionButton
                    disabled={disabled}
                    variant="danger"
                    onClick={async () => {
                      setConfirmation({
                        title: "Archive selected items?",
                        message: `Archive ${selectedIds.length} selected items? They will be removed from the website and can be restored later.`,
                        confirmLabel: "Archive items",
                        action: async () => {
                          await onBulkAction(selectedIds, "archive");
                          setSelectedIds([]);
                        },
                      });
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </ActionButton>
                </>
              ) : (
                <>
                  <ActionButton
                    disabled={disabled}
                    variant="primary"
                    onClick={async () => {
                      await onBulkAction(selectedIds, "restore");
                      setSelectedIds([]);
                    }}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restore
                  </ActionButton>
                  <ActionButton
                    disabled={disabled}
                    variant="danger"
                    onClick={async () => {
                      setConfirmation({
                        title: "Permanently delete selected items?",
                        message: `Permanently delete ${selectedIds.length} selected items and their uploaded files? This cannot be undone.`,
                        confirmLabel: "Delete permanently",
                        action: async () => {
                          await onBulkAction(selectedIds, "permanent_delete");
                          setSelectedIds([]);
                        },
                      });
                    }}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete permanently
                  </ActionButton>
                </>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {visibleItems.length ? (
        <div className="grid min-w-0 gap-3">
          {visibleItems.map((item, index) => {
            const date = item.archived ? item.archivedAt : item.updatedAt;
            const state = item.archived
              ? "Archived"
              : item.status === "published"
                ? "Published"
                : "Draft";
            const category = item.category || "Uncategorized";
            const startsCategory =
              categories.length > 0 &&
              (index === 0 ||
                category.toLowerCase() !==
                  (visibleItems[index - 1]?.category || "Uncategorized").toLowerCase());

            return (
              <div key={item.id} className="grid min-w-0 gap-2">
                {startsCategory ? (
                  <div className="flex items-center gap-3 px-1 pt-1">
                    <span className="type-label shrink-0 text-vet-green">{category}</span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                ) : null}
                <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(item.id)}
                      onChange={() =>
                        setSelectedIds((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        )
                      }
                      className="h-4 w-4 shrink-0 cursor-pointer accent-vet-green"
                      aria-label={`Select ${item.title}`}
                    />
                    {item.image ? (
                      <img
                        src={item.image}
                        alt=""
                        width={56}
                        height={56}
                        className="h-14 w-14 shrink-0 rounded-2xl object-cover"
                        loading="lazy"
                      />
                    ) : null}
                    <div className="min-w-0">
                      <h3 className="type-button truncate text-ink">{item.title}</h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink/52">
                        {item.category ? (
                          <span className="rounded-full bg-sage px-2.5 py-1 text-vet-green">
                            {item.category}
                          </span>
                        ) : null}
                        {item.mediaCount && item.mediaCount > 1 ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-vet-green/20 bg-sage/55 px-2.5 py-1 text-vet-green">
                            <ImagePlus className="h-3.5 w-3.5" aria-hidden="true" />
                            {item.mediaCount} images
                          </span>
                        ) : null}
                        <span>
                          {state} - {formatAdminDate(date)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <RecordActions
                    id={item.id}
                    status={item.status}
                    archived={item.archived}
                    disabled={disabled}
                    onStatus={onStatus}
                    onArchive={onArchive}
                    onRestore={onRestore}
                    onBulkAction={onBulkAction}
                    onEdit={onEdit}
                    archivedAt={item.archivedAt}
                    onConfirm={setConfirmation}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line p-5 text-sm font-semibold text-ink/52">
          {normalizedQuery
            ? "No items match your search."
            : `No ${statusFilter === "all" ? "" : `${statusFilter === "draft" ? "unpublished" : statusFilter} `}${
                view === "archived" ? "archived" : "active"
              } items.`}
        </div>
      )}

      {filteredItems.length ? (
        <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-ink/48">
            Showing {startIndex + 1}-{Math.min(startIndex + pageSize, filteredItems.length)} of{" "}
            {filteredItems.length}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-36">
              <AdminSelect
                compact
                label="Items per page"
                value={String(pageSize)}
                onChange={(nextValue) => setPageSize(Number(nextValue))}
                options={[
                  { value: "10", label: "10 per page" },
                  { value: "25", label: "25 per page" },
                  { value: "50", label: "50 per page" },
                ]}
              />
            </div>
            <button
              type="button"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={currentPage === 1}
              className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-vet-green hover:text-vet-green disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-20 text-center text-sm font-semibold text-ink/58">
              {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={currentPage === totalPages}
              className="focus-ring grid h-10 w-10 place-items-center rounded-xl border border-line bg-white text-ink transition-colors hover:border-vet-green hover:text-vet-green disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : null}

      {reordering ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reorder-title"
          className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/55 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setReordering(false);
            }
          }}
        >
          <div className="flex max-h-[90dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-line bg-[#f7f8f4] shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line bg-white p-5 sm:p-6">
              <div>
                <h3 id="reorder-title" className="type-card-title text-ink">
                  Arrange items
                </h3>
                <p className="mt-1 text-sm font-medium text-ink/55">
                  Drag from the handle, then save the new website order.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReordering(false)}
                className="focus-ring grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-white text-ink transition-colors hover:border-red-400 hover:text-red-600"
                aria-label="Close reorder dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <Reorder.Group
              axis="y"
              values={draftOrder}
              onReorder={setDraftOrder}
              layoutScroll
              className="grid min-h-0 gap-2 overflow-y-auto p-3 sm:p-5"
            >
              {draftOrder.map((id) => {
                const item = activeItems.find((currentItem) => currentItem.id === id);
                return item ? <SortableRecord key={id} item={item} /> : null;
              })}
            </Reorder.Group>
            <div className="flex flex-col-reverse gap-2 border-t border-line bg-white p-4 sm:flex-row sm:justify-end sm:p-5">
              <button
                type="button"
                onClick={() => setReordering(false)}
                className="focus-ring type-button min-h-11 rounded-full border border-line bg-white px-5 text-ink transition-colors hover:border-red-400 hover:text-red-600"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={disabled}
                onClick={async () => {
                  await onReorder(draftOrder);
                  setReordering(false);
                }}
                className="focus-ring focus-ring-dark type-button min-h-11 rounded-full bg-vet-green px-5 text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-45"
              >
                Save order
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <ConfirmDialog request={confirmation} onClose={() => setConfirmation(null)} />
    </div>
  );
}

function formatAdminDate(value: string | null) {
  if (!value) {
    return "date unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

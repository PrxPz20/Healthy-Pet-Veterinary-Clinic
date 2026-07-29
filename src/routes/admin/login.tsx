import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import logoUrl from "@/assets/healthy_pet_logo_admin.png";
import clinicImageUrl from "@/assets/services/pet_shop_admin.jpg";
import { signInAdmin } from "@/lib/admin/repository";
import { reportClientError } from "@/lib/safe-errors";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin login | Healthy Pet Veterinary Clinic" }],
    links: [
      { rel: "preload", as: "image", href: logoUrl, type: "image/png" },
      {
        rel: "preload",
        as: "image",
        href: clinicImageUrl,
        type: "image/jpeg",
        media: "(min-width: 1024px)",
      },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: signInError } = await signInAdmin(email.trim(), password);
      if (signInError) throw signInError;
      await navigate({ to: "/admin" });
    } catch (currentError) {
      reportClientError("Admin sign-in failed", currentError);
      const message =
        currentError instanceof Error && /invalid login credentials/i.test(currentError.message)
          ? "The email or password is incorrect."
          : "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[100dvh] bg-white text-ink lg:grid lg:grid-cols-2">
      <section className="flex min-h-[100dvh] min-w-0 flex-col px-5 py-6 sm:px-10 sm:py-8 lg:px-12 xl:px-20">
        <a href="/" className="focus-ring w-fit rounded-xl" aria-label="Healthy Pet homepage">
          <img
            src={logoUrl}
            alt="Healthy Pet Veterinary Clinic"
            width={448}
            height={115}
            fetchPriority="high"
            className="h-auto w-52 object-contain sm:w-56"
          />
        </a>

        <div className="flex flex-1 items-center py-10 sm:py-14">
          <div className="mx-auto w-full max-w-md">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-sage text-vet-green">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
              Welcome back
            </h1>
            <p className="mt-3 max-w-sm text-base leading-relaxed text-ink/64">
              Sign in to manage Healthy Pet website content.
            </p>

            {!configured ? (
              <div
                role="alert"
                className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold leading-relaxed text-red-700"
              >
                The admin portal is temporarily unavailable. Please try again later.
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-ink/72">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setError("");
                  }}
                  autoComplete="email"
                  placeholder="admin@healthypet.com"
                  required
                  aria-invalid={Boolean(error)}
                  className={`focus-ring min-h-12 w-full rounded-xl border bg-white px-4 text-base text-ink outline-none transition-colors placeholder:text-ink/65 ${
                    error ? "border-red-400" : "border-line hover:border-ink/35"
                  }`}
                />
              </label>

              <label className="grid gap-2">
                <span className="flex items-center justify-between gap-4">
                  <span className="text-sm font-semibold text-ink/72">Password</span>
                  <span className="text-sm font-semibold text-ink/66" title="Coming soon">
                    Forgot password?
                  </span>
                </span>
                <span className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setError("");
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    required
                    aria-invalid={Boolean(error)}
                    className={`focus-ring min-h-12 w-full rounded-xl border bg-white px-4 pr-12 text-base text-ink outline-none transition-colors placeholder:text-ink/65 ${
                      error ? "border-red-400" : "border-line hover:border-ink/35"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="focus-ring absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-ink/48 transition-colors hover:bg-sage hover:text-vet-green"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </span>
              </label>

              {error ? (
                <p role="alert" className="text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!configured || loading}
                className="focus-ring focus-ring-dark type-button mt-1 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-vet-green-dark px-6 text-white transition-[background-color,transform] hover:bg-ink active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ink/35 disabled:active:scale-100 sm:w-40"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-10 text-sm leading-relaxed text-ink/64">
              Access is limited to authorised clinic administrators.
            </p>
          </div>
        </div>
      </section>

      <aside className="hidden min-h-0 p-3 pl-0 lg:block">
        <div
          role="img"
          aria-label="Healthy Pet Veterinary Clinic reception and pet shop"
          className="h-[calc(100dvh-1.5rem)] min-h-[36rem] overflow-hidden rounded-2xl bg-sage bg-cover bg-center"
          style={{ backgroundImage: `url(${clinicImageUrl})` }}
        />
      </aside>
    </main>
  );
}


import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
  UserPlus,
} from "lucide-react";

import { IMAGES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import { Field, inputCls } from "../components/forms";
import { cn } from "../utils/cn";
import { isEmail, isPhone, type Errors } from "../utils/helpers";

export default function Register() {
  const { register, toast } = useProperties();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    terms: false,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (k: keyof typeof form, v: string | boolean) => {
    setForm((prev) => ({ ...prev, [k]: v }));

    if (errors[k]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[k];
        return newErrors;
      });
    }
  };

  /* Password strength */

  const strength =
    form.password.length === 0
      ? 0
      : Math.min(
          4,
          (form.password.length >= 8 ? 1 : 0) +
            (/\d/.test(form.password) ? 1 : 0) +
            (/[A-Z]/.test(form.password) ? 1 : 0) +
            (/[^a-zA-Z0-9]/.test(form.password) ? 1 : 0)
        );

  /* Register submit */

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");

    const errs: Errors = {};

    if (form.name.trim().length < 2) {
      errs.name = "Please enter your full name.";
    }

    if (!isEmail(form.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (form.phone && !isPhone(form.phone)) {
      errs.phone = "Enter a valid phone number.";
    }

    if (
      form.password.length < 8 ||
      !/\d/.test(form.password) ||
      !/[a-zA-Z]/.test(form.password)
    ) {
      errs.password = "Use 8+ characters with letters and numbers.";
    }

    if (form.confirm !== form.password) {
      errs.confirm = "Passwords do not match.";
    }

    if (!form.terms) {
      errs.terms = "Please accept the terms to continue.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setBusy(true);

      const res = await register(
        form.name,
        form.email,
        form.phone,
        form.password
      );

      if (!res.ok) {
        setFormError(res.error ?? "Registration failed.");
        return;
      }

      toast("Account created — welcome to Vista Estates");
      navigate("/");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form panel */}

      <div className="flex items-center justify-center px-4 py-28 sm:px-8">
        <div className="w-full max-w-md">
          <p className="eyebrow">Join Vista Estates</p>

          <h1 className="display mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm text-ink-500">
            Already registered?{" "}
            <Link
              to="/login"
              className="font-semibold text-brass-700 hover:text-brass-600"
            >
              Log in
            </Link>
          </p>

          {formError && (
            <p
              className="mt-6 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
              role="alert"
            >
              <Info className="h-4 w-4 shrink-0" />
              {formError}
            </p>
          )}

          <form onSubmit={submit} noValidate className="mt-7 space-y-5">
            <Field label="Full name" required error={errors.name}>
              <input
                className={inputCls(errors.name)}
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Jane Cooper"
                autoComplete="name"
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Email" required error={errors.email}>
                <input
                  type="email"
                  className={inputCls(errors.email)}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </Field>

              <Field label="Phone (optional)" error={errors.phone}>
                <input
                  className={inputCls(errors.phone)}
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="9876543210"
                  autoComplete="tel"
                />
              </Field>
            </div>

            <Field label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className={cn(inputCls(errors.password), "pr-12")}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="8+ characters"
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-900"
                >
                  {showPw ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>

              {form.password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex flex-1 gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-colors",
                          i <= strength
                            ? strength <= 1
                              ? "bg-rose-400"
                              : strength === 2
                                ? "bg-amber-400"
                                : "bg-emerald-500"
                            : "bg-ink-900/10"
                        )}
                      />
                    ))}
                  </div>

                  <span className="text-[11px] font-semibold text-ink-400">
                    {["", "Weak", "Fair", "Good", "Strong"][strength]}
                  </span>
                </div>
              )}
            </Field>

            <Field label="Confirm password" required error={errors.confirm}>
              <input
                type={showPw ? "text" : "password"}
                className={inputCls(errors.confirm)}
                value={form.confirm}
                onChange={(e) => set("confirm", e.target.value)}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            </Field>

            <div>
              <label className="flex cursor-pointer items-start gap-2.5 text-sm text-ink-600">
                <input
                  type="checkbox"
                  checked={form.terms}
                  onChange={(e) => set("terms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded accent-brass-600"
                />

                <span>
                  I agree to the{" "}
                  <span className="font-semibold text-ink-900 underline">
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span className="font-semibold text-ink-900 underline">
                    Privacy Policy
                  </span>
                </span>
              </label>

              {errors.terms && (
                <p className="field-error">{errors.terms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy}
              className="btn-brass btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UserPlus className="h-4.5 w-4.5" />
              {busy ? "Creating account…" : "Create account"}
            </button>

            <p className="text-center text-[11px] leading-relaxed text-ink-400">
              Your account will be securely registered on our server.
            </p>
          </form>
        </div>
      </div>

      {/* Image panel */}

      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img
          src={IMAGES.villa}
          alt="Modern villa exterior"
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/30 to-ink-950/40" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link to="/" className="btn-outline-light btn-sm w-fit">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to site
          </Link>

          <div>
            <p className="display max-w-md text-3xl leading-snug font-medium text-white">
              Save homes, track listings, and message agents — all in one place.
            </p>

            <div className="mt-6 flex gap-8 text-white/70">
              {[
                ["2,400+", "members"],
                ["10k+", "saved homes"],
                ["4.9★", "member rating"],
              ].map(([v, l]) => (
                <div key={l}>
                  <p className="display text-2xl font-semibold text-brass-300">
                    {v}
                  </p>
                  <p className="text-xs font-medium tracking-wide uppercase">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

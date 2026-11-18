
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Home,
  Info,
  ShieldCheck,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import { Field, inputCls } from "../components/forms";
import { cn } from "../utils/cn";
import { isEmail, type Errors } from "../utils/helpers";

export default function AdminLogin() {
  const { login, logout, toast } = useProperties();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");

    const errs: Errors = {};

    if (!isEmail(form.email.trim())) {
      errs.email = "Enter a valid email address.";
    }

    if (!form.password) {
      errs.password = "Enter your password.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setBusy(true);

      const res = await login(
        form.email.trim(),
        form.password,
        true
      );

      if (!res.ok) {
        setFormError(res.error || "Invalid email or password.");
        return;
      }

      if (res.user?.role !== "admin") {
        logout();
        setFormError(
          "This portal is restricted to Vista Estates staff."
        );
        return;
      }

      toast("Welcome back to the dashboard");

      navigate("/admin", { replace: true });
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Unable to login. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-950 px-4">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full border border-brass-500/20" />

      <div className="pointer-events-none absolute -bottom-52 -left-52 h-[30rem] w-[30rem] rounded-full border border-brass-500/10" />

      <div className="w-full max-w-md py-16">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brass-500 text-white shadow-xl shadow-brass-500/30">
            <ShieldCheck className="h-7 w-7" />
          </span>

          <h1 className="display mt-6 text-3xl font-semibold text-white">
            Admin Portal
          </h1>

          <p className="mt-2 text-sm text-white/50">
            Vista Estates — staff access only
          </p>
        </div>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-2xl sm:p-8">
          {formError && (
            <p
              className="mb-5 flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
              role="alert"
            >
              <Info className="h-4 w-4 shrink-0" />
              {formError}
            </p>
          )}

          <form onSubmit={submit} noValidate className="space-y-5">
            <Field label="Staff email" required error={errors.email}>
              <input
                type="email"
                className={inputCls(errors.email)}
                value={form.email}
                onChange={(e) => {
                  setForm({ ...form, email: e.target.value });
                  setErrors({});
                }}
                placeholder="Enter admin email"
                autoComplete="username"
              />
            </Field>

            <Field label="Password" required error={errors.password}>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  className={cn(inputCls(errors.password), "pr-12")}
                  value={form.password}
                  onChange={(e) => {
                    setForm({ ...form, password: e.target.value });
                    setErrors({});
                  }}
                  placeholder="Enter password"
                  autoComplete="current-password"
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
            </Field>

            <button
              type="submit"
              disabled={busy}
              className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Verifying..." : "Sign in to dashboard"}
            </button>
          </form>
        </div>

        <Link
          to="/"
          className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-white/50 transition hover:text-brass-300"
        >
          <Home className="h-3.5 w-3.5" />
          <ArrowLeft className="h-3.5 w-3.5" />
          Return to public site
        </Link>
      </div>
    </div>
  );
}

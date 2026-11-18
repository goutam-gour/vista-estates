
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  KeyRound,
  LogIn,
  Mail,
} from "lucide-react";

import { IMAGES } from "../data/properties";
import { useProperties } from "../context/PropertyContext";
import { Field, inputCls } from "../components/forms";
import { cn } from "../utils/cn";
import { isEmail, type Errors } from "../utils/helpers";
import { forgotPassword } from "../services/authService";

export default function Login() {
  const { login, toast } = useProperties();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "forgot">("login");

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [resetForm, setResetForm] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);

  /* ---------------- Login ---------------- */

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");

    const errs: Errors = {};

    if (!isEmail(form.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (form.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setBusy(true);

      const res = await login(
        form.email.trim(),
        form.password,
        form.remember
      );

      if (!res.ok) {
        setFormError(res.error ?? "Login failed. Please try again.");
        return;
      }

      toast(`Welcome back, ${res.user?.name.split(" ")[0]}`);

      if (res.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- Forgot Password ---------------- */

  const submitReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormError("");

    const errs: Errors = {};

    if (!isEmail(form.email)) {
      errs.email = "Enter a valid email address.";
    }

    if (resetForm.newPassword.length < 6) {
      errs.newPassword = "Password must be at least 6 characters.";
    }

    if (!resetForm.confirmPassword) {
      errs.confirmPassword = "Please confirm your password.";
    } else if (
      resetForm.newPassword !== resetForm.confirmPassword
    ) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    try {
      setBusy(true);

      await forgotPassword(
        form.email,
        resetForm.newPassword
      );

      setResetSent(true);
      setFormError("");

      toast("Password reset successfully", "success");
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : "Password reset failed. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  /* ---------------- Return UI ---------------- */

  return (
    <div className="grid min-h-screen lg:grid-cols-2">

      {/* Image Panel */}

      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img
          src={IMAGES.penthouse}
          alt="Penthouse interior"
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
              "Every review below comes from a completed transaction. That's the
              Vista difference."
            </p>

            <p className="mt-4 text-sm font-medium text-white/60">
              Rachel & Tom Weaver — closed June 2025
            </p>
          </div>
        </div>
      </div>

      {/* Form Panel */}

      <div className="flex items-center justify-center px-4 py-28 sm:px-8">
        <div className="w-full max-w-md">

          {/* ---------------- Login Form ---------------- */}

          {mode === "login" ? (
            <>
              <p className="eyebrow">Welcome back</p>

              <h1 className="display mt-4 text-3xl font-semibold text-ink-950 sm:text-4xl">
                Log in to your account
              </h1>

              <p className="mt-3 text-sm text-ink-500">
                New to Vista Estates?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-brass-700 hover:text-brass-600"
                >
                  Create an account
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

              <form
                onSubmit={submitLogin}
                noValidate
                className="mt-7 space-y-5"
              >
                <Field label="Email" required error={errors.email}>
                  <input
                    type="email"
                    className={inputCls(errors.email)}
                    value={form.email}
                    onChange={(e) => {
                      setForm({ ...form, email: e.target.value });

                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.email;
                        return newErrors;
                      });
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </Field>

                <Field label="Password" required error={errors.password}>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={cn(inputCls(errors.password), "pr-12")}
                      value={form.password}
                      onChange={(e) => {
                        setForm({ ...form, password: e.target.value });

                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.password;
                          return newErrors;
                        });
                      }}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-900"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4.5 w-4.5" />
                      ) : (
                        <Eye className="h-4.5 w-4.5" />
                      )}
                    </button>
                  </div>
                </Field>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex cursor-pointer items-center gap-2.5 text-ink-600">
                    <input
                      type="checkbox"
                      checked={form.remember}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          remember: e.target.checked,
                        })
                      }
                      className="h-4 w-4 cursor-pointer rounded accent-brass-600"
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setFormError("");
                      setErrors({});
                      setResetSent(false);
                    }}
                    className="font-semibold text-brass-700 hover:text-brass-600"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-primary btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <LogIn className="h-4.5 w-4.5" />
                  {busy ? "Signing in…" : "Log in"}
                </button>
              </form>
            </>

          ) : (

            /* ---------------- Forgot Password Form ---------------- */

            <>
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setFormError("");
                  setErrors({});
                  setResetSent(false);
                }}
                className="btn-ghost btn-sm -ml-2"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to login
              </button>

              <h1 className="display mt-6 text-3xl font-semibold text-ink-950 sm:text-4xl">
                Reset your password
              </h1>

              {resetSent ? (
                <div className="mt-7 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                  <CheckCircle2 className="mx-auto h-9 w-9 text-emerald-600" />

                  <h2 className="mt-3 text-lg font-semibold text-ink-950">
                    Password reset successful!
                  </h2>

                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    Your password has been updated. You can now login with
                    your new password.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setMode("login");
                      setForm({
                        ...form,
                        password: "",
                      });
                      setResetForm({
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setErrors({});
                      setFormError("");
                      setResetSent(false);
                    }}
                    className="btn-primary btn-md mt-5"
                  >
                    <LogIn className="h-4 w-4" />
                    Return to login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={submitReset}
                  noValidate
                  className="mt-7 space-y-5"
                >
                  <p className="text-sm leading-relaxed text-ink-500">
                    Enter your registered email address and choose a new password.
                  </p>

                  {formError && (
                    <p
                      className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700"
                      role="alert"
                    >
                      <Info className="h-4 w-4 shrink-0" />
                      {formError}
                    </p>
                  )}

                  <Field label="Email" required error={errors.email}>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-400" />

                      <input
                        type="email"
                        className={cn(inputCls(errors.email), "pl-11")}
                        value={form.email}
                        onChange={(e) => {
                          setForm({ ...form, email: e.target.value });

                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.email;
                            return newErrors;
                          });
                        }}
                        placeholder="you@example.com"
                        autoComplete="email"
                      />
                    </div>
                  </Field>

                  <Field
                    label="New Password"
                    required
                    error={errors.newPassword}
                  >
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className={cn(
                          inputCls(errors.newPassword),
                          "pr-12"
                        )}
                        value={resetForm.newPassword}
                        onChange={(e) => {
                          setResetForm({
                            ...resetForm,
                            newPassword: e.target.value,
                          });

                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.newPassword;
                            return newErrors;
                          });
                        }}
                        placeholder="Enter new password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowNewPassword((v) => !v)
                        }
                        aria-label={
                          showNewPassword ? "Hide password" : "Show password"
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-900"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4.5 w-4.5" />
                        ) : (
                          <Eye className="h-4.5 w-4.5" />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field
                    label="Confirm New Password"
                    required
                    error={errors.confirmPassword}
                  >
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={cn(
                          inputCls(errors.confirmPassword),
                          "pr-12"
                        )}
                        value={resetForm.confirmPassword}
                        onChange={(e) => {
                          setResetForm({
                            ...resetForm,
                            confirmPassword: e.target.value,
                          });

                          setErrors((prev) => {
                            const newErrors = { ...prev };
                            delete newErrors.confirmPassword;
                            return newErrors;
                          });
                        }}
                        placeholder="Confirm new password"
                        autoComplete="new-password"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((v) => !v)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1.5 text-ink-400 hover:text-ink-900"
                      >
                        {showConfirmPassword ? (
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
                    className="btn-brass btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <KeyRound className="h-4.5 w-4.5" />
                    {busy ? "Updating password…" : "Reset Password"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

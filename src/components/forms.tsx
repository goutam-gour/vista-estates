import { useState, type ReactNode } from "react";
import { AlertCircle, CheckCircle2, Send } from "lucide-react";
import { cn } from "../utils/cn";
import { isEmail, isPhone, required, type Errors } from "../utils/helpers";
import { useProperties } from "../context/PropertyContext";

/* ------------------------------ Field wrapper ------------------------------ */
export function Field({
  label,
  error,
  required: req = false,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="label">
        {label} {req && <span className="text-brass-600">*</span>}
      </label>
      {children}
      {error && (
        <p className="field-error" role="alert">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

export const inputCls = (error?: string) => cn("input", error && "input-error");

/* ------------------------------ Enquiry form ------------------------------ */
export function EnquiryForm({
  propertyId,
  propertyTitle,
  source = "enquiry",
}: {
  propertyId: string;
  propertyTitle: string;
  source?: "enquiry" | "contact";
}) {
  const { addEnquiry, toast } = useProperties();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!required(form.name)) errs.name = "Please enter your full name.";
    if (!isEmail(form.email)) errs.email = "Enter a valid email address.";
    if (form.phone && !isPhone(form.phone)) errs.phone = "Enter a valid phone number.";
    if (!required(form.message) || form.message.trim().length < 10)
      errs.message = "Message must be at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    window.setTimeout(() => {
      addEnquiry({
        type: "enquiry",
        propertyId,
        propertyTitle,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        message: form.message.trim(),
      });
      setSending(false);
      setSent(true);
      toast("Enquiry sent — the agent will reply shortly");
    }, 600);
  };

  if (sent) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h4 className="display mt-3 text-lg font-semibold text-ink-950">Enquiry received</h4>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Thank you, {form.name.split(" ")[0]}. The listing agent has been notified and typically responds within one
          business day. A copy has been sent to {form.email}.
        </p>
        <button
          className="btn-outline btn-sm mt-5"
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", phone: "", message: "" });
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required error={errors.name}>
          <input className={inputCls(errors.name)} value={form.name} onChange={set("name")} placeholder="Jane Cooper" />
        </Field>
        <Field label="Email" required error={errors.email}>
          <input
            type="email"
            className={inputCls(errors.email)}
            value={form.email}
            onChange={set("email")}
            placeholder="jane@example.com"
          />
        </Field>
      </div>
      <Field label="Phone (optional)" error={errors.phone}>
        <input className={inputCls(errors.phone)} value={form.phone} onChange={set("phone")} placeholder="(512) 555-0100" />
      </Field>
      <Field label="Message" required error={errors.message}>
        <textarea
          rows={source === "contact" ? 5 : 4}
          className={cn(inputCls(errors.message), "resize-none")}
          value={form.message}
          onChange={set("message")}
          placeholder={`I'm interested in ${propertyTitle}. Could we arrange a tour?`}
        />
      </Field>
      <button type="submit" disabled={sending} className="btn-brass btn-lg w-full">
        {sending ? "Sending…" : "Send enquiry"} <Send className="h-4 w-4" />
      </button>
      <p className="text-center text-[11px] leading-relaxed text-ink-400">
        Your details are only shared with the listing agent. We never sell contact information.
      </p>
    </form>
  );
}

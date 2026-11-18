import { useState } from "react";
import { AlertCircle, CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { Field, inputCls } from "../components/forms";
import { Reveal } from "../components/ui";
import { cn } from "../utils/cn";
import { isEmail, isPhone, osmEmbed, required, type Errors } from "../utils/helpers";

const INFO = [
  { icon: MapPin, title: "Head office", lines: ["908 Congress Ave, Suite 400", "Austin, TX 78701"] },
  { icon: Phone, title: "Phone", lines: ["(512) 555-0192", "Mon–Sat, 9:00 – 18:00 CST"], href: "tel:+15125550192" },
  { icon: Mail, title: "Email", lines: ["hello@vistaestates.com", "Replies within one business day"], href: "mailto:hello@vistaestates.com" },
  { icon: Clock, title: "Walk-in hours", lines: ["Mon–Fri 9:00 – 18:00", "Sat 10:00 – 16:00 · Sun closed"] },
];

const SUBJECTS = ["General enquiry", "Buying a property", "Selling a property", "Renting", "Valuation request", "Property management", "Something else"];

export default function Contact() {
  const { addMessage, toast } = useProperties();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [k]: e.target.value });
    if (errors[k]) setErrors({ ...errors, [k]: "" });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Errors = {};
    if (!required(form.name)) errs.name = "Please enter your name.";
    if (!isEmail(form.email)) errs.email = "Enter a valid email address.";
    if (form.phone && !isPhone(form.phone)) errs.phone = "Enter a valid phone number.";
    if (!required(form.message) || form.message.trim().length < 10) errs.message = "Message must be at least 10 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSending(true);
    window.setTimeout(() => {
      addMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        subject: form.subject,
        message: form.message.trim(),
      });
      setSending(false);
      setSent(true);
      toast("Message sent — we'll reply within one business day");
    }, 600);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-ink-950 pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-brass-300">Contact</p>
          <h1 className="display mt-5 text-4xl leading-tight font-semibold text-balance text-white sm:text-6xl">
            Talk to a <span className="text-brass-300">real person</span> today
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            Call, email or drop by the office. No ticket queues, no bots — a licensed agent answers.
          </p>
        </div>
      </section>

      <section className="container-x grid items-start gap-10 py-16 sm:py-24 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <Reveal className="card p-6 sm:p-10">
          {sent ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </span>
              <h2 className="display mt-5 text-2xl font-semibold text-ink-950">Message received</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
                Thanks, {form.name.split(" ")[0]}. Your message is with our client-care team — expect a reply at{" "}
                <span className="font-semibold text-ink-900">{form.email}</span> within one business day.
              </p>
              <button
                className="btn-outline btn-md mt-7"
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", phone: "", subject: SUBJECTS[0], message: "" });
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h2 className="display text-2xl font-semibold text-ink-950">Send us a message</h2>
              <p className="mt-2 text-sm text-ink-500">Fields marked * are required.</p>
              <form onSubmit={submit} noValidate className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" required error={errors.name}>
                    <input className={inputCls(errors.name)} value={form.name} onChange={set("name")} placeholder="Jane Cooper" />
                  </Field>
                  <Field label="Email" required error={errors.email}>
                    <input type="email" className={inputCls(errors.email)} value={form.email} onChange={set("email")} placeholder="jane@example.com" />
                  </Field>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Phone (optional)" error={errors.phone}>
                    <input className={inputCls(errors.phone)} value={form.phone} onChange={set("phone")} placeholder="(512) 555-0100" />
                  </Field>
                  <Field label="Subject">
                    <select className={cn(inputCls(), "cursor-pointer appearance-none")} value={form.subject} onChange={set("subject")}>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <Field label="Message" required error={errors.message}>
                  <textarea rows={6} className={cn(inputCls(errors.message), "resize-none")} value={form.message} onChange={set("message")} placeholder="Tell us how we can help…" />
                </Field>
                {Object.keys(errors).length > 0 && (
                  <p className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700" role="alert">
                    <AlertCircle className="h-4 w-4" /> Please fix the highlighted fields above.
                  </p>
                )}
                <button type="submit" disabled={sending} className="btn-brass btn-lg w-full sm:w-auto">
                  {sending ? "Sending…" : "Send message"} <Send className="h-4 w-4" />
                </button>
              </form>
            </>
          )}
        </Reveal>

        {/* Info cards */}
        <div className="space-y-4">
          {INFO.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <div className="card flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-cream text-brass-700">
                  <item.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink-950">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="mt-1 block text-sm text-ink-600 hover:text-brass-700">{item.lines[0]}</a>
                  ) : (
                    <p className="mt-1 text-sm text-ink-600">{item.lines[0]}</p>
                  )}
                  <p className="mt-0.5 text-xs text-ink-400">{item.lines[1]}</p>
                </div>
              </div>
            </Reveal>
          ))}

          <Reveal delay={340}>
            <div className="rounded-3xl bg-ink-950 p-7 text-white">
              <h3 className="display text-lg font-semibold">Prefer to talk now?</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                Our duty agent answers within business hours — usually on the second ring.
              </p>
              <a href="tel:+15125550192" className="btn-brass btn-md mt-5 w-full">
                <Phone className="h-4 w-4" /> (512) 555-0192
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Map */}
      <section className="container-x pb-20 sm:pb-28">
        <Reveal>
          <div className="card overflow-hidden">
            <iframe
              title="Vista Estates head office map — Downtown Austin"
              src={osmEmbed(30.2672, -97.7431, 0.03)}
              className="h-96 w-full border-0"
              loading="lazy"
            />
          </div>
        </Reveal>
      </section>
    </div>
  );
}

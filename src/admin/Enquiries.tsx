import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarClock,
  ChevronRight,
  Flag,
  Inbox,
  MailOpen,
  MessageSquare,
  Phone,
  Trash2,
} from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { ConfirmDialog, EmptyState } from "../components/ui";
import { cn } from "../utils/cn";
import { formatDate, timeAgo } from "../utils/helpers";
import type { Enquiry } from "../types";

type Tab = "enquiries" | "messages" | "reports";

export default function Enquiries() {
  const {
    enquiries, messages, reports,
    setEnquiryStatus, deleteEnquiry,
    toggleMessageRead, deleteMessage,
    deleteReport, toast,
  } = useProperties();
  const [tab, setTab] = useState<Tab>("enquiries");
  const [confirm, setConfirm] = useState<{ kind: Tab; id: string; label: string } | null>(null);

  const tabs: { key: Tab; label: string; icon: typeof Inbox; count: number; badge: number }[] = [
    { key: "enquiries", label: "Enquiries", icon: Inbox, count: enquiries.length, badge: enquiries.filter((e) => e.status === "New").length },
    { key: "messages", label: "Contact messages", icon: MessageSquare, count: messages.length, badge: messages.filter((m) => !m.read).length },
    { key: "reports", label: "Listing reports", icon: Flag, count: reports.length, badge: reports.length },
  ];

  const doDelete = () => {
    if (!confirm) return;
    if (confirm.kind === "enquiries") deleteEnquiry(confirm.id);
    if (confirm.kind === "messages") deleteMessage(confirm.id);
    if (confirm.kind === "reports") deleteReport(confirm.id);
    toast("Removed", "info");
    setConfirm(null);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <p className="eyebrow">Inbox</p>
        <h1 className="display mt-2 text-3xl font-semibold text-ink-950">Enquiries & messages</h1>
        <p className="mt-1 text-sm text-ink-500">Everything the public site sends you lands here.</p>
      </div>

      {/* Tabs */}
      <div className="card flex gap-1 overflow-x-auto p-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold whitespace-nowrap transition",
              tab === t.key ? "bg-ink-900 text-white shadow" : "text-ink-500 hover:bg-cream hover:text-ink-900",
            )}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-bold", tab === t.key ? "bg-white/15" : "bg-ink-900/8")}>
              {t.count}
            </span>
            {t.badge > 0 && tab !== t.key && <span className="h-2 w-2 rounded-full bg-brass-500" />}
          </button>
        ))}
      </div>

      {/* Enquiries tab */}
      {tab === "enquiries" &&
        (enquiries.length === 0 ? (
          <EmptyState
            icon={<Inbox className="h-7 w-7" />}
            title="No enquiries yet"
            message="When visitors contact an agent or request a tour, their enquiry appears here instantly."
          />
        ) : (
          <div className="space-y-3">
            {enquiries.map((e) => (
              <EnquiryCard key={e.id} e={e} onStatus={(s) => setEnquiryStatus(e.id, s)} onDelete={() => setConfirm({ kind: "enquiries", id: e.id, label: e.name })} />
            ))}
          </div>
        ))}

      {/* Messages tab */}
      {tab === "messages" &&
        (messages.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="h-7 w-7" />}
            title="No contact messages"
            message="Messages from the public contact form will appear here."
          />
        ) : (
          <div className="space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn("card p-5 transition sm:p-6", !m.read && "border-l-4 border-l-brass-500")}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 font-semibold text-ink-950">
                      {m.name}
                      {!m.read && <span className="chip bg-brass-100 text-brass-700">Unread</span>}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {m.email} {m.phone && `· ${m.phone}`} · {timeAgo(m.date)}
                    </p>
                  </div>
                  <span className="chip bg-cream text-ink-600">{m.subject}</span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">{m.message}</p>
                <div className="mt-4 flex flex-wrap gap-2 border-t border-ink-900/8 pt-4">
                  <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-primary btn-sm">
                    Reply by email
                  </a>
                  <button onClick={() => toggleMessageRead(m.id)} className="btn-outline btn-sm">
                    <MailOpen className="h-3.5 w-3.5" /> Mark {m.read ? "unread" : "read"}
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "messages", id: m.id, label: m.name })}
                    className="btn btn-sm text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      {/* Reports tab */}
      {tab === "reports" &&
        (reports.length === 0 ? (
          <EmptyState
            icon={<Flag className="h-7 w-7" />}
            title="No listing reports"
            message="If a visitor flags a listing as misleading, compliance sees it here within seconds."
          />
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="card border-l-4 border-l-amber-400 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-ink-950">{r.reason}</p>
                    <p className="mt-0.5 text-xs text-ink-400">
                      {r.propertyTitle} · {formatDate(r.date)}
                    </p>
                  </div>
                  <Link to={`/properties/${r.propertyId}`} className="btn-outline btn-sm">
                    View listing <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                {r.details && <p className="mt-3 rounded-xl bg-cream/60 p-4 text-sm leading-relaxed text-ink-600">"{r.details}"</p>}
                <div className="mt-4 flex gap-2">
                  <button onClick={() => toast("Listing flagged for re-verification", "info")} className="btn-outline btn-sm">
                    <Flag className="h-3.5 w-3.5" /> Flag for re-verification
                  </button>
                  <button
                    onClick={() => setConfirm({ kind: "reports", id: r.id, label: r.reason })}
                    className="btn btn-sm text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}

      <ConfirmDialog
        open={confirm !== null}
        title="Remove this record?"
        message={`The ${confirm?.kind === "reports" ? "report" : confirm?.kind === "messages" ? "message" : "enquiry"} from "${confirm?.label}" will be permanently removed.`}
        confirmLabel="Remove"
        onCancel={() => setConfirm(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
function EnquiryCard({ e, onStatus, onDelete }: { e: Enquiry; onStatus: (s: Enquiry["status"]) => void; onDelete: () => void }) {
  return (
    <div className={cn("card p-5 transition sm:p-6", e.status === "New" && "border-l-4 border-l-brass-500")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 font-semibold text-ink-950">
            {e.name}
            <span className={cn("chip", e.type === "visit" ? "bg-sky-100 text-sky-700" : "bg-cream text-ink-600")}>
              {e.type === "visit" ? <CalendarClock className="h-3 w-3" /> : null}
              {e.type === "visit" ? "Tour request" : "Enquiry"}
            </span>
          </p>
          <p className="mt-0.5 text-xs text-ink-400">
            {e.email || "No email provided"} {e.phone && `· ${e.phone}`} · {timeAgo(e.date)}
          </p>
        </div>
        <select
          value={e.status}
          onChange={(ev) => onStatus(ev.target.value as Enquiry["status"])}
          className={cn(
            "cursor-pointer appearance-none rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide uppercase",
            e.status === "New" ? "bg-brass-100 text-brass-700" : "bg-emerald-100 text-emerald-700",
          )}
          aria-label="Enquiry status"
        >
          <option value="New">New</option>
          <option value="Responded">Responded</option>
        </select>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-600">{e.message}</p>

      {e.type === "visit" && e.visitDate && (
        <p className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2.5 text-xs font-semibold text-sky-800">
          <CalendarClock className="h-4 w-4" /> Requested: {formatDate(e.visitDate)} at {e.visitTime}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink-900/8 pt-4">
        <Link to={`/properties/${e.propertyId}`} className="btn-outline btn-sm">
          {e.propertyTitle} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
        {e.phone && (
          <a href={`tel:${e.phone}`} className="btn-ghost btn-sm">
            <Phone className="h-3.5 w-3.5" /> Call
          </a>
        )}
        <button onClick={onDelete} className="btn btn-sm ml-auto text-rose-600 hover:bg-rose-50">
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

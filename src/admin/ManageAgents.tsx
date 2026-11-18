
import { useState, type FormEvent } from "react";
import {
  Mail,
  Pencil,
  Phone,
  PlusCircle,
  Trash2,
  UserSquare2,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import {
  Avatar,
  ConfirmDialog,
  EmptyState,
  Modal,
} from "../components/ui";
import { Field, inputCls } from "../components/forms";
import { isEmail, isPhone, uid, type Errors } from "../utils/helpers";
import type { Agent } from "../types";

const EMPTY_FORM = {
  name: "",
  role: "",
  phone: "",
  email: "",
};

export default function ManageAgents() {
  const {
    agents,
    agentsLoading,
    properties,
    addAgent,
    updateAgent,
    deleteAgent,
    toast,
  } = useAgentActions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [toDelete, setToDelete] = useState<Agent | null>(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Errors>({});

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  /* Open Add Modal */

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  /* Open Edit Modal */

  const openEdit = (agent: Agent) => {
    setEditing(agent);

    setForm({
      name: agent.name,
      role: agent.role,
      phone: agent.phone,
      email: agent.email,
    });

    setErrors({});
    setModalOpen(true);
  };

  /* Submit Add / Update */

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errs: Errors = {};

    if (form.name.trim().length < 2) {
      errs.name = "Name is required.";
    }

    if (!form.role.trim()) {
      errs.role = "Role is required.";
    }

    if (!isPhone(form.phone)) {
      errs.phone = "Enter a valid phone number.";
    }

    if (!isEmail(form.email)) {
      errs.email = "Enter a valid email.";
    }

    setErrors(errs);

    if (Object.keys(errs).length > 0) {
      return;
    }

    try {
      setSaving(true);

      if (editing) {
        await updateAgent({
          ...editing,
          name: form.name.trim(),
          role: form.role.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
        });
      } else {
        await addAgent({
          id: uid("a"),
          name: form.name.trim(),
          role: form.role.trim(),
          phone: form.phone.trim(),
          email: form.email.trim().toLowerCase(),
          listings: 0,
        });
      }

      setModalOpen(false);
      setEditing(null);
      setForm(EMPTY_FORM);
      setErrors({});
    } catch (error) {
      console.error("Agent save error:", error);
    } finally {
      setSaving(false);
    }
  };

  /* Delete Agent */

  const handleDelete = async () => {
    if (!toDelete) return;

    try {
      setDeleting(true);

      await deleteAgent(toDelete.id);

      toast(
        "Agent removed — listings reassigned to client care",
        "info"
      );

      setToDelete(null);
    } catch (error) {
      console.error("Agent delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  /* Assigned Listings */

  const getAssignedListings = (agentId: string) => {
    return properties.filter(
      (property) => property.agentId === agentId
    ).length;
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Team</p>

          <h1 className="display mt-2 text-3xl font-semibold text-ink-950">
            Manage agents
          </h1>

          <p className="mt-1 text-sm text-ink-500">
            {agents.length} specialists on the roster
          </p>
        </div>

        <button
          onClick={openAdd}
          disabled={agentsLoading}
          className="btn-brass btn-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          <PlusCircle className="h-4 w-4" />
          Add agent
        </button>
      </div>

      {/* Loading */}

      {agentsLoading ? (
        <div className="card flex items-center justify-center gap-3 p-12 text-sm text-ink-500">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-brass-600 border-t-transparent" />
          Loading agents...
        </div>
      ) : agents.length === 0 ? (
        /* Empty State */

        <EmptyState
          icon={<UserSquare2 className="h-7 w-7" />}
          title="No agents on the roster"
          message="Add your first specialist. Listings stay assigned to the client-care team until then."
          action={
            <button
              onClick={openAdd}
              className="btn-primary btn-md mt-2"
            >
              Add agent
            </button>
          }
        />
      ) : (
        /* Agent Cards */

        <div className="grid gap-5 sm:grid-cols-2">
          {agents.map((agent) => {
            const assigned = getAssignedListings(agent.id);

            return (
              <div
                key={agent.id}
                className="card p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <Avatar
                    name={agent.name}
                    className="h-14 w-14 text-base"
                  />

                  <div className="min-w-0 flex-1">
                    <h2 className="display truncate text-lg font-semibold text-ink-950">
                      {agent.name}
                    </h2>

                    <p className="text-xs font-bold tracking-widest text-brass-600 uppercase">
                      {agent.role}
                    </p>

                    <p className="mt-1.5 text-xs text-ink-400">
                      {assigned} assigned listings
                    </p>
                  </div>

                  {/* Edit / Delete Buttons */}

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => openEdit(agent)}
                      aria-label={`Edit ${agent.name}`}
                      className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-cream hover:text-brass-700"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => setToDelete(agent)}
                      aria-label={`Delete ${agent.name}`}
                      className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Contact Details */}

                <div className="mt-5 space-y-2 text-sm">
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-3 rounded-xl bg-cream/70 px-4 py-2.5 font-medium text-ink-800 transition hover:bg-cream"
                  >
                    <Phone className="h-4 w-4 text-brass-600" />
                    {agent.phone}
                  </a>

                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-3 rounded-xl bg-cream/70 px-4 py-2.5 font-medium break-all text-ink-800 transition hover:bg-cream"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-brass-600" />
                    {agent.email}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}

      <Modal
        open={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        title={
          editing
            ? `Edit — ${editing.name}`
            : "Add a new agent"
        }
      >
        <form
          onSubmit={submit}
          noValidate
          className="space-y-4"
        >
          <Field
            label="Full name"
            required
            error={errors.name}
          >
            <input
              className={inputCls(errors.name)}
              value={form.name}
              disabled={saving}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              placeholder="Jordan Ellis"
            />
          </Field>

          <Field
            label="Role"
            required
            error={errors.role}
          >
            <input
              className={inputCls(errors.role)}
              value={form.role}
              disabled={saving}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              placeholder="Buyer's Agent"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Phone"
              required
              error={errors.phone}
            >
              <input
                className={inputCls(errors.phone)}
                value={form.phone}
                disabled={saving}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="(512) 555-0100"
              />
            </Field>

            <Field
              label="Email"
              required
              error={errors.email}
            >
              <input
                className={inputCls(errors.email)}
                value={form.email}
                disabled={saving}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="jordan@vistaestates.com"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-brass btn-lg w-full disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Please wait..."
              : editing
                ? "Save changes"
                : "Add agent"}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}

      <ConfirmDialog
        open={toDelete !== null}
        title="Remove this agent?"
        message={`${toDelete?.name} will be removed from the roster. Their ${properties.filter((p) => p.agentId === toDelete?.id).length} assigned listings will fall back to the client-care team on the public site.`}
        confirmLabel={deleting ? "Removing..." : "Remove agent"}
        onCancel={() => {
          if (!deleting) {
            setToDelete(null);
          }
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

/* Small wrapper so toasts stay consistent */

function useAgentActions() {
  const ctx = useProperties();

  return {
    ...ctx,
  };
}

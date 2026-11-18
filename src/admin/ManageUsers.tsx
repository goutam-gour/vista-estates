import { useMemo, useState } from "react";
import { Search, ShieldCheck, Trash2, Users as UsersIcon } from "lucide-react";
import { useProperties } from "../context/PropertyContext";
import { Avatar, ConfirmDialog, EmptyState } from "../components/ui";
import { formatDate } from "../utils/helpers";
import type { User } from "../types";

export default function ManageUsers() {
  const { users, deleteUser, user: current, toast } = useProperties();
  const [q, setQ] = useState("");
  const [toDelete, setToDelete] = useState<User | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => [u.name, u.email, u.phone ?? ""].join(" ").toLowerCase().includes(query));
  }, [users, q]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Accounts</p>
          <h1 className="display mt-2 text-3xl font-semibold text-ink-950">Manage users</h1>
          <p className="mt-1 text-sm text-ink-500">
            {users.length} registered accounts · {users.filter((u) => u.role === "admin").length} staff
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="input py-2.5 pl-10 text-sm" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<UsersIcon className="h-7 w-7" />}
          title="No users found"
          message="No account matches that search. Public registrations appear here automatically."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink-900/8 bg-cream/50 text-[11px] font-bold tracking-widest text-ink-500 uppercase">
                  <th className="px-6 py-4">User</th>
                  <th className="px-4 py-4">Phone</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Joined</th>
                  <th className="px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/6">
                {filtered.map((u) => {
                  const isSelf = u.id === current?.id;
                  const isAdmin = u.role === "admin";
                  return (
                    <tr key={u.id} className="transition hover:bg-cream/40">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={u.name} className="h-10 w-10 text-xs" />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink-950">
                              {u.name} {isSelf && <span className="text-xs font-medium text-brass-600">(you)</span>}
                            </p>
                            <p className="truncate text-xs text-ink-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-ink-600">{u.phone ?? "—"}</td>
                      <td className="px-4 py-4">
                        <span className={isAdmin ? "chip bg-brass-100 text-brass-700" : "chip bg-cream text-ink-600"}>
                          {isAdmin && <ShieldCheck className="h-3 w-3" />}
                          {isAdmin ? "Admin" : "User"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-ink-500">{formatDate(u.joined)}</td>
                      <td className="px-4 py-4">
                        <div className="flex justify-end">
                          <button
                            disabled={isAdmin || isSelf}
                            onClick={() => setToDelete(u)}
                            title={isAdmin ? "Staff accounts can't be removed here" : "Delete user"}
                            className="grid h-9 w-9 place-items-center rounded-xl text-ink-500 transition not-disabled:hover:bg-rose-50 not-disabled:hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this user?"
        message={`${toDelete?.name} (${toDelete?.email}) will lose access to their saved homes and account. This can't be undone.`}
        confirmLabel="Delete user"
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) {
            deleteUser(toDelete.id);
            toast(`${toDelete.name}'s account was deleted`, "info");
          }
          setToDelete(null);
        }}
      />
    </div>
  );
}

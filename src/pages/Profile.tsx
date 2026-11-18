
import { useState, type FormEvent } from "react";
import { Link, Navigate } from "react-router-dom";

import {
  ArrowRight,
  Calendar,
  Heart,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Pencil,
  X,
  Save,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { useProperties } from "../context/PropertyContext";
import { Avatar, Reveal, SectionHeading } from "../components/ui";

export default function Profile() {
  const {
    user,
    favorites,
    logout,
    updateProfile,
    changePassword,
    toast,
  } = useProperties();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saving, setSaving] = useState(false);

  // Change Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changingPassword, setChangingPassword] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const joinedDate = user.joined
    ? new Date(user.joined).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Not available";

  const handleEdit = () => {
    setName(user.name || "");
    setPhone(user.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setName(user.name || "");
    setPhone(user.phone || "");
    setIsEditing(false);
  };

  const handleSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast("Name is required", "error");
      return;
    }

    try {
      setSaving(true);

      const result = await updateProfile(name.trim(), phone.trim());

      if (!result.ok) {
        toast(result.error || "Profile update failed", "error");
        return;
      }

      setIsEditing(false);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // Change Password Handler
  const handleChangePassword = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast("Please fill all password fields", "error");
      return;
    }

    if (newPassword.length < 6) {
      toast("New password must be at least 6 characters", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast("New passwords do not match", "error");
      return;
    }

    if (currentPassword === newPassword) {
      toast("New password must be different from current password", "error");
      return;
    }

    try {
      setChangingPassword(true);

      const result = await changePassword(
        currentPassword,
        newPassword
      );

      if (!result.ok) {
        toast(result.error || "Password change failed", "error");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Password change failed",
        "error"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  const profileDetails = [
    {
      icon: User,
      label: "Full Name",
      value: user.name || "Not available",
    },
    {
      icon: Mail,
      label: "Email Address",
      value: user.email || "Not available",
    },
    {
      icon: Phone,
      label: "Phone Number",
      value: user.phone || "Not provided",
    },
    {
      icon: ShieldCheck,
      label: "Account Role",
      value: user.role || "User",
    },
    {
      icon: Calendar,
      label: "Member Since",
      value: joinedDate,
    },
    {
      icon: Heart,
      label: "Saved Properties",
      value: `${favorites.length} Properties`,
    },
  ];

  return (
    <div className="min-h-screen bg-cream/40">

      {/* Hero */}
      <section className="bg-ink-950 pt-32 pb-16 sm:pt-40 sm:pb-20">
        <div className="container-x">
          <p className="eyebrow text-brass-300">
            My Account
          </p>

          <h1 className="display mt-5 text-4xl font-semibold text-white sm:text-5xl">
            Your Profile
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Manage your account details and keep track of your
            saved properties with Vista Estates.
          </p>
        </div>
      </section>

      {/* Profile Content */}
      <section className="container-x py-14 sm:py-20">

        <div className="grid items-start gap-8 lg:grid-cols-[320px_1fr]">

          {/* Left Profile Card */}
          <Reveal>
            <div className="card overflow-hidden">

              <div className="h-24 bg-ink-950" />

              <div className="px-6 pb-7 text-center">

                <div className="-mt-12 flex justify-center">
                  <Avatar
                    name={user.name}
                    className="h-24 w-24 border-4 border-white text-2xl shadow-lg"
                  />
                </div>

                <h2 className="display mt-5 text-2xl font-semibold text-ink-950">
                  {user.name}
                </h2>

                <p className="mt-2 break-all text-sm text-ink-500">
                  {user.email}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-xs font-bold tracking-wider text-brass-700 uppercase">
                  <ShieldCheck className="h-4 w-4" />
                  {user.role || "User"} Account
                </span>

                <div className="mt-7 border-t border-ink-900/10 pt-6">

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-500">
                      Saved Properties
                    </span>

                    <span className="font-bold text-ink-950">
                      {favorites.length}
                    </span>
                  </div>

                  <Link
                    to="/favorites"
                    className="btn-primary btn-md mt-5 w-full"
                  >
                    View Favorites
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                </div>
              </div>
            </div>
          </Reveal>

          {/* Right Details */}
          <div>

            <Reveal>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <SectionHeading
                  eyebrow="Account Information"
                  title="Personal details"
                  sub="Your account information currently registered with Vista Estates."
                />

                {!isEditing && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className="btn-primary btn-md"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </Reveal>

            {/* Edit Profile Form */}
            {isEditing ? (
              <Reveal>
                <form
                  onSubmit={handleSave}
                  className="card mt-8 space-y-6 p-6 sm:p-8"
                >

                  <div>
                    <h3 className="display text-xl font-semibold text-ink-950">
                      Edit Your Details
                    </h3>

                    <p className="mt-2 text-sm text-ink-500">
                      Update your personal information below.
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <label
                      htmlFor="profile-name"
                      className="mb-2 block text-sm font-semibold text-ink-950"
                    >
                      Full Name
                    </label>

                    <input
                      id="profile-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition focus:border-brass-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="profile-email"
                      className="mb-2 block text-sm font-semibold text-ink-950"
                    >
                      Email Address
                    </label>

                    <input
                      id="profile-email"
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-ink-900/10 bg-cream px-4 py-3 text-sm text-ink-500"
                    />

                    <p className="mt-2 text-xs text-ink-400">
                      Email address cannot be changed here.
                    </p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="profile-phone"
                      className="mb-2 block text-sm font-semibold text-ink-950"
                    >
                      Phone Number
                    </label>

                    <input
                      id="profile-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                      className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition focus:border-brass-500"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap gap-3 border-t border-ink-900/10 pt-5">

                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary btn-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save className="h-4 w-4" />
                      {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={saving}
                      className="btn-outline btn-md"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>

                  </div>
                </form>
              </Reveal>
            ) : (

              /* Profile Details */
              <div className="mt-8 grid gap-4 sm:grid-cols-2">

                {profileDetails.map((item, index) => (
                  <Reveal key={item.label} delay={index * 60}>
                    <div className="card flex h-full items-start gap-4 p-5 transition hover:-translate-y-0.5 hover:shadow-md">

                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-brass-700">
                        <item.icon className="h-5 w-5" />
                      </span>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold tracking-wider text-ink-400 uppercase">
                          {item.label}
                        </p>

                        <p className="mt-2 break-words text-sm font-semibold text-ink-950">
                          {item.value}
                        </p>
                      </div>

                    </div>
                  </Reveal>
                ))}

              </div>
            )}

            {/* Change Password Section */}
            <Reveal delay={150} className="mt-10">
              <form
                onSubmit={handleChangePassword}
                className="card space-y-6 p-6 sm:p-8"
              >

                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-cream text-brass-700">
                    <LockKeyhole className="h-5 w-5" />
                  </span>

                  <div>
                    <h3 className="display text-xl font-semibold text-ink-950">
                      Change Password
                    </h3>

                    <p className="mt-1 text-sm text-ink-500">
                      Update your account password securely.
                    </p>
                  </div>
                </div>

                {/* Current Password */}
                <div>
                  <label
                    htmlFor="current-password"
                    className="mb-2 block text-sm font-semibold text-ink-950"
                  >
                    Current Password
                  </label>

                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 pr-12 text-sm text-ink-950 outline-none transition focus:border-brass-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-950"
                      aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="new-password"
                    className="mb-2 block text-sm font-semibold text-ink-950"
                  >
                    New Password
                  </label>

                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 pr-12 text-sm text-ink-950 outline-none transition focus:border-brass-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-950"
                      aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-ink-400">
                    Password must contain at least 6 characters.
                  </p>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirm-password"
                    className="mb-2 block text-sm font-semibold text-ink-950"
                  >
                    Confirm New Password
                  </label>

                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-3 pr-12 text-sm text-ink-950 outline-none transition focus:border-brass-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-950"
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-ink-900/10 pt-5">
                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="btn-primary btn-md disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <LockKeyhole className="h-4 w-4" />
                    {changingPassword ? "Updating..." : "Update Password"}
                  </button>
                </div>

              </form>
            </Reveal>

            {/* Account Actions */}
            <Reveal delay={200} className="mt-10">
              <div className="rounded-[2rem] bg-ink-950 p-7 text-white sm:p-9">

                <h3 className="display text-xl font-semibold">
                  Account Actions
                </h3>

                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  Manage your saved homes or securely sign out
                  of your Vista Estates account.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <Link
                    to="/favorites"
                    className="btn-primary btn-md"
                  >
                    <Heart className="h-4 w-4" />
                    Saved Properties
                  </Link>

                  <button
                    type="button"
                    onClick={logout}
                    className="btn-outline btn-md border-white/20 text-white hover:border-brass-500 hover:bg-brass-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>

                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

    </div>
  );
}

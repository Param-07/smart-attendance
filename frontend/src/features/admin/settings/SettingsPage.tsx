import axios from "axios";
import { useEffect, useState } from "react";

import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/components/Button";

import {
  getSettings,
  updateSettings,
} from "./api/Settings.api";

import type { SchoolConfiguration } from "./Settings.types";

import FaceRecognitionSettings from "./components/FaceRecognitionSettings";
import AttendanceSettings from "./components/AttendanceSettings";
import LocationSettings from "./components/LocationSettings";
import SecuritySettings from "./components/SecuritySettings";

type SettingValue =
  | boolean
  | number
  | string
  | null;

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const isToday = new Date().toDateString() === date.toDateString();
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  if (isToday) return `Today, ${time}`;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Counts changed fields between the saved settings and the in-progress form. */
function countChangedFields(
  a: SchoolConfiguration,
  b: SchoolConfiguration,
): number {
  const keys = Object.keys(a) as (keyof SchoolConfiguration)[];
  return keys.filter(
    (key) =>
      key !== "createdAt" &&
      key !== "updatedAt" &&
      key !== "version" &&
      a[key] !== b[key],
  ).length;
}

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<SchoolConfiguration | null>(null);

  const [form, setForm] =
    useState<SchoolConfiguration | null>(null);

  const [editing, setEditing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [success, setSuccess] =
    useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      setError(null);

      const data = await getSettings();

      setSettings(data);
      setForm(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Unable to load settings.",
        );
      } else {
        setError(
          "Unable to load settings.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    field: keyof SchoolConfiguration,
    value: SettingValue,
  ) {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      } as SchoolConfiguration;
    });
  }

  function handleEdit() {
    if (!settings) {
      return;
    }

    setForm({
      ...settings,
    });

    setError(null);
    setSuccess(null);
    setEditing(true);
  }

  function handleCancel() {
    if (settings) {
      setForm({
        ...settings,
      });
    }

    setError(null);
    setSuccess(null);
    setEditing(false);
  }

  async function handleSave() {
    if (!settings || !form) {
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated =
        await updateSettings({
          require_check_in_face:
            form.requireCheckInFace,

          require_check_out_face:
            form.requireCheckOutFace,

          require_liveness:
            form.requireLiveness,

          liveness_threshold:
            form.livenessThreshold,

          allow_face_reregistration:
            form.allowFaceReregistration,

          face_match_threshold:
            form.faceMatchThreshold,

          allow_check_in:
            form.allowCheckIn,

          allow_check_out:
            form.allowCheckOut,

          auto_checkout_enabled:
            form.autoCheckoutEnabled,

          auto_checkout_time:
            form.autoCheckoutTime,

          require_check_in_gps:
            form.requireCheckInGps,

          require_check_out_gps:
            form.requireCheckOutGps,

          allowed_radius:
            form.allowedRadius,

          gps_accuracy_threshold:
            form.gpsAccuracyThreshold,

          max_failed_login_attempts:
            form.maxFailedLoginAttempts,

          lockout_duration_minutes:
            form.lockoutDurationMinutes,

          school_latitude:
            form.schoolLatitude,

          school_longitude:
            form.schoolLongitude,

          location_name:
            form.locationName,
        });

      setSettings(updated);
      setForm(updated);
      setEditing(false);

      setSuccess(
        "Settings updated successfully.",
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Unable to update settings.",
        );
      } else {
        setError(
          "Unable to update settings.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <PageHeader
          title="Settings"
          description="Configure attendance, face recognition, location, and security settings."
        />

        <div className="mt-6 rounded-xl border border-outline-variant border-opacity-60 bg-surface-container-lowest p-8 text-sm text-on-surface-variant">
          Loading settings...
        </div>
      </div>
    );
  }

  if (!settings || !form) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <PageHeader
          title="Settings"
          description="Configure attendance, face recognition, location, and security settings."
        />

        <div className="mt-6 rounded-xl border border-error-container bg-error-container bg-opacity-40 p-5 text-sm text-on-error-container">
          {error ??
            "Settings could not be loaded."}
        </div>
      </div>
    );
  }

  const dirtyCount = countChangedFields(settings, form);
  const isDirty = dirtyCount > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <PageHeader
          title="Settings"
          description="Configure attendance, face recognition, location, and security settings."
        />

        {!editing && (
          <Button type="button" onClick={handleEdit}>
            Edit Settings
          </Button>
        )}
      </div>

      {/* Feedback */}

      {error && (
        <div className="mb-6 rounded-lg border border-error-container bg-error-container bg-opacity-40 px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Main Content Layout — matches Stitch's 12-col grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Primary Settings) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <FaceRecognitionSettings
            settings={form}
            editing={editing}
            onChange={handleChange}
          />

          <AttendanceSettings
            settings={form}
            editing={editing}
            onChange={handleChange}
          />

          <LocationSettings
            settings={form}
            editing={editing}
            onChange={handleChange}
          />
        </div>

        {/* Right Column (Security / System Info / Save panel) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <SecuritySettings
            settings={form}
            editing={editing}
            onChange={handleChange}
          />

          <section className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low overflow-hidden">
            <div className="p-4">
              <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-on-surface">
                System Information
              </h2>
              <dl className="flex flex-col gap-2 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-outline-variant border-opacity-30 py-1">
                  <dt className="text-on-surface-variant">Config Version</dt>
                  <dd className="font-medium text-on-surface">v{settings.version}</dd>
                </div>
                <div className="flex items-center justify-between border-b border-outline-variant border-opacity-30 py-1">
                  <dt className="text-on-surface-variant">Created</dt>
                  <dd className="text-on-surface">{formatDate(settings.createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between py-1">
                  <dt className="text-on-surface-variant">Last Updated</dt>
                  <dd className="text-on-surface">{formatDate(settings.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Unsaved Changes — sticky action card, shown only while editing */}
          {editing && (
            <div className="sticky top-6">
              <div className="rounded-xl border-t-4 border-t-primary-container border border-outline-variant border-opacity-60 bg-surface-container-lowest bg-opacity-95 backdrop-blur-sm p-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.03)]">
                <h3 className="mb-1 text-sm font-semibold text-on-surface">
                  Unsaved Changes
                </h3>
                <p className="mb-4 text-xs text-on-surface-variant">
                  {isDirty
                    ? `You have modified ${dirtyCount} setting${dirtyCount === 1 ? "" : "s"}. Apply changes to take effect.`
                    : "No changes yet. Adjust a setting to enable saving."}
                </p>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={saving}
                    className="flex-1"
                  >
                    Discard
                  </Button>

                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={saving || !isDirty}
                    className="flex-1"
                  >
                    {saving ? "Saving..." : "Save All"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
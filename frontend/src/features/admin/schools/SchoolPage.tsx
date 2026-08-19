import axios from "axios";
import { useEffect, useState } from "react";

import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";

import {
  getMySchool,
  updateSchool,
} from "./api/School.api";

import type { School } from "./School.types";

import SchoolOverview from "./components/SchoolOverview";
import SchoolInformation from "./components/SchoolInformation";
import SchoolAddress from "./components/SchoolAddress";


interface SchoolForm {
  name: string;
  code: string;

  email: string;
  phone: string;
  website: string;

  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  timezone: string;
}


function createForm(
  school: School,
): SchoolForm {
  return {
    name: school.name,
    code: school.code,

    email: school.email ?? "",
    phone: school.phone ?? "",
    website: school.website ?? "",

    address: school.address ?? "",
    city: school.city ?? "",
    state: school.state ?? "",
    country: school.country ?? "",

    postalCode:
      school.postalCode ?? "",

    timezone: school.timezone,
  };
}


export default function SchoolPage() {
  const [school, setSchool] =
    useState<School | null>(null);

  const [form, setForm] =
    useState<SchoolForm | null>(null);

  const [isEditing, setIsEditing] =
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
    loadSchool();
  }, []);


  const loadSchool = async () => {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getMySchool();

      setSchool(data);
      setForm(createForm(data));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Unable to load school information.",
        );
      } else {
        setError(
          "Unable to load school information.",
        );
      }
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (
    field: keyof SchoolForm,
    value: string,
  ) => {
    setForm((current) =>
      current
        ? {
            ...current,
            [field]: value,
          }
        : current,
    );
  };


  const handleEdit = () => {
    if (!school) {
      return;
    }

    setForm(createForm(school));
    setError(null);
    setSuccess(null);
    setIsEditing(true);
  };


  const handleCancel = () => {
    if (school) {
      setForm(createForm(school));
    }

    setError(null);
    setSuccess(null);
    setIsEditing(false);
  };


  const handleSave = async () => {
    if (!school || !form) {
      return;
    }

    if (!form.name.trim()) {
      setError("School name is required.");
      return;
    }

    if (!form.code.trim()) {
      setError("School code is required.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const updated =
        await updateSchool(
          school.id,
          {
            name: form.name.trim(),

            code: form.code.trim(),

            email:
              form.email.trim() || null,

            phone:
              form.phone.trim() || null,

            website:
              form.website.trim() || null,

            address:
              form.address.trim() || null,

            city:
              form.city.trim() || null,

            state:
              form.state.trim() || null,

            country:
              form.country.trim(),

            postal_code:
              form.postalCode.trim() ||
              null,

            timezone:
              form.timezone.trim(),
          },
        );

      setSchool(updated);
      setForm(createForm(updated));

      setIsEditing(false);

      setSuccess(
        "School information updated successfully.",
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Unable to update school information.",
        );
      } else {
        setError(
          "Unable to update school information.",
        );
      }
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <PageHeader
          title="School"
          description="Manage your school's profile, contact information, address, and branding."
        />

        <Card className="border-outline-variant bg-surface-container-lowest text-sm text-on-surface-variant shadow-sm">
          Loading school information...
        </Card>
      </div>
    );
  }


  if (!school || !form) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-6">
        <PageHeader
          title="School"
          description="Manage your school's profile, contact information, address, and branding."
        />

        <Card className="border-error-container bg-error-container bg-opacity-40 text-sm text-on-error-container shadow-sm">
          {error ??
            "School information could not be loaded."}
        </Card>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 pb-16">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">

        <PageHeader
          title="School"
          description="Manage your school's profile, contact information, address, and branding."
        />

        {!isEditing ? (
          <Button
            type="button"
            onClick={handleEdit}
            className="shrink-0"
          >
            <span
              className="material-symbols-outlined align-middle mr-1"
              style={{ fontSize: 18 }}
            >
              edit
            </span>
            Edit School
          </Button>
        ) : (
          <div className="flex shrink-0 gap-3">

            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSave}
              disabled={saving}
            >
              <span
                className="material-symbols-outlined align-middle mr-1"
                style={{ fontSize: 18 }}
              >
                save
              </span>
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>

          </div>
        )}

      </div>


      {/* Feedback */}

      {error && (
        <div className="mb-6 rounded-lg border border-error-container bg-error-container bg-opacity-40 px-4 py-3 text-sm text-on-error-container">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          {success}
        </div>
      )}


      {/* Main Layout — matches Stitch's xl:3-col grid */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Overview & Branding */}

        <div className="xl:col-span-1 flex flex-col gap-6">

          <SchoolOverview
            school={school}
          />

        </div>


        {/* Right Column: Information & Address */}

        <div className="xl:col-span-2 flex flex-col gap-6">

          <SchoolInformation
            school={school}
            form={form}
            isEditing={isEditing}
            onChange={handleChange}
          />

          <SchoolAddress
            school={school}
            form={form}
            isEditing={isEditing}
            onChange={handleChange}
          />

        </div>

      </div>

    </div>
  );
}
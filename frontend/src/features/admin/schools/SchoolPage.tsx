import axios from "axios";
import { useEffect, useState } from "react";

import PageHeader from "@/shared/components/PageHeader";
import Button from "@/shared/components/Button";

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
      <div className="space-y-6">

        <PageHeader
          title="School"
          description="Manage your school's profile, contact information, address, and branding."
        />

        <div className="
          rounded-2xl
          border
          border-border
          bg-surface
          p-8
          text-sm
          text-slate-500
        ">
          Loading school information...
        </div>

      </div>
    );
  }


  if (!school || !form) {
    return (
      <div className="space-y-6">

        <PageHeader
          title="School"
          description="Manage your school's profile, contact information, address, and branding."
        />

        <div className="
          rounded-2xl
          border
          border-red-200
          bg-red-50
          p-5
          text-sm
          text-red-700
        ">
          {error ??
            "School information could not be loaded."}
        </div>

      </div>
    );
  }


  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="
        flex
        items-start
        justify-between
        gap-6
      ">

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
            Edit School
          </Button>
        ) : (
          <div className="
            flex
            shrink-0
            gap-3
          ">

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
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>

          </div>
        )}

      </div>


      {/* Feedback */}

      {error && (
        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        ">
          {error}
        </div>
      )}

      {success && (
        <div className="
          rounded-xl
          border
          border-emerald-200
          bg-emerald-50
          px-4
          py-3
          text-sm
          text-emerald-700
        ">
          {success}
        </div>
      )}


      {/* Main Layout */}

      <div className="
        grid
        gap-6
        lg:grid-cols-3
      ">

        {/* School Overview */}

        <div className="
          space-y-6
          lg:col-span-1
        ">

          <SchoolOverview
            school={school}
          />

        </div>


        {/* School Information */}

        <div className="
          space-y-6
          lg:col-span-2
        ">

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
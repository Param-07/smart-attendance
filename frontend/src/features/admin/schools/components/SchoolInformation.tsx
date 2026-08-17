import Card from "@/shared/components/Card";

import type { School } from "../School.types";

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

interface Props {
  school: School;
  form: SchoolForm;
  isEditing: boolean;
  onChange: (
    field: keyof SchoolForm,
    value: string,
  ) => void;
}


function Field({
  label,
  value,
  editing,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div>

      <label className="
        text-xs
        font-medium
        text-slate-500
      ">
        {label}
      </label>

      {editing ? (
        <input
          value={value}
          required={required}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="
            mt-2
            h-11
            w-full
            rounded-xl
            border
            border-border
            bg-surface
            px-3
            text-sm
            text-slate-900
            outline-none
            transition
            focus:border-primary
            focus:ring-2
            focus:ring-blue-100
          "
        />
      ) : (
        <p className="
          mt-2
          text-sm
          font-medium
          text-slate-900
        ">
          {value || "—"}
        </p>
      )}

    </div>
  );
}


export default function SchoolInformation({
  school,
  form,
  isEditing,
  onChange,
}: Props) {
  return (
    <Card className="
      rounded-2xl
      border
      border-border
      bg-surface
      p-6
    ">

      <h2 className="
        text-lg
        font-semibold
        text-slate-900
      ">
        School Information
      </h2>


      <div className="
        mt-6
        grid
        gap-6
        sm:grid-cols-2
      ">

        <Field
          label="School Name"
          value={
            isEditing
              ? form.name
              : school.name
          }
          editing={isEditing}
          required
          onChange={(value) =>
            onChange("name", value)
          }
        />

        <Field
          label="School Code"
          value={
            isEditing
              ? form.code
              : school.code
          }
          editing={isEditing}
          required
          onChange={(value) =>
            onChange("code", value)
          }
        />

        <Field
          label="Email"
          value={
            isEditing
              ? form.email
              : school.email ?? ""
          }
          editing={isEditing}
          onChange={(value) =>
            onChange("email", value)
          }
        />

        <Field
          label="Phone"
          value={
            isEditing
              ? form.phone
              : school.phone ?? ""
          }
          editing={isEditing}
          onChange={(value) =>
            onChange("phone", value)
          }
        />

        <div className="sm:col-span-2">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Website
        </label>

        {isEditing ? (
            <input
            type="url"
            value={form.website}
            onChange={(event) =>
                onChange("website", event.target.value)
            }
            placeholder="https://example.com"
            className="
                h-11
                w-full
                rounded-xl
                border
                border-border
                bg-surface
                px-4
                text-sm
                text-slate-700
                outline-none
                focus:border-primary
                focus:ring-2
                focus:ring-blue-100
            "
            />
        ) : school.website ? (
            <a
            href={
                school.website.startsWith("http://") ||
                school.website.startsWith("https://")
                ? school.website
                : `https://${school.website}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
                hover:underline
            "
            >
            {school.website}
            </a>
        ) : (
            <span className="text-sm text-slate-400">
            —
            </span>
        )}
    </div>

      </div>

    </Card>
  );
}
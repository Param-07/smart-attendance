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

function ViewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm text-on-background">{value || "—"}</p>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-on-surface-variant mb-1">
        {label}
        {required && <span className="text-error"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary focus:ring-opacity-20"
      />
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
    <Card className="rounded-2xl border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="text-base font-semibold text-on-background mb-6 border-b border-outline-variant pb-2">
        School Information
      </h2>

      {isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <EditField
            label="School Name"
            value={form.name}
            required
            onChange={(value) => onChange("name", value)}
          />

          <EditField
            label="School Code"
            value={form.code}
            required
            onChange={(value) => onChange("code", value)}
          />

          <EditField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(value) => onChange("email", value)}
          />

          <EditField
            label="Phone Number"
            type="tel"
            value={form.phone}
            onChange={(value) => onChange("phone", value)}
          />

          <div className="md:col-span-2">
            <EditField
              label="Website"
              type="url"
              value={form.website}
              onChange={(value) => onChange("website", value)}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <ViewField label="School Name" value={school.name} />

          <div>
            <p className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">
              School Code
            </p>
            <p className="font-mono text-sm text-on-surface-variant bg-surface-container-low px-2 py-1 rounded inline-block">
              {school.code}
            </p>
          </div>

          <ViewField label="Email Address" value={school.email ?? ""} />
          <ViewField label="Phone Number" value={school.phone ?? ""} />

          <div className="md:col-span-2">
            <p className="text-xs font-medium text-on-surface-variant mb-1 uppercase tracking-wider">
              Website
            </p>
            {school.website ? (
              <a
                href={
                  school.website.startsWith("http://") ||
                  school.website.startsWith("https://")
                    ? school.website
                    : `https://${school.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                {school.website}
                <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
                  open_in_new
                </span>
              </a>
            ) : (
              <p className="text-sm text-on-background">—</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
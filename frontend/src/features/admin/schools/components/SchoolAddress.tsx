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

const COUNTRY_OPTIONS = [
  { value: "IN", label: "India" },
  { value: "US", label: "United States" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
];

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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-on-surface-variant mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary focus:ring-opacity-20"
      />
    </div>
  );
}

export default function SchoolAddress({
  school,
  form,
  isEditing,
  onChange,
}: Props) {
  const hasKnownCountry = COUNTRY_OPTIONS.some(
    (option) => option.value === form.country,
  );

  return (
    <Card className="rounded-2xl border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
      <h2 className="text-base font-semibold text-on-background mb-6 border-b border-outline-variant pb-2">
        Address Details
      </h2>

      {isEditing ? (
        <div className="flex flex-col gap-4">
          <EditField
            label="Street Address"
            value={form.address}
            onChange={(value) => onChange("address", value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EditField
              label="City"
              value={form.city}
              onChange={(value) => onChange("city", value)}
            />
            <EditField
              label="State/Province"
              value={form.state}
              onChange={(value) => onChange("state", value)}
            />
            <EditField
              label="Postal Code"
              value={form.postalCode}
              onChange={(value) => onChange("postalCode", value)}
            />
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Country
              </label>
              <select
                value={form.country}
                onChange={(event) => onChange("country", event.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-outline-variant bg-surface text-sm text-on-surface outline-none transition-all focus:ring-2 focus:ring-primary focus:ring-opacity-20"
              >
                {!hasKnownCountry && form.country && (
                  <option value={form.country}>{form.country}</option>
                )}
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <ViewField label="Street Address" value={school.address ?? ""} />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-outline-variant pt-4">
            <ViewField label="City" value={school.city ?? ""} />
            <ViewField label="State/Province" value={school.state ?? ""} />
            <ViewField label="Postal Code" value={school.postalCode ?? ""} />
            <ViewField label="Country" value={school.country} />
          </div>
        </div>
      )}
    </Card>
  );
}
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
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
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


export default function SchoolAddress({
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
        Address
      </h2>


      <div className="
        mt-6
        space-y-6
      ">

        <Field
          label="Address"
          value={
            isEditing
              ? form.address
              : school.address ?? ""
          }
          editing={isEditing}
          onChange={(value) =>
            onChange("address", value)
          }
        />


        <div className="
          grid
          gap-6
          sm:grid-cols-2
        ">

          <Field
            label="City"
            value={
              isEditing
                ? form.city
                : school.city ?? ""
            }
            editing={isEditing}
            onChange={(value) =>
              onChange("city", value)
            }
          />

          <Field
            label="State"
            value={
              isEditing
                ? form.state
                : school.state ?? ""
            }
            editing={isEditing}
            onChange={(value) =>
              onChange("state", value)
            }
          />

          <Field
            label="Country"
            value={
              isEditing
                ? form.country
                : school.country
            }
            editing={isEditing}
            onChange={(value) =>
              onChange("country", value)
            }
          />

          <Field
            label="Postal Code"
            value={
              isEditing
                ? form.postalCode
                : school.postalCode ?? ""
            }
            editing={isEditing}
            onChange={(value) =>
              onChange(
                "postalCode",
                value,
              )
            }
          />

        </div>

      </div>

    </Card>
  );
}
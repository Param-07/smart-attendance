// src/features/admin/teachers/components/form/TeacherContactForm.tsx

import Input from "@/shared/components/Input";

interface TeacherContactFormProps {
  officialEmail: string;
  phone: string;

  onOfficialEmailChange: (
    value: string,
  ) => void;

  onPhoneChange: (
    value: string,
  ) => void;

  errors?: {
    officialEmail?: string;
    phone?: string;
  };
}

export default function TeacherContactForm({
  officialEmail,
  phone,
  onOfficialEmailChange,
  onPhoneChange,
  errors,
}: TeacherContactFormProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add the teacher's official contact
          information.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Official Email"
          type="email"
          value={officialEmail}
          placeholder="teacher@school.com"
          onChange={(event) =>
            onOfficialEmailChange(
              event.target.value,
            )
          }
          error={errors?.officialEmail}
        />

        <Input
          label="Phone Number"
          type="tel"
          value={phone}
          placeholder="Enter phone number"
          onChange={(event) =>
            onPhoneChange(
              event.target.value,
            )
          }
          error={errors?.phone}
        />
      </div>
    </section>
  );
}
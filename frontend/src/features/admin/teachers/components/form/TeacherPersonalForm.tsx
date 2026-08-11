// src/features/admin/teachers/components/form/TeacherPersonalForm.tsx

import Input from "@/shared/components/Input";

interface TeacherPersonalFormProps {
  firstName: string;
  middleName: string;
  lastName: string;

  onFirstNameChange: (
    value: string,
  ) => void;

  onMiddleNameChange: (
    value: string,
  ) => void;

  onLastNameChange: (
    value: string,
  ) => void;

  errors?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function TeacherPersonalForm({
  firstName,
  middleName,
  lastName,
  onFirstNameChange,
  onMiddleNameChange,
  onLastNameChange,
  errors,
}: TeacherPersonalFormProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Personal Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the teacher's basic personal
          information.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Input
          label="First Name"
          value={firstName}
          placeholder="Enter first name"
          onChange={(event) =>
            onFirstNameChange(
              event.target.value,
            )
          }
          error={errors?.firstName}
        />

        <Input
          label="Middle Name"
          value={middleName}
          placeholder="Enter middle name"
          onChange={(event) =>
            onMiddleNameChange(
              event.target.value,
            )
          }
        />

        <Input
          label="Last Name"
          value={lastName}
          placeholder="Enter last name"
          onChange={(event) =>
            onLastNameChange(
              event.target.value,
            )
          }
          error={errors?.lastName}
        />
      </div>
    </section>
  );
}
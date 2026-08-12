import { useState } from "react";

import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import TeacherPersonalForm from "./TeacherPersonalForm";
import TeacherEmploymentForm from "./TeacherEmploymentForm";
import TeacherContactForm from "./TeacherContactForm";
import TeacherAdditionalForm from "./TeacherAdditionalForm";

import type {
  TeacherFormData,
  TeacherFormProps,
} from "./TeacherForm.types";

interface FormErrors {
  firstName?: string;
  lastName?: string;

  employeeCode?: string;
  department?: string;
  designation?: string;
  employmentStatus?: string;
  joiningDate?: string;

  officialEmail?: string;
  phone?: string;
}

export default function TeacherForm({
  teacher,
  mode,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TeacherFormProps) {
  const [formData, setFormData] =
    useState<TeacherFormData>({
      firstName:
        teacher?.firstName ?? "",

      middleName:
        teacher?.middleName ?? "",

      lastName:
        teacher?.lastName ?? "",

      employeeCode:
        teacher?.employeeCode ?? "",

      department:
        teacher?.department ?? "",

      designation:
        teacher?.designation ?? "",

      employmentStatus:
        teacher?.employmentStatus ?? "",

      joiningDate:
        teacher?.joiningDate ?? "",

      officialEmail:
        teacher?.email ?? "",

      phone:
        teacher?.phone ?? "",

      remarks:
        teacher?.remarks ?? "",
    });

  const [errors, setErrors] =
    useState<FormErrors>({});

  const updateField = <
    K extends keyof TeacherFormData,
  >(
    field: K,
    value: TeacherFormData[K],
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: undefined,
    }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName =
        "First name is required.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName =
        "Last name is required.";
    }

    if (!formData.employeeCode.trim()) {
      nextErrors.employeeCode =
        "Employee code is required.";
    }

    if (!formData.department) {
      nextErrors.department =
        "Department is required.";
    }

    if (!formData.designation) {
      nextErrors.designation =
        "Designation is required.";
    }

    if (!formData.employmentStatus) {
      nextErrors.employmentStatus =
        "Employment status is required.";
    }

    if (!formData.joiningDate) {
      nextErrors.joiningDate =
        "Joining date is required.";
    }

    if (!formData.officialEmail.trim()) {
      nextErrors.officialEmail =
        "Official email is required.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone =
        "Phone number is required.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Card className="rounded-2xl p-6">
        <div className="space-y-8">
          <TeacherPersonalForm
            firstName={formData.firstName}
            middleName={formData.middleName}
            lastName={formData.lastName}
            onFirstNameChange={(value) =>
              updateField(
                "firstName",
                value,
              )
            }
            onMiddleNameChange={(value) =>
              updateField(
                "middleName",
                value,
              )
            }
            onLastNameChange={(value) =>
              updateField(
                "lastName",
                value,
              )
            }
            errors={{
              firstName:
                errors.firstName,
              lastName:
                errors.lastName,
            }}
          />

          <div className="border-t border-border" />

          <TeacherEmploymentForm
            employeeCode={
              formData.employeeCode
            }
            department={formData.department}
            designation={
              formData.designation
            }
            employmentStatus={
              formData.employmentStatus
            }
            joiningDate={
              formData.joiningDate
            }
            onEmployeeCodeChange={(value) =>
              updateField(
                "employeeCode",
                value,
              )
            }
            onDepartmentChange={(value) =>
              updateField(
                "department",
                value,
              )
            }
            onDesignationChange={(value) =>
              updateField(
                "designation",
                value,
              )
            }
            onEmploymentStatusChange={(
              value,
            ) =>
              updateField(
                "employmentStatus",
                value,
              )
            }
            onJoiningDateChange={(value) =>
              updateField(
                "joiningDate",
                value,
              )
            }
            errors={{
              employeeCode:
                errors.employeeCode,
              department:
                errors.department,
              designation:
                errors.designation,
              employmentStatus:
                errors.employmentStatus,
              joiningDate:
                errors.joiningDate,
            }}
          />

          <div className="border-t border-border" />

          <TeacherContactForm
            officialEmail={
              formData.officialEmail
            }
            phone={formData.phone}
            onOfficialEmailChange={(value) =>
              updateField(
                "officialEmail",
                value,
              )
            }
            onPhoneChange={(value) =>
              updateField(
                "phone",
                value,
              )
            }
            errors={{
              officialEmail:
                errors.officialEmail,
              phone: errors.phone,
            }}
          />

          <div className="border-t border-border" />

          <TeacherAdditionalForm
            remarks={formData.remarks}
            onRemarksChange={(value) =>
              updateField(
                "remarks",
                value,
              )
            }
          />
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Saving..."
            : mode === "create"
              ? "Add Teacher"
              : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
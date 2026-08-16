import Input from "@/shared/components/Input";

import type {
  Department,
  Designation,
  EmploymentStatus,
} from "../../Teachers.types";

interface TeacherEmploymentFormProps {
  employeeCode: string;

  department: Department | "";
  designation: Designation | "";
  employmentStatus: EmploymentStatus | "";

  joiningDate: string;

  onEmployeeCodeChange: (
    value: string,
  ) => void;

  onDepartmentChange: (
    value: Department | "",
  ) => void;

  onDesignationChange: (
    value: Designation | "",
  ) => void;

  onEmploymentStatusChange: (
    value: EmploymentStatus | "",
  ) => void;

  onJoiningDateChange: (
    value: string,
  ) => void;

  errors?: {
    employeeCode?: string;
    department?: string;
    designation?: string;
    employmentStatus?: string;
    joiningDate?: string;
  };
}

const departments: Department[] = [
  "Administration",
  "Mathematics",
  "Science",
  "English",
  "Social Science",
  "Computer",
  "Sports",
  "Art",
  "Music",
  "Library",
];

const designations: Designation[] = [
  "Principal",
  "Vice Principal",
  "Head of Department",
  "Teacher",
  "Assistant Teacher",
  "Sports Coach",
  "Librarian",
  "Administrator",
];

const employmentStatuses: EmploymentStatus[] = [
  "ACTIVE",
  "ON_LEAVE",
  "SUSPENDED",
  "RESIGNED",
  "RETIRED",
];

const employmentStatusLabels: Record<
  EmploymentStatus,
  string
> = {
  ACTIVE: "Active",
  ON_LEAVE: "On Leave",
  SUSPENDED: "Suspended",
  RESIGNED: "Resigned",
  RETIRED: "Retired",
};

export default function TeacherEmploymentForm({
  employeeCode,
  department,
  designation,
  employmentStatus,
  joiningDate,
  onEmployeeCodeChange,
  onDepartmentChange,
  onDesignationChange,
  onEmploymentStatusChange,
  onJoiningDateChange,
  errors,
}: TeacherEmploymentFormProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Employment Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the teacher's employment
          details.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Employee Code */}

        <Input
          label="Employee Code"
          value={employeeCode}
          placeholder="e.g. EMP001"
          onChange={(event) =>
            onEmployeeCodeChange(
              event.target.value,
            )
          }
          error={errors?.employeeCode}
        />

        {/* Department */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="department"
            className="text-sm font-medium text-slate-700"
          >
            Department
          </label>

          <select
            id="department"
            value={department}
            onChange={(event) =>
              onDepartmentChange(
                event.target.value as Department | "",
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              text-sm
              text-gray-900
              transition-colors
              focus:border-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/20
            "
          >
            <option value="">
              Select department
            </option>

            {departments.map(
              (departmentOption) => (
                <option
                  key={departmentOption}
                  value={departmentOption}
                >
                  {departmentOption}
                </option>
              ),
            )}
          </select>

          {errors?.department && (
            <p className="text-sm text-red-600">
              {errors.department}
            </p>
          )}
        </div>

        {/* Designation */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="designation"
            className="text-sm font-medium text-slate-700"
          >
            Designation
          </label>

          <select
            id="designation"
            value={designation}
            onChange={(event) =>
              onDesignationChange(
                event.target.value as Designation | "",
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              text-sm
              text-gray-900
              transition-colors
              focus:border-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/20
            "
          >
            <option value="">
              Select designation
            </option>

            {designations.map(
              (designationOption) => (
                <option
                  key={designationOption}
                  value={designationOption}
                >
                  {designationOption}
                </option>
              ),
            )}
          </select>

          {errors?.designation && (
            <p className="text-sm text-red-600">
              {errors.designation}
            </p>
          )}
        </div>

        {/* Employment Status */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="employmentStatus"
            className="text-sm font-medium text-slate-700"
          >
            Employment Status
          </label>

          <select
            id="employmentStatus"
            value={employmentStatus}
            onChange={(event) =>
              onEmploymentStatusChange(
                event.target.value as EmploymentStatus | "",
              )
            }
            className="
              h-11
              w-full
              rounded-lg
              border
              border-gray-300
              bg-white
              px-3
              text-sm
              text-gray-900
              transition-colors
              focus:border-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/20
            "
          >
            <option value="">
              Select employment status
            </option>

            {employmentStatuses.map(
              (statusOption) => (
                <option
                  key={statusOption}
                  value={statusOption}
                >
                  {
                    employmentStatusLabels[
                      statusOption
                    ]
                  }
                </option>
              ),
            )}
          </select>

          {errors?.employmentStatus && (
            <p className="text-sm text-red-600">
              {errors.employmentStatus}
            </p>
          )}
        </div>

        {/* Joining Date */}

        <Input
          label="Joining Date"
          type="date"
          value={joiningDate}
          onChange={(event) =>
            onJoiningDateChange(
              event.target.value,
            )
          }
          error={errors?.joiningDate}
        />
      </div>
    </section>
  );
}
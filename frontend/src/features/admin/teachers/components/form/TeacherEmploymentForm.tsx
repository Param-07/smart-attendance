// src/features/admin/teachers/components/form/TeacherEmploymentForm.tsx

interface TeacherEmploymentFormProps {
  employeeCode: string;
  department: string;
  designation: string;
  employmentStatus: string;

  onEmployeeCodeChange: (
    value: string,
  ) => void;

  onDepartmentChange: (
    value: string,
  ) => void;

  onDesignationChange: (
    value: string,
  ) => void;

  onEmploymentStatusChange: (
    value: string,
  ) => void;
}

export default function TeacherEmploymentForm({
  employeeCode,
  department,
  designation,
  employmentStatus,
  onEmployeeCodeChange,
  onDepartmentChange,
  onDesignationChange,
  onEmploymentStatusChange,
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

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="employeeCode"
            className="text-sm font-medium text-slate-700"
          >
            Employee Code
          </label>

          <input
            id="employeeCode"
            value={employeeCode}
            placeholder="e.g. EMP001"
            onChange={(event) =>
              onEmployeeCodeChange(
                event.target.value,
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
              placeholder:text-gray-400
              transition-colors
              focus:border-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/20
            "
          />
        </div>

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
                event.target.value,
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

            <option value="SCIENCE">
              Science
            </option>

            <option value="MATHEMATICS">
              Mathematics
            </option>

            <option value="ENGLISH">
              English
            </option>

            <option value="COMMERCE">
              Commerce
            </option>
          </select>
        </div>

        {/* Designation */}

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="designation"
            className="text-sm font-medium text-slate-700"
          >
            Designation
          </label>

          <input
            id="designation"
            value={designation}
            placeholder="e.g. Senior Teacher"
            onChange={(event) =>
              onDesignationChange(
                event.target.value,
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
              placeholder:text-gray-400
              transition-colors
              focus:border-blue-600
              focus:outline-none
              focus:ring-2
              focus:ring-blue-600/20
            "
          />
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
                event.target.value,
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

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>
        </div>
      </div>
    </section>
  );
}
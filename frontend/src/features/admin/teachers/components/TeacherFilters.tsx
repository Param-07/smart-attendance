// src/features/admin/teachers/components/TeacherFilters.tsx

import { FilterX, Search } from "lucide-react";

import Input from "@/shared/components/Input";

import type { TeacherFiltersProps } from "./TeacherFilters.types";

export default function TeacherFilters({
  search = "",
  department = "",
  status = "",
  onSearchChange,
  onDepartmentChange,
  onStatusChange,
  onClearFilters,
}: TeacherFiltersProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        {/* Search */}

        <div className="w-full lg:max-w-sm">
          <Input
            placeholder="Search by name or employee code..."
            value={search}
            onChange={(e) =>
              onSearchChange?.(e.target.value)
            }
            leftIcon={<Search size={18} />}
          />
        </div>

        {/* Right Controls */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* Department */}

          <select
            value={department}
            onChange={(e) =>
              onDepartmentChange?.(
                e.target.value,
              )
            }
            className="
              h-9
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              text-sm
              transition-colors
              focus:border-primary
              focus:outline-none
              focus:ring-2
              focus:ring-blue-100
              sm:w-44
            "
          >
            <option value="">
              Department
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

          {/* Status */}

          <select
            value={status}
            onChange={(e) =>
              onStatusChange?.(
                e.target.value,
              )
            }
            className="
              h-9
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              text-sm
              transition-colors
              focus:border-primary
              focus:outline-none
              focus:ring-2
              focus:ring-blue-100
              sm:w-36
            "
          >
            <option value="">
              Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>
          </select>

          {/* Clear Filters */}

          <button
            type="button"
            onClick={onClearFilters}
            className="
              inline-flex
              h-12
              items-center
              gap-2
              whitespace-nowrap
              rounded-xl
              px-2
              text-sm
              font-medium
              text-slate-600
              transition-colors
              hover:text-primary
            "
          >
            <FilterX size={18} />

            <span>Clear Filters</span>
          </button>

        </div>

      </div>
    </div>
  );
}
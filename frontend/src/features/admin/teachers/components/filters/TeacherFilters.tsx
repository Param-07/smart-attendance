import Card from "@/shared/components/Card";
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
    <Card className="rounded-2xl border border-border bg-surface px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}

        <div className="w-full lg:max-w-sm">
          <Input
            placeholder="Search by name or employee code..."
            value={search}
            onChange={(event) =>
              onSearchChange?.(
                event.target.value,
              )
            }
            leftIcon={<Search size={18} />}
            className="h-12"
          />
        </div>

        {/* Right Controls */}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Department */}

          <select
            value={department}
            onChange={(event) =>
              onDepartmentChange?.(
                event.target.value,
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              text-sm
              text-slate-700
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

            <option value="Administration">
              Administration
            </option>

            <option value="Mathematics">
              Mathematics
            </option>

            <option value="Science">
              Science
            </option>

            <option value="English">
              English
            </option>

            <option value="Social Science">
              Social Science
            </option>

            <option value="Computer">
              Computer
            </option>

            <option value="Sports">
              Sports
            </option>

            <option value="Art">
              Art
            </option>

            <option value="Music">
              Music
            </option>

            <option value="Library">
              Library
            </option>
          </select>

          {/* System Status */}

          <select
            value={status}
            onChange={(event) =>
              onStatusChange?.(
                event.target.value as
                  | ""
                  | "ACTIVE"
                  | "INACTIVE",
              )
            }
            className="
              h-12
              w-full
              rounded-xl
              border
              border-border
              bg-surface
              px-4
              text-sm
              text-slate-700
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
              justify-center
              gap-2
              whitespace-nowrap
              rounded-xl
              px-3
              text-sm
              font-medium
              text-slate-600
              transition-colors
              hover:text-primary
            "
          >
            <FilterX size={18} />

            <span>
              Clear Filters
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
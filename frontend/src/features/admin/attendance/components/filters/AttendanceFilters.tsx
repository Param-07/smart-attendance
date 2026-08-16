import Card from "@/shared/components/Card";
import Input from "@/shared/components/Input";

import {
  CalendarDays,
  FilterX,
  Search,
} from "lucide-react";

import type {
  AttendanceFiltersProps,
} from "./AttendanceFilters.types";


export default function AttendanceFilters({
  search = "",
  status = "",
  startDate = "",
  endDate = "",
  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onClearFilters,
}: AttendanceFiltersProps) {
  return (
    <Card className="rounded-2xl border border-border bg-surface px-5 py-4">

      <div className="flex flex-col gap-4">

        {/* Filters */}

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          {/* Search */}

          <div className="w-full lg:max-w-md">
            <Input
              placeholder="Search by teacher or employee code..."
              value={search}
              onChange={(event) =>
                onSearchChange?.(
                  event.target.value,
                )
              }
              leftIcon={
                <Search size={18} />
              }
            />
          </div>


          {/* Status */}

          <select
            value={status}
            onChange={(event) =>
              onStatusChange?.(
                event.target.value,
              )
            }
            className="
              h-10
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
              lg:w-40
            "
          >
            <option value="">
              All Status
            </option>

            <option value="OPEN">
              Open
            </option>

            <option value="CLOSED">
              Closed
            </option>
          </select>


          {/* Start Date */}

          <div className="relative w-full lg:w-44">

            <CalendarDays
              size={17}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="date"
              value={startDate}
              onChange={(event) =>
                onStartDateChange?.(
                  event.target.value,
                )
              }
              className="
                h-10
                w-full
                rounded-xl
                border
                border-border
                bg-surface
                pl-10
                pr-3
                text-sm
                text-slate-700
                focus:border-primary
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          <span className="hidden text-sm text-slate-400 lg:block">
            to
          </span>


          {/* End Date */}

          <div className="relative w-full lg:w-44">

            <CalendarDays
              size={17}
              className="
                pointer-events-none
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="date"
              value={endDate}
              onChange={(event) =>
                onEndDateChange?.(
                  event.target.value,
                )
              }
              className="
                h-10
                w-full
                rounded-xl
                border
                border-border
                bg-surface
                pl-10
                pr-3
                text-sm
                text-slate-700
                focus:border-primary
                focus:outline-none
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>


          {/* Clear */}

          <button
            type="button"
            onClick={onClearFilters}
            className="
              inline-flex
              h-10
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
              hover:bg-slate-100
              hover:text-primary
            "
          >
            <FilterX size={17} />

            <span>
              Clear Filters
            </span>
          </button>

        </div>

      </div>

    </Card>
  );
}
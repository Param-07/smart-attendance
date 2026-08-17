import Card from "@/shared/components/Card";

import type { School } from "../School.types";

interface Props {
  school: School;
}


export default function SchoolOverview({
  school,
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
        School Overview
      </h2>

      <div className="mt-6">

        <div className="
          flex
          h-24
          w-24
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-border
          bg-slate-50
        ">

          {school.logoPath ? (
            <img
              src={school.logoPath}
              alt={`${school.name} logo`}
              className="
                h-full
                w-full
                object-contain
              "
            />
          ) : (
            <span className="
              text-2xl
              font-semibold
              text-slate-400
            ">
              {school.name
                .charAt(0)
                .toUpperCase()}
            </span>
          )}

        </div>


        <h3 className="
          mt-5
          text-xl
          font-semibold
          text-slate-900
        ">
          {school.name}
        </h3>

        <p className="
          mt-1
          text-sm
          text-slate-500
        ">
          {school.code}
        </p>


        <div className="mt-5">

          <span className={`
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            px-3
            py-1
            text-xs
            font-medium
            ${
              school.isActive
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-slate-100 text-slate-600"
            }
          `}>

            <span className={`
              h-1.5
              w-1.5
              rounded-full
              ${
                school.isActive
                  ? "bg-emerald-500"
                  : "bg-slate-400"
              }
            `} />

            {school.isActive
              ? "Active"
              : "Inactive"}

          </span>

        </div>

      </div>

    </Card>
  );
}
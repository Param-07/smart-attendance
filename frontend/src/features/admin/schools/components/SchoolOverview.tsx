import Card from "@/shared/components/Card";

import type { School } from "../School.types";

interface Props {
  school: School;
}

export default function SchoolOverview({ school }: Props) {
  return (
    <Card className="rounded-2xl border-outline-variant bg-surface-container-lowest p-0 shadow-sm overflow-hidden">
      <div className="p-6 flex flex-col items-center text-center">
        <div className="w-32 h-32 mb-4 rounded-full border-4 border-surface shadow-sm bg-surface-variant flex items-center justify-center overflow-hidden">
          {school.logoPath ? (
            <img
              src={school.logoPath}
              alt={`${school.name} logo`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-3xl font-semibold text-on-surface-variant">
              {school.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <h3 className="text-lg font-semibold text-on-background mb-1">
          {school.name}
        </h3>

        <div className="flex items-center gap-1 text-on-surface-variant text-sm mb-4">
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            tag
          </span>
          <span>{school.code}</span>
        </div>

        <span
          className={[
            "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border",
            school.isActive
              ? "bg-green-100 text-green-800 border-green-200"
              : "bg-surface-container-high text-on-surface-variant border-outline-variant",
          ].join(" ")}
        >
          <span
            className={[
              "w-1.5 h-1.5 rounded-full mr-1.5",
              school.isActive ? "bg-green-500" : "bg-outline",
            ].join(" ")}
          />
          {school.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      <div className="border-t border-outline-variant bg-surface-container-low p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              mail
            </span>
            <span className="truncate">{school.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-sm">
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>
              call
            </span>
            <span>{school.phone || "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
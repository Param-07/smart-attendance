import type { ReactNode } from "react";

import Card from "@/shared/components/Card";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;

  /** Material Symbols icon name, e.g. "face", "schedule", "location_on", "security" */
  icon?: string;

  /**
   * "default" — large section
   * "compact" — tighter side-rail section
   */
  variant?: "default" | "compact";
}

export default function SettingsSection({
  title,
  description,
  children,
  icon,
  variant = "default",
}: SettingsSectionProps) {
  const isCompact = variant === "compact";

  return (
    <Card
      className="
        overflow-hidden
        rounded-xl
        border
        border-outline-variant
        border-opacity-60
        bg-surface-container-lowest
        bg-opacity-95
        shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.03)]
        backdrop-blur-sm
      "
    >
      <div
        className={[
          isCompact
            ? "flex items-start gap-3 p-4"
            : "p-6",
          "border-b border-outline-variant border-opacity-60",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="flex-1">
          <div
            className={
              isCompact
                ? ""
                : "mb-1 flex items-center gap-2"
            }
          >
            {icon && (
              <span
                className="
                  material-symbols-outlined
                  text-blue-500
                "
                aria-hidden="true"
              >
                {icon}
              </span>
            )}

            <h2 className="text-base font-semibold text-on-surface">
              {title}
            </h2>
          </div>

          <p
            className={
              isCompact
                ? "mt-1 text-xs text-on-surface-variant"
                : "text-sm text-on-surface-variant"
            }
          >
            {description}
          </p>
        </div>
      </div>

      <div className="divide-y divide-outline-variant divide-opacity-40">
        {children}
      </div>
    </Card>
  );
}
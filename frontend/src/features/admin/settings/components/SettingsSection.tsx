import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  description: string;
  children: ReactNode;
  /** Material Symbols icon name, e.g. "face", "schedule", "location_on", "security" */
  icon?: string;
  /**
   * "default" — large section (Face Recognition, Attendance, GPS & Location): icon+title
   *   on one row, description below, generous padding.
   * "compact" — side-rail section (Security): icon beside a stacked title+description,
   *   tighter padding. Matches the Stitch layout's right-column card treatment.
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
    <section className="rounded-xl border border-outline-variant border-opacity-60 bg-surface-container-lowest bg-opacity-95 backdrop-blur-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-2px_rgba(0,0,0,0.03)] overflow-hidden">
      <div
        className={[
          isCompact ? "p-4" : "p-6",
          "border-b border-outline-variant border-opacity-60",
          isCompact ? "flex items-start gap-3" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {icon && isCompact && (
          <span className="material-symbols-outlined text-primary-container mt-0.5">
            {icon}
          </span>
        )}

        <div>
          <div className={isCompact ? "" : "flex items-center gap-2 mb-1"}>
            {icon && !isCompact && (
              <span className="material-symbols-outlined text-primary-container">
                {icon}
              </span>
            )}
            <h2 className="text-base font-semibold text-on-surface">{title}</h2>
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

      <div className="divide-y divide-outline-variant divide-opacity-40">{children}</div>
    </section>
  );
}
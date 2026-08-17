import type { SchoolConfiguration } from "../Settings.types";
import SettingsSection from "./SettingsSection";

interface Props {
  settings: SchoolConfiguration;
  editing: boolean;
  onChange: (
    field: keyof SchoolConfiguration,
    value: number,
  ) => void;
}

export default function SecuritySettings({
  settings,
  editing,
  onChange,
}: Props) {
  return (
    <SettingsSection
      icon="security"
      title="Security"
      description="Login protection and account lockout behavior."
      variant="compact"
    >
      <div className="flex flex-col gap-4 p-4">
        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Maximum Failed Login Attempts
          </label>

          <input
            type="number"
            min="1"
            disabled={!editing}
            value={settings.maxFailedLoginAttempts}
            onChange={(e) =>
              onChange("maxFailedLoginAttempts", Number(e.target.value))
            }
            className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Lockout Duration
          </label>

          <div className="relative">
            <input
              type="number"
              min="1"
              disabled={!editing}
              value={settings.lockoutDurationMinutes}
              onChange={(e) =>
                onChange("lockoutDurationMinutes", Number(e.target.value))
              }
              className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-16 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
              minutes
            </span>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
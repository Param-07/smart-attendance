import type { SchoolConfiguration } from "../Settings.types";
import SettingsSection from "./SettingsSection";
import SettingToggle from "./ConfigurationToggle";

interface Props {
  settings: SchoolConfiguration;
  editing: boolean;
  onChange: (
    field: keyof SchoolConfiguration,
    value: boolean | string,
  ) => void;
}

export default function AttendanceSettings({
  settings,
  editing,
  onChange,
}: Props) {
  return (
    <SettingsSection
      icon="schedule"
      title="Attendance"
      description="Control check-in, check-out and automatic checkout behavior."
    >
      <SettingToggle
        label="Allow Check-in"
        description="Allow teachers to record their attendance."
        checked={settings.allowCheckIn}
        disabled={!editing}
        onChange={(value) => onChange("allowCheckIn", value)}
      />

      <SettingToggle
        label="Allow Check-out"
        description="Allow teachers to record their checkout."
        checked={settings.allowCheckOut}
        disabled={!editing}
        onChange={(value) => onChange("allowCheckOut", value)}
      />

      <SettingToggle
        label="Automatic Checkout"
        description="Automatically close open attendance records at the configured time."
        checked={settings.autoCheckoutEnabled}
        disabled={!editing}
        onChange={(value) => onChange("autoCheckoutEnabled", value)}
      />

      {settings.autoCheckoutEnabled && (
        <div className="px-6 py-4">
          <label className="text-xs font-medium text-on-surface-variant">
            Automatic Checkout Time
          </label>

          <input
            type="time"
            disabled={!editing}
            value={settings.autoCheckoutTime ?? ""}
            onChange={(e) => onChange("autoCheckoutTime", e.target.value)}
            className="mt-2 h-10 w-full max-w-xs rounded-lg border border-outline-variant bg-surface-container-lowest px-3 font-mono text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
          />
        </div>
      )}
    </SettingsSection>
  );
}
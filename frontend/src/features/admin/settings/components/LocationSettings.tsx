import type { SchoolConfiguration } from "../Settings.types";
import SettingsSection from "./SettingsSection";
import SettingToggle from "./ConfigurationToggle";

interface Props {
  settings: SchoolConfiguration;
  editing: boolean;
  onChange: (
    field: keyof SchoolConfiguration,
    value: boolean | number | string,
  ) => void;
}

export default function LocationSettings({
  settings,
  editing,
  onChange,
}: Props) {
  return (
    <SettingsSection
      icon="location_on"
      title="GPS & Location"
      description="Configure location verification requirements and school coordinates."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <SettingToggle
          label="Require Check-in GPS"
          description="Teachers must provide their location when checking in."
          checked={settings.requireCheckInGps}
          disabled={!editing}
          onChange={(value) => onChange("requireCheckInGps", value)}
        />

        <SettingToggle
          label="Require Check-out GPS"
          description="Teachers must provide their location when checking out."
          checked={settings.requireCheckOutGps}
          disabled={!editing}
          onChange={(value) => onChange("requireCheckOutGps", value)}
        />
      </div>

      <div className="p-6 flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Allowed Radius
            </label>

            <div className="relative">
              <input
                type="number"
                min="1"
                disabled={!editing}
                value={settings.allowedRadius}
                onChange={(e) => onChange("allowedRadius", Number(e.target.value))}
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-10 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
                m
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              GPS Accuracy Threshold
            </label>

            <div className="relative">
              <input
                type="number"
                min="1"
                disabled={!editing}
                value={settings.gpsAccuracyThreshold}
                onChange={(e) =>
                  onChange("gpsAccuracyThreshold", Number(e.target.value))
                }
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-10 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant">
                m
              </span>
            </div>
          </div>
        </div>

        {/* Main Campus Location sub-card, matching Stitch's shaded nested box */}
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4">
          <h3 className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-on-surface">
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
              school
            </span>
            Main Campus Location
          </h3>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="0.00000001"
                disabled={!editing}
                value={settings.schoolLatitude ?? ""}
                onChange={(e) => onChange("schoolLatitude", e.target.value)}
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 font-mono text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="0.00000001"
                disabled={!editing}
                value={settings.schoolLongitude ?? ""}
                onChange={(e) => onChange("schoolLongitude", e.target.value)}
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 font-mono text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-on-surface-variant mb-1">
            Location Name
          </label>
          <input
            type="text"
            disabled={!editing}
            value={settings.locationName ?? ""}
            onChange={(e) => onChange("locationName", e.target.value)}
            placeholder="School campus"
            className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
          />
        </div>
      </div>
    </SettingsSection>
  );
}
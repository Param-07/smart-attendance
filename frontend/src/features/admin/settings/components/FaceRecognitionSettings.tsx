import type { SchoolConfiguration } from "../Settings.types";
import SettingsSection from "./SettingsSection";
import SettingToggle from "./ConfigurationToggle";

interface Props {
  settings: SchoolConfiguration;
  editing: boolean;
  onChange: (
    field: keyof SchoolConfiguration,
    value: boolean | number,
  ) => void;
}

export default function FaceRecognitionSettings({
  settings,
  editing,
  onChange,
}: Props) {
  return (
    <SettingsSection
      icon="face"
      title="Face Recognition"
      description="Configure face verification and liveness requirements for attendance."
    >
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <SettingToggle
          label="Require Check-in Face"
          description="Teachers must verify their face when checking in."
          checked={settings.requireCheckInFace}
          disabled={!editing}
          onChange={(value) => onChange("requireCheckInFace", value)}
        />

        <SettingToggle
          label="Require Check-out Face"
          description="Teachers must verify their face when checking out."
          checked={settings.requireCheckOutFace}
          disabled={!editing}
          onChange={(value) => onChange("requireCheckOutFace", value)}
        />

        <SettingToggle
          label="Require Liveness Detection"
          description="Verify that the submitted face belongs to a live person."
          checked={settings.requireLiveness}
          disabled={!editing}
          onChange={(value) => onChange("requireLiveness", value)}
        />

        <SettingToggle
          label="Allow Face Re-registration"
          description="Allow registered teacher faces to be replaced."
          checked={settings.allowFaceReregistration}
          disabled={!editing}
          onChange={(value) => onChange("allowFaceReregistration", value)}
        />
      </div>

      <div className="p-6">
        <div className="grid gap-5 sm:grid-cols-2 rounded-lg border border-outline-variant bg-surface-container-lowest p-4">
          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Face Match Threshold
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                disabled={!editing}
                value={settings.faceMatchThreshold}
                onChange={(e) =>
                  onChange("faceMatchThreshold", Number(e.target.value))
                }
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-8 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                %
              </span>
            </div>

            <p className="mt-1 text-xs text-on-surface-variant">
              Recommended: 0.60 – 0.75
            </p>
          </div>

          <div>
            <label className="block text-xs font-medium text-on-surface-variant mb-1">
              Liveness Threshold
            </label>

            <div className="relative">
              <input
                type="number"
                min="0"
                max="1"
                step="0.01"
                disabled={!editing}
                value={settings.livenessThreshold}
                onChange={(e) =>
                  onChange("livenessThreshold", Number(e.target.value))
                }
                className="h-10 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 pr-8 text-sm text-on-surface outline-none transition-shadow focus:ring-2 focus:ring-primary-container focus:ring-opacity-20 disabled:opacity-60"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
                %
              </span>
            </div>

            <p className="mt-1 text-xs text-on-surface-variant">
              Recommended: 0.75 – 0.90
            </p>
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}
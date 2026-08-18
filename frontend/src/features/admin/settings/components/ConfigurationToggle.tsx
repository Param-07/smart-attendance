interface SettingToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

export default function ConfigurationToggle({
  label,
  description,
  checked,
  disabled = false,
  onChange,
}: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-on-surface">{label}</p>

        {description && (
          <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          "relative inline-flex h-6 w-12 shrink-0 rounded-full",
          "border transition-colors duration-300 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-primary-container focus:ring-opacity-50",
          disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
          checked
            ? "bg-[#09933e] border-[#3ade79]"
            : "bg-gray-300 border-gray-400",
        ].join(" ")}
      >
        <span
          className={[
            "pointer-events-none inline-block h-5 w-5",
            "translate-y-0.5 rounded-full bg-white shadow-sm",
            "transition-transform duration-300 ease-in-out",
            checked ? "translate-x-6" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
import type {
  TeacherDetailsTab,
  TeacherDetailsTabsProps,
} from "./TeacherDetailsTabs.types";

const tabs: {
  id: TeacherDetailsTab;
  label: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
  },
  {
    id: "attendance",
    label: "Attendance",
  },
];

export default function TeacherDetailsTabs({
  activeTab,
  onTabChange,
}: TeacherDetailsTabsProps) {
  return (
    <div className="border-b border-border">
      <nav
        className="flex gap-6 overflow-x-auto"
        aria-label="Teacher details"
      >
        {tabs.map((tab) => {
          const isActive =
            activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                onTabChange(tab.id)
              }
              className={`
                whitespace-nowrap
                border-b-2
                px-2
                pb-3
                text-sm
                font-semibold
                transition-colors
                ${
                  isActive
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }
              `}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
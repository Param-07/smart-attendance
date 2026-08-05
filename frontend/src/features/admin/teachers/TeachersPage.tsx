import Button from "@/shared/components/Button";

import PageHeader from "@/shared/components/PageHeader";

import TeacherFilters from "./components/TeacherFilters";
import TeacherTable from "./components/TeacherTable";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
        <PageHeader
            title="Teachers"
            description="Manage teacher records, profiles, and account status."
            action={
                <Button >
                + Add Teacher
                </Button>
            }
        />

      <TeacherFilters />

      <TeacherTable />
    </div>
  );
}
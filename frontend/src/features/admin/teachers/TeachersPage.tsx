import Button from "@/shared/components/Button";
import PageHeader from "@/shared/components/PageHeader";

import TeacherFilters from "./components/filters/TeacherFilters";
import TeacherTable from "./components/table/TeacherTable";

import { teachers } from "./Teachers.constants";

export default function TeachersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records, profiles, and account status."
        action={
          <Button>
            + Add Teacher
          </Button>
        }
      />

      <TeacherFilters />

      <TeacherTable
        teachers={teachers}
        page={1}
        pageSize={20}
        totalRecords={teachers.length}
        totalPages={1}
        hasNext={false}
        hasPrevious={false}
        onPageChange={(page) => {
          console.log("Page:", page);
        }}
      />
    </div>
  );
}
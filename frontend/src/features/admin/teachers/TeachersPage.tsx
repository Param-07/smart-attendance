import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Button from "@/shared/components/Button";
import PageHeader from "@/shared/components/PageHeader";

import TeacherFilters from "./components/filters/TeacherFilters";
import TeacherTable from "./components/table/TeacherTable";
import TeacherStatusDialog from "./components/status/TeacherStatusDialog";

import { teachers } from "./Teachers.constants";
import type { Teacher } from "./Teachers.types";

export default function TeachersPage() {
  const navigate = useNavigate();

  const [statusTeacher, setStatusTeacher] =
        useState<Teacher | null> (null);

  const [isStatusSubmitting] =
        useState(false);
  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records, profiles, and account status."
        action={
          <Button
          onClick={() => navigate("/admin/teachers/new")}
          >
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
        onToggleStatus={(teacher) => {
          setStatusTeacher(teacher);
        }}
      />

      {statusTeacher && (
        <TeacherStatusDialog
          teacher={statusTeacher}
            isOpen={Boolean(statusTeacher)}
            onClose={() => {
              if (!isStatusSubmitting) {
                setStatusTeacher(null);
              }
            }}
            onConfirm={(teacher) => {
              console.log(
                "Toggle status:",
                teacher,
              );

              // API integration comes here.

              setStatusTeacher(null);
            }}
            isSubmitting={isStatusSubmitting}
        />
      )}
    </div>
  );
}
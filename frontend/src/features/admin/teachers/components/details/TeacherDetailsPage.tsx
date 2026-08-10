// src/features/admin/teachers/TeacherDetailsPage.tsx

import { useParams } from "react-router-dom";

import PageHeader from "@/shared/components/PageHeader";

import TeacherDetails from "./TeacherDetails";
import { teachers } from "../../Teachers.constants";

export default function TeacherDetailsPage() {
  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const teacher = teachers.find(
    (item) => item.id === publicUuid,
  );

  if (!teacher) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Teacher Not Found"
          description="The requested teacher could not be found."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teacher Details"
        description="View teacher profile and employment information."
      />

      <TeacherDetails teacher={teacher} />
    </div>
  );
}
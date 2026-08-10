import type { Teacher } from "./Teachers.types";

export const teachers: Teacher[] = [
  {
    id: "1",
    employeeCode: "EMP00124",
    firstName: "Sarah",
    lastName: "Jenkins",
    designation: "Senior Teacher",
    department: "Mathematics",
    email: "sarah.jenkins@school.com",
    phone: "+91 9876543210",
    status: "ACTIVE",
  },
  {
    id: "2",
    employeeCode: "EMP00125",
    firstName: "Michael",
    lastName: "Brown",
    designation: "Physics Teacher",
    department: "Science",
    email: "michael.brown@school.com",
    phone: "+91 9876543211",
    status: "ACTIVE",
  },
  {
    id: "3",
    employeeCode: "EMP00126",
    firstName: "Emily",
    lastName: "Clark",
    designation: "English Teacher",
    department: "English",
    email: "emily.clark@school.com",
    phone: "+91 9876543212",
    status: "INACTIVE",
  },
];
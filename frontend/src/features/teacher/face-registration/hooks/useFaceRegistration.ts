import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  deleteMyFace,
  getMyFaceRegistration,
  registerMyFace,
  updateMyFace,
} from "../api/face-registration.api";

const FACE_REGISTRATION_QUERY_KEY = [
  "teacher",
  "face-registration",
] as const;

export function useMyFaceRegistration() {
  return useQuery({
    queryKey: FACE_REGISTRATION_QUERY_KEY,
    queryFn: getMyFaceRegistration,
  });
}

export function useRegisterFace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerMyFace,

    onSuccess: (data) => {
      queryClient.setQueryData(
        FACE_REGISTRATION_QUERY_KEY,
        data,
      );
    },
  });
}

export function useUpdateFace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateMyFace,

    onSuccess: (data) => {
      queryClient.setQueryData(
        FACE_REGISTRATION_QUERY_KEY,
        data,
      );
    },
  });
}

export function useDeleteFace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyFace,

    onSuccess: () => {
      queryClient.setQueryData(
        FACE_REGISTRATION_QUERY_KEY,
        null,
      );
    },
  });
}
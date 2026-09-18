import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button/Button";
import Card from "@/shared/components/Card/Card";
import PageHeader from "@/shared/components/PageHeader/PageHeader";

import FaceRegistrationCamera from "./components/camera/FaceRegistrationCamera";
import FaceRegistrationInstructions from "./components/instructions/FaceRegistrationInstructions";
import FaceVerificationStatus from "./components/verification/FaceVerificationStatus";

import {
  useDeleteFace,
  useMyFaceRegistration,
  useRegisterFace,
  useUpdateFace,
} from "./hooks/useFaceRegistration";

import type {
  FaceRegistrationError,
  FaceRegistrationMode,
  FaceRegistrationStatus,
} from "./FaceRegistration.types";

export default function FaceRegistration() {
  const navigate = useNavigate();

  const {
    data: registeredFace,
    isLoading: isFaceLoading,
    isError: isFaceError,
    refetch: refetchFace,
  } = useMyFaceRegistration();

  const registerMutation = useRegisterFace();
  const updateMutation = useUpdateFace();
  const deleteMutation = useDeleteFace();

  const [status, setStatus] =
    useState<FaceRegistrationStatus>("capture");

  const [mode, setMode] =
    useState<FaceRegistrationMode>("register");

  const [error, setError] =
    useState<FaceRegistrationError | null>(null);

  const [capturedImage, setCapturedImage] =
    useState<Blob | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  /*
   * Create preview URL for captured selfie.
   */
  useEffect(() => {
    if (!capturedImage) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(capturedImage);

    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [capturedImage]);

  /*
   * Set the initial page state after checking
   * whether the teacher already has a registered face.
   *
   * Important:
   * - Existing face => success/registered screen.
   * - No face => capture screen.
   *
   * We do not change mode while an update is
   * actively in progress.
   */
  useEffect(() => {
    if (isFaceLoading) {
      return;
    }

    if (status === "review" || status === "processing") {
      return;
    }

    if (registeredFace) {
      setMode("register");
      setStatus("success");
      return;
    }

    setMode("register");
    setStatus("capture");
  }, [
    isFaceLoading,
    registeredFace,
    status,
  ]);

  /*
   * Capture selfie.
   */
  const handleCapture = (image: Blob) => {
    setError(null);
    setCapturedImage(image);
    setStatus("review");
  };

  /*
   * Camera errors.
   */
  const handleCameraError = (
    cameraError: string,
  ) => {
    setError(
      cameraError as FaceRegistrationError,
    );
    setStatus("error");
  };

  /*
   * Retake selfie.
   */
  const handleRetake = () => {
    setError(null);
    setCapturedImage(null);
    setStatus("capture");
  };

  /*
   * Register or update the captured face.
   */
  const handleContinue = async () => {
    if (!capturedImage) {
      return;
    }

    setError(null);
    setStatus("processing");

    try {
      if (mode === "update") {
        await updateMutation.mutateAsync(
          capturedImage,
        );
      } else {
        await registerMutation.mutateAsync(
          capturedImage,
        );
      }

      setCapturedImage(null);
      setStatus("success");
    } catch {
      setError("REGISTRATION_FAILED");
      setStatus("error");
    }
  };

  /*
   * Enter update mode.
   *
   * registeredFace remains in React Query cache,
   * but mode explicitly tells the page that the
   * current operation is an UPDATE.
   */
  const handleStartUpdate = () => {
    setError(null);
    setCapturedImage(null);
    setMode("update");
    setStatus("capture");
  };

  /*
   * Cancel update and return to the existing
   * registered-face screen.
   */
  const handleCancelUpdate = () => {
    setError(null);
    setCapturedImage(null);
    setMode("register");
    setStatus("success");
  };

  /*
   * Delete registered face.
   */
  const handleDelete = async () => {
    setError(null);

    try {
      await deleteMutation.mutateAsync();

      setCapturedImage(null);
      setMode("register");
      setStatus("capture");
    } catch {
      setError("REGISTRATION_FAILED");
      setStatus("error");
    }
  };

  /*
   * Return to previous page.
   */
  const handleBack = () => {
    navigate(-1);
  };

  /*
   * Retry registration lookup.
   */
  const handleRetryLoading = () => {
    refetchFace();
  };

  const errorMessages: Record<
    FaceRegistrationError,
    string
  > = {
    CAMERA_PERMISSION_DENIED:
      "Camera permission was denied. Please allow camera access and try again.",

    CAMERA_UNAVAILABLE:
      "Unable to access your camera. Check your browser permissions and try again.",

    CAPTURE_FAILED:
      "We could not capture your photo. Please try again.",

    NO_FACE_DETECTED:
      "No face was detected. Position your face clearly inside the frame and try again.",

    MULTIPLE_FACES_DETECTED:
      "Multiple faces were detected. Make sure only your face is visible and try again.",

    POOR_FACE_QUALITY:
      "The photo quality is not sufficient. Improve the lighting and make sure your face is clearly visible.",

    LIVENESS_FAILED:
      "Liveness verification failed. Please try again.",

    REGISTRATION_FAILED:
      mode === "update"
        ? "We could not update your registered face. Please try again."
        : "Face registration failed. Please try again.",
  };

  const isProcessing =
    registerMutation.isPending ||
    updateMutation.isPending;

  const isDeleting =
    deleteMutation.isPending;

  /*
   * ==========================================================
   * INITIAL LOADING
   * ==========================================================
   */
  if (isFaceLoading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Face Registration"
          description="Register your face for secure attendance verification."
        />

        <Card>
          <div className="flex min-h-75 flex-col items-center justify-center gap-4 px-5 text-center">
            <Loader2
              className="h-8 w-8 animate-spin text-blue-600"
              aria-hidden="true"
            />

            <div>
              <p className="font-medium text-slate-900">
                Checking registration status
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Please wait...
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ==========================================================
   * INITIAL QUERY ERROR
   * ==========================================================
   */
  if (isFaceError) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Face Registration"
          description="Register your face for secure attendance verification."
        />

        <Card>
          <div className="flex min-h-75 flex-col items-center justify-center gap-5 px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <ShieldCheck
                className="h-7 w-7 text-red-600"
                aria-hidden="true"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Unable to load registration
              </h2>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                We could not determine your current face
                registration status.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleRetryLoading}
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ==========================================================
   * ERROR STATE
   * ==========================================================
   */
  if (status === "error" && error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title={
            mode === "update"
              ? "Update Face"
              : "Face Registration"
          }
          description={
            mode === "update"
              ? "Replace your existing registered face."
              : "Register your face for secure attendance verification."
          }
        />

        <Card>
          <div className="flex min-h-75 flex-col items-center justify-center px-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <ShieldCheck
                className="h-7 w-7 text-red-600"
                aria-hidden="true"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-slate-900">
              Verification failed
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {errorMessages[error]}
            </p>

            <div className="mt-6 flex w-full max-w-xs flex-col gap-3">
              <Button
                type="button"
                onClick={handleRetake}
              >
                Try Again
              </Button>

              {mode === "update" && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelUpdate}
                >
                  Cancel Update
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ==========================================================
   * PROCESSING STATE
   * ==========================================================
   */
  if (status === "processing") {
    return (
      <div className="space-y-6">
        <PageHeader
          title={
            mode === "update"
              ? "Updating Face"
              : "Registering Face"
          }
          description="Please keep this page open while your selfie is being verified."
        />

        <Card>
          <div className="px-4 py-6 sm:px-6">
            <FaceVerificationStatus
              currentStep="processing"
            />
          </div>
        </Card>
      </div>
    );
  }

  /*
   * ==========================================================
   * REGISTERED FACE / SUCCESS STATE
   * ==========================================================
   *
   * This state is shown only when a face exists.
   *
   * There is intentionally NO "Register Face" button here.
   */
  console.log("Registered face:", registeredFace?.image_url);
  if (
    status === "success" &&
    registeredFace
  ) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Face Registration"
          description="Your registered face is used for attendance verification."
        />

        <Card>
          <div className="px-4 py-6 sm:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2
                  className="h-8 w-8 text-emerald-600"
                  aria-hidden="true"
                />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                Face registered
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Your face is registered and ready for
                attendance verification.
              </p>

              <div className="mt-6 w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="aspect-square w-full">
                  <img
                    src={registeredFace.image_url}
                    alt="Your registered face"
                    className="h-full w-full object-cover"
                  />
                </div>

                <div className="flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-3 text-left">
                  <ImageIcon
                    className="h-5 w-5 shrink-0 text-slate-500"
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">
                      Registered selfie
                    </p>

                    <p className="text-xs text-slate-500">
                      Face verification ready
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex w-full max-w-sm flex-col gap-3">
                <Button
                  type="button"
                  onClick={handleStartUpdate}
                >
                  <RefreshCw
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Update Face
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2
                        className="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      Delete Face
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3 px-4 py-4 sm:px-6">
            <LockKeyhole
              className="mt-0.5 h-5 w-5 shrink-0 text-slate-500"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-slate-900">
                Your face data is protected
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Your registered selfie is securely stored and
                used only for attendance verification.
              </p>
            </div>
          </div>
        </Card>

        <div className="flex justify-start">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
          >
            <ArrowLeft
              className="mr-2 h-4 w-4"
              aria-hidden="true"
            />
            Back
          </Button>
        </div>
      </div>
    );
  }

  /*
   * ==========================================================
   * CAPTURE / REVIEW
   * ==========================================================
   */
  const isReviewing =
    status === "review" &&
    Boolean(
      capturedImage &&
        previewUrl,
    );

  return (
    <div className="space-y-6">
      <PageHeader
        title={
          mode === "update"
            ? "Update Face"
            : "Face Registration"
        }
        description={
          mode === "update"
            ? "Capture a new selfie to replace your current registration."
            : "Register your face for secure attendance verification."
        }
      />

      {mode === "update" && (
        <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex items-start gap-3">
            <RefreshCw
              className="mt-0.5 h-5 w-5 shrink-0 text-blue-600"
              aria-hidden="true"
            />

            <div>
              <p className="text-sm font-medium text-blue-900">
                Updating your registered face
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Capture a clear selfie. Your new face will
                replace the currently registered one after
                successful verification.
              </p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <div className="px-4 py-5 sm:px-6">
          {!isReviewing ? (
            <>
              <FaceRegistrationInstructions />

              <div className="mt-6">
                <FaceRegistrationCamera
                  onCapture={handleCapture}
                  onError={handleCameraError}
                  disabled={isProcessing}
                />
              </div>
            </>
          ) : (
            <div>
              <div className="overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={previewUrl!}
                  alt="Captured selfie preview"
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="mt-5 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Review your selfie
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Make sure your face is clearly visible before
                  continuing.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRetake}
                  disabled={isProcessing}
                >
                  Retake
                </Button>

                <Button
                  type="button"
                  onClick={handleContinue}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />

                      {mode === "update"
                        ? "Updating..."
                        : "Registering..."}
                    </>
                  ) : mode === "update" ? (
                    "Update Face"
                  ) : (
                    "Register Face"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-3 px-4 py-4 sm:px-6">
          <LockKeyhole
            className="mt-0.5 h-5 w-5 shrink-0 text-slate-500"
            aria-hidden="true"
          />

          <div>
            <p className="text-sm font-medium text-slate-900">
              Secure verification
            </p>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Your selfie is verified for face quality and
              liveness before it is registered.
            </p>
          </div>
        </div>
      </Card>

      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={
            mode === "update"
              ? handleCancelUpdate
              : handleBack
          }
        >
          <ArrowLeft
            className="mr-2 h-4 w-4"
            aria-hidden="true"
          />

          {mode === "update"
            ? "Cancel Update"
            : "Back"}
        </Button>
      </div>
    </div>
  );
}
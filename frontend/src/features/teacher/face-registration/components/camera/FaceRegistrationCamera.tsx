import { Camera, RotateCcw, Video, VideoOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import Button from "@/shared/components/Button/Button";

import type { FaceRegistrationCameraProps } from "./FaceRegistrationCamera.types";

type CameraState = "idle" | "requesting" | "ready" | "error";

export default function FaceRegistrationCamera({
  onCapture,
  onError,
  disabled = false,
}: FaceRegistrationCameraProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mountedRef = useRef(false);
  const startingRef = useRef(false);

  const [cameraState, setCameraState] = useState<CameraState>("idle");
  const [isCapturing, setIsCapturing] = useState(false);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (mountedRef.current) {
      setCameraState("idle");
    }
  }, []);

  const startCamera = useCallback(async () => {
    if (disabled || startingRef.current) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      onError("CAMERA_UNAVAILABLE");
      return;
    }

    startingRef.current = true;
    setCameraState("requesting");

    try {
      // Stop an existing stream before requesting a new one.
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
        audio: false,
      });

      // The component may have unmounted while the permission prompt was open.
      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      const video = videoRef.current;

      if (!video) {
        stream.getTracks().forEach((track) => track.stop());
        throw new Error("Camera preview is unavailable.");
      }

      streamRef.current = stream;
      video.srcObject = stream;

      await new Promise<void>((resolve, reject) => {
        const handleLoadedMetadata = () => {
          cleanup();
          resolve();
        };

        const handleError = () => {
          cleanup();
          reject(new Error("Unable to load the camera preview."));
        };

        const cleanup = () => {
          video.removeEventListener(
            "loadedmetadata",
            handleLoadedMetadata,
          );
          video.removeEventListener("error", handleError);
        };

        if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
          resolve();
          return;
        }

        video.addEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
          {
            once: true,
          },
        );

        video.addEventListener("error", handleError, {
          once: true,
        });
      });

      if (
        !mountedRef.current ||
        streamRef.current !== stream
      ) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      await video.play();

      if (mountedRef.current) {
        setCameraState("ready");
      }
    } catch (error) {
      if (!mountedRef.current) {
        return;
      }

      console.error("Unable to access camera:", error);

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      setCameraState("error");

      if (
        error instanceof DOMException &&
        error.name === "NotAllowedError"
      ) {
        onError("CAMERA_PERMISSION_DENIED");
      } else {
        onError("CAMERA_UNAVAILABLE");
      }
    } finally {
      startingRef.current = false;
    }
  }, [disabled, onError]);

  const capture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (
      !video ||
      !canvas ||
      cameraState !== "ready"
    ) {
      onError("CAPTURE_FAILED");
      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      onError("CAPTURE_FAILED");
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      onError("CAPTURE_FAILED");
      return;
    }

    setIsCapturing(true);

    // Preserve the camera's native aspect ratio.
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.drawImage(
      video,
      0,
      0,
      video.videoWidth,
      video.videoHeight,
    );

    canvas.toBlob(
      (blob) => {
        setIsCapturing(false);

        if (!blob) {
          onError("CAPTURE_FAILED");
          return;
        }

        const file = new File(
          [blob],
          `face-registration-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          },
        );

        onCapture(file);
      },
      "image/jpeg",
      0.92,
    );
  }, [cameraState, onCapture, onError]);

  useEffect(() => {
    mountedRef.current = true;

    void startCamera();

    return () => {
      mountedRef.current = false;
      startingRef.current = false;

      streamRef.current
        ?.getTracks()
        .forEach((track) => track.stop());

      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [startCamera]);

  const isReady = cameraState === "ready";
  const isRequesting = cameraState === "requesting";
  const hasError = cameraState === "error";

  return (
    <div className="space-y-4">
      {/* Camera viewport */}
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-slate-900">
        <video
          ref={videoRef}
          muted
          playsInline
          autoPlay
          aria-label="Live camera preview for face registration"
          className={`absolute inset-0 h-full w-full object-cover ${
            isReady
              ? "scale-x-[-1]"
              : "opacity-0"
          }`}
        />

        {/* Requesting camera */}
        {isRequesting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
            <div className="mb-3 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

            <p className="text-sm font-semibold">
              Starting camera…
            </p>

            <p className="mt-1 max-w-xs text-xs text-slate-300">
              Please allow camera access when your browser asks.
            </p>
          </div>
        )}

        {/* Camera error */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
            <VideoOff className="mb-3 h-8 w-8 text-slate-300" />

            <p className="text-sm font-semibold">
              Camera unavailable
            </p>

            <p className="mt-1 max-w-xs text-xs text-slate-300">
              Allow camera access and try again.
            </p>
          </div>
        )}

        {/* Idle */}
        {cameraState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
            <Video className="mb-3 h-8 w-8 text-slate-300" />

            <p className="text-sm font-semibold">
              Camera is ready to start
            </p>
          </div>
        )}

        {/* Active camera UI */}
        {isReady && (
          <>
            {/* Corner markers */}
            <div className="pointer-events-none absolute inset-5 flex flex-col justify-between sm:inset-8">
              <div className="flex justify-between">
                <span className="h-8 w-8 rounded-tl-lg border-l-2 border-t-2 border-white/90" />

                <span className="h-8 w-8 rounded-tr-lg border-r-2 border-t-2 border-white/90" />
              </div>

              <div className="flex justify-between">
                <span className="h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-white/90" />

                <span className="h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-white/90" />
              </div>
            </div>

            {/* Face positioning guide */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-[68%] w-[44%] rounded-[48%] border-2 border-dashed border-white/90 shadow-[0_0_0_9999px_rgba(15,23,42,0.18)]" />
            </div>

            {/* Camera status */}
            <div className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-60" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-400" />
              </span>

              Camera ready
            </div>

            {/* Positioning message */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950/75 px-4 py-2 text-xs font-medium text-white backdrop-blur">
              Position your face inside the frame
            </div>
          </>
        )}
      </div>

      {/* Hidden capture canvas */}
      <canvas
        ref={canvasRef}
        className="hidden"
        aria-hidden="true"
      />

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          fullWidth
          disabled={
            disabled ||
            isRequesting ||
            isCapturing
          }
          loading={isRequesting}
          leftIcon={<Camera size={18} />}
          onClick={() => void startCamera()}
        >
          {isReady
            ? "Restart Camera"
            : "Start Camera"}
        </Button>

        <Button
          type="button"
          fullWidth
          variant="secondary"
          disabled={!isReady || disabled}
          loading={isCapturing}
          onClick={capture}
        >
          Capture Face
        </Button>
      </div>

      {/* Stop camera */}
      {isReady && (
        <button
          type="button"
          onClick={stopCamera}
          disabled={disabled || isCapturing}
          className="mx-auto flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw size={16} />
          Stop camera
        </button>
      )}
    </div>
  );
}
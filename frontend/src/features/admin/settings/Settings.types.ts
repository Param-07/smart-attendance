export interface SchoolConfiguration {
  id: string;
  schoolId: string;
  version: number;

  requireCheckInFace: boolean;
  requireCheckOutFace: boolean;
  requireLiveness: boolean;

  livenessThreshold: number;
  allowFaceReregistration: boolean;
  faceMatchThreshold: number;

  allowCheckIn: boolean;
  allowCheckOut: boolean;

  autoCheckoutEnabled: boolean;
  autoCheckoutTime: string | null;

  requireCheckInGps: boolean;
  requireCheckOutGps: boolean;

  allowedRadius: number;
  gpsAccuracyThreshold: number;

  maxFailedLoginAttempts: number;
  lockoutDurationMinutes: number;

  schoolLatitude: number | null;
  schoolLongitude: number | null;
  locationName: string | null;

  createdAt: string;
  updatedAt: string;
}
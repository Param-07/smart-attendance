export interface School {
  id: string;

  name: string;
  code: string;

  email: string | null;
  phone: string | null;
  website: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postalCode: string | null;

  logoPath: string | null;
  timezone: string;

  isActive: boolean;

  createdAt: string;
  updatedAt: string;
}
export interface SchoolResponseDto {
  public_uuid: string;

  name: string;
  code: string;

  email: string | null;
  phone: string | null;
  website: string | null;

  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  postal_code: string | null;

  logo_path: string | null;
  timezone: string;

  is_active: boolean;

  created_at: string;
  updated_at: string;
}

export interface UpdateSchoolRequest {
  name: string;
  code: string;

  email?: string | null;
  phone?: string | null;
  website?: string | null;

  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string;
  postal_code?: string | null;

  timezone?: string;
}
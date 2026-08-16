export type AlertSeverity =
  | "success"
  | "warning"
  | "critical";

export interface SystemAlert {
  id: string;

  title: string;

  description: string;

  severity: AlertSeverity;
}

export interface SystemAlertsProps {
  alerts: SystemAlert[];
}
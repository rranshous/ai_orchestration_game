export interface Notification {
  id: string;
  type: "info" | "success" | "error";
  message: string;
  duration?: number; // Optional duration in milliseconds
}

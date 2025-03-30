export interface Notification {
  id: string;
  type: "info" | "success" | "error";
  message: string;
}

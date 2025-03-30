export enum AgentType {
  PRODUCT_VISION = "product_vision",
  CODE_WRITER = "code_writer",
  VERIFICATION_AI = "verification_ai",
  BOSS = "boss"
}

export interface AgentResponse {
  content: string;
  status: "accepted" | "rejected" | "needs_revision";
  message?: string;
}

/**
 * Business-info service: thin wrapper over chatService.detectBusinessInfo
 * for the AssistantPanel.
 */
import { chatService } from "./chat.service";

export interface DetectedBusinessInfo {
  key: string;
  value: string;
  category?:
    | "supplier"
    | "return"
    | "shipping"
    | "market"
    | "order"
    | "discount"
    | "other";
  confidence?: number;
}

export const businessInfoService = {
  async detect(text: string): Promise<DetectedBusinessInfo | null> {
    return chatService.detectBusinessInfo(text);
  },
};

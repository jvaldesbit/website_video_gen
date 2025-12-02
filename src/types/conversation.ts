export type DeviceType = 'iphone15' | 'android' | 'tablet' | 'desktop';
export type ThemeType = 'whatsapp-light' | 'whatsapp-dark';
export type SenderType = 'user' | 'vi';

export interface Message {
  id: number;
  sender: SenderType;
  text?: string;
  image?: string;
  timestamp: string;
}

export interface Settings {
  autoplaySpeed: number;
  showAvatar: boolean;
  showTicks: boolean;
  borderColor?: string;
}

export interface ConversationConfig {
  device: DeviceType;
  theme: ThemeType;
  conversation: Message[];
  settings: Settings;
}

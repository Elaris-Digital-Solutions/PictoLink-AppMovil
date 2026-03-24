// ─── Pictogram types ─────────────────────────────────────────────────────────

export interface PictoNode {
  id: string;
  label: string;
  color?: string;          // hex or tailwind color token
  icon?: string;           // emoji fallback while image loads
  arasaacId?: number;      // ARASAAC numeric ID → image URL
  isFolder?: boolean;      // true = navigates deeper; false = adds to sentence
  pictograms?: PictoNode[]; // leaf pictograms inside this node
  children?: PictoNode[];  // sub-folders
  folderId?: string;       // AAC grid: target page ID for folder/navigation cells
  action?: string;         // AAC grid: 'speak' | 'navigate' | 'back' | 'clear'
}

export interface PictogramCatalog {
  version: string;
  categories: PictoNode[];
}

// ─── User profile ─────────────────────────────────────────────────────────────

export type CommunicationMode = 'communicator' | 'caregiver' | 'therapist';
export type UserType = 'communicator' | 'companion' | 'institution';
export type Plan = 'free' | 'basic' | 'premium';

export interface Profile {
  id: string;
  display_name: string;
  avatar_emoji: string;
  mode: CommunicationMode;
  color_theme: string;
  grid_columns: number;   // 3 | 4 | 5
  tts_enabled: boolean;
  tts_rate: number;       // 0.5 – 2.0
  tts_voice?: string;     // SpeechSynthesis voiceURI
  created_at: string;
  user_type?: UserType;
  plan_type?: Plan;
}

// ─── Messaging ────────────────────────────────────────────────────────────────

export type MessageType = 'text' | 'pictogram_sequence' | 'mixed';

export interface PictogramMessagePayload {
  pictograms: Array<{
    id: string;
    label: string;
    arasaacId?: number;
  }>;
  generatedText: string;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  type: MessageType;
  content: string; // JSON string for pictogram_sequence
  created_at: string;
  profiles?: Pick<Profile, 'display_name' | 'avatar_emoji'>;
}

export interface Room {
  id: string;
  name: string | null;
  created_by: string;
  created_at: string;
  members?: Profile[];
}

// ─── Board store ──────────────────────────────────────────────────────────────

export interface BoardState {
  sentence: PictoNode[];
  categoryPath: string[];
  currentItems: PictoNode[];
}

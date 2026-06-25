export interface Wish {
  id: string;
  name: string;
  message: string;
  relation: 'family' | 'friend' | 'professor' | 'classmate' | 'other';
  timestamp: number;
  avatarSeed: string; // seed for generic avatar coloring or icons
}

export interface RSVP {
  id: string;
  name: string;
  email: string;
  isAttending: boolean;
  guestsCount: number;
  relation: string;
  message?: string;
  timestamp: number;
}

export interface GraduationEvent {
  title: string;
  graduateName: string;
  degreeName: string;
  honors: string;
  universityName: string;
  date: string; // ISO string or readable text
  ceremonyTime: string;
  receptionTime: string;
  venueName: string;
  venueAddress: string;
  mapEmbedUrl: string;
  lat: number;
  lng: number;
  rsvpDeadline: string;
}

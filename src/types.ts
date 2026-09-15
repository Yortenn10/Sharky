export type PageStage = 'intro' | 'main' | 'memories' | 'affirmation' | 'wishes';

export type AudioTrackId = 'ocean_waves' | 'calm_piano' | 'baby_shark_musicbox';

export interface MemoryItem {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  caption: string;
  tag?: string;
}

export interface AffirmationItem {
  id: string;
  title: string;
  text: string;
  category: 'semangat' | 'apresiasi' | 'pelukan' | 'mimpi';
  from: string;
}

export interface WishItem {
  id: string;
  category: 'Cita-cita' | 'Harapan Tahun Ini' | 'Doa Bahagia';
  content: string;
  date: string;
  bottleColor: 'cyan' | 'pink' | 'amber' | 'emerald';
}

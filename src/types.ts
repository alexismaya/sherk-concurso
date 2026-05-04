export type Category = 'kids' | 'adults';
export type Phase = 'registration' | 'parade' | 'voting' | 'results';

export type Participant = {
  id: string;
  name: string;
  // @ts-ignore
  photoUrl: string;
  category: Category;
  votes: number;
};

export interface ParadeTimerConfig {
  duration: number;
}

export type ContestState = {
  phase: Phase;
  participants: Record<string, Participant>;
  paradeQueue: string[];
  currentParadeIndex: number;
  votedDevices?: Record<string, Record<Category, boolean>>;
  paradeTimer?: ParadeTimerConfig;
};

import { createContext, useContext, useEffect, useReducer, useRef, ReactNode } from 'react';
import { ref, onValue, set, update, push, remove, runTransaction, Unsubscribe } from 'firebase/database';
import { db } from '../firebase';
import { ContestState, Phase, Participant, Category, ParadeTimerConfig } from '../types';
import { shuffleArray } from '../utils/shuffle';

const ROOT = 'shrek-contest';

const initialState: ContestState = {
  phase: 'registration',
  participants: {},
  paradeQueue: [],
  currentParadeIndex: 0,
};

type Action =
  | { type: 'SYNC'; payload: ContestState }
  | { type: 'SYNC_PHASE'; payload: Phase }
  | { type: 'SYNC_PARTICIPANTS'; payload: Record<string, Participant> }
  | { type: 'SYNC_PARADE_QUEUE'; payload: string[] }
  | { type: 'SYNC_PARADE_INDEX'; payload: number }
  | { type: 'SYNC_VOTED_DEVICES'; payload: Record<string, Record<Category, boolean>> }
  | { type: 'SYNC_PARADE_TIMER'; payload: ParadeTimerConfig };

function reducer(state: ContestState, action: Action): ContestState {
  switch (action.type) {
    case 'SYNC':
      return { ...state, ...action.payload };
    case 'SYNC_PHASE':
      return { ...state, phase: action.payload };
    case 'SYNC_PARTICIPANTS':
      return { ...state, participants: action.payload };
    case 'SYNC_PARADE_QUEUE':
      return { ...state, paradeQueue: action.payload };
    case 'SYNC_PARADE_INDEX':
      return { ...state, currentParadeIndex: action.payload };
    case 'SYNC_VOTED_DEVICES':
      return { ...state, votedDevices: action.payload };
    case 'SYNC_PARADE_TIMER':
      return { ...state, paradeTimer: action.payload };
    default:
      return state;
  }
}

const ContestContext = createContext<ContestState>(initialState);
const ContestActionsContext = createContext<ReturnType<typeof makeActions> | null>(null);

function makeActions() {
  return {
    async addParticipant(p: { name: string; category: Category; photoBase64: string }) {
      const newRef = push(ref(db, `${ROOT}/participants`));
      const id = newRef.key!;

      const { ref: storageRef, uploadString, getDownloadURL } = await import('firebase/storage');
      const { storage } = await import('../firebase');
      const photoRef = storageRef(storage, `photos/${id}.jpg`);

      await uploadString(photoRef, p.photoBase64, 'data_url');
      const photoUrl = await getDownloadURL(photoRef);

      await set(newRef, { id, name: p.name, category: p.category, photoUrl, votes: 0 });
    },

    async removeParticipant(id: string) {
      await remove(ref(db, `${ROOT}/participants/${id}`));
    },

    async setPhase(phase: Phase, participants?: Record<string, Participant>) {
      const updates: Record<string, any> = { [`${ROOT}/phase`]: phase };
      if (phase === 'parade' && participants) {
        const participantArray = Object.values(participants);
        const kids = shuffleArray(
          participantArray.filter(p => p.category === 'kids').map(p => p.id)
        );
        const adults = shuffleArray(
          participantArray.filter(p => p.category === 'adults').map(p => p.id)
        );
        updates[`${ROOT}/paradeQueue`] = [...kids, ...adults];
        updates[`${ROOT}/currentParadeIndex`] = 0;
      }
      await update(ref(db), updates);
    },

    async nextParadeStep(currentIndex: number) {
      await set(ref(db, `${ROOT}/currentParadeIndex`), currentIndex + 1);
    },

    async castVote(participantId: string, category: Category, fingerprint: string) {
      const votedRef = ref(db, `${ROOT}/votedDevices/${fingerprint}/${category}`);
      const votesRef = ref(db, `${ROOT}/participants/${participantId}/votes`);

      await runTransaction(votedRef, (current) => {
        if (current === true) return;
        return true;
      }).then(async (result) => {
        if (result.committed) {
          await runTransaction(votesRef, (v) => (v || 0) + 1);
        }
      });
    },

    async setParadeTimerDuration(duration: number) {
      await set(ref(db, `${ROOT}/paradeTimer/duration`), duration);
    },

    async reset() {
      await set(ref(db, ROOT), {
        phase: 'registration',
        participants: {},
        paradeQueue: [],
        currentParadeIndex: 0,
        votedDevices: {},
      });
    },
  };
}

export function ContestProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const listenersRef = useRef<{
    phase?: Unsubscribe;
    participants?: Unsubscribe;
    paradeQueue?: Unsubscribe;
    currentParadeIndex?: Unsubscribe;
    votedDevices?: Unsubscribe;
    paradeTimer?: Unsubscribe;
  }>({});

  useEffect(() => {
    // Always-on listeners
    listenersRef.current.phase = onValue(ref(db, `${ROOT}/phase`), (snapshot) => {
      const data = snapshot.val();
      if (data != null) dispatch({ type: 'SYNC_PHASE', payload: data as Phase });
    });

    listenersRef.current.participants = onValue(ref(db, `${ROOT}/participants`), (snapshot) => {
      const data = snapshot.val();
      dispatch({ type: 'SYNC_PARTICIPANTS', payload: data ?? {} });
    });

    listenersRef.current.votedDevices = onValue(ref(db, `${ROOT}/votedDevices`), (snapshot) => {
      const data = snapshot.val();
      dispatch({ type: 'SYNC_VOTED_DEVICES', payload: data ?? {} });
    });

    listenersRef.current.paradeTimer = onValue(ref(db, `${ROOT}/paradeTimer`), (snapshot) => {
      const data = snapshot.val();
      if (data != null) dispatch({ type: 'SYNC_PARADE_TIMER', payload: data as ParadeTimerConfig });
    });

    // Parade-specific listeners (subscribed initially)
    subscribeParadeListeners();

    return () => {
      // Clean up all listeners on unmount
      Object.values(listenersRef.current).forEach((unsub) => unsub?.());
      listenersRef.current = {};
    };
  }, []);

  // Conditional subscription: unsubscribe parade listeners during voting phase
  useEffect(() => {
    if (state.phase === 'voting') {
      unsubscribeParadeListeners();
    } else {
      subscribeParadeListeners();
    }
  }, [state.phase]);

  function subscribeParadeListeners() {
    if (!listenersRef.current.paradeQueue) {
      listenersRef.current.paradeQueue = onValue(ref(db, `${ROOT}/paradeQueue`), (snapshot) => {
        const data = snapshot.val();
        dispatch({ type: 'SYNC_PARADE_QUEUE', payload: data ?? [] });
      });
    }

    if (!listenersRef.current.currentParadeIndex) {
      listenersRef.current.currentParadeIndex = onValue(ref(db, `${ROOT}/currentParadeIndex`), (snapshot) => {
        const data = snapshot.val();
        dispatch({ type: 'SYNC_PARADE_INDEX', payload: data ?? 0 });
      });
    }
  }

  function unsubscribeParadeListeners() {
    if (listenersRef.current.paradeQueue) {
      listenersRef.current.paradeQueue();
      listenersRef.current.paradeQueue = undefined;
    }
    if (listenersRef.current.currentParadeIndex) {
      listenersRef.current.currentParadeIndex();
      listenersRef.current.currentParadeIndex = undefined;
    }
  }

  const actions = makeActions();

  return (
    <ContestContext.Provider value={state}>
      <ContestActionsContext.Provider value={actions}>
        {children}
      </ContestActionsContext.Provider>
    </ContestContext.Provider>
  );
}

export const useContest = () => useContext(ContestContext);
export const useContestActions = () => {
  const actions = useContext(ContestActionsContext);
  if (!actions) throw new Error('useContestActions must be used within ContestProvider');
  return actions;
};

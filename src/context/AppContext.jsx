import React, { createContext, useReducer, useEffect, useCallback, useRef, useContext } from 'react';
import { readFile, upsertFile } from '../services/github';
import { format } from 'date-fns';

export const AppContext = createContext();

const initialState = {
  token: '',
  repo: '',
  protocol: null,
  todayLog: null,
  cycles: null,
  inventory: null,
  loading: false,
  error: null,
  isOnline: true,
  pendingSync: [],
  darkMode: true,
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_REPO':
      return { ...state, repo: action.payload };
    case 'SET_PROTOCOL':
      return { ...state, protocol: action.payload };
    case 'SET_TODAY_LOG':
      return { ...state, todayLog: action.payload };
    case 'SET_CYCLES':
      return { ...state, cycles: action.payload };
    case 'SET_INVENTORY':
      return { ...state, inventory: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'ADD_PENDING_SYNC':
      return { ...state, pendingSync: [...state.pendingSync, action.payload] };
    case 'CLEAR_PENDING_SYNC':
      return { ...state, pendingSync: [] };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'MARK_DOSE_TAKEN': {
      if (!state.todayLog) return state;
      const updated = { ...state.todayLog };
      const entry = updated.entries[0];
      if (entry) {
        const dose = entry.doses.find(d => d.id === action.payload.doseId);
        if (dose && !dose.taken) {
          dose.taken = true;
          dose.timestamp = new Date().toISOString();
        }
      }
      return { ...state, todayLog: updated };
    }
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const syncTimeoutRef = useRef(null);

  // Initialize from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('pt_token') || '';
    const savedRepo = localStorage.getItem('pt_repo') || '';
    const savedDarkMode = localStorage.getItem('pt_darkMode');

    dispatch({ type: 'SET_TOKEN', payload: savedToken });
    dispatch({ type: 'SET_REPO', payload: savedRepo });

    if (savedDarkMode !== null) {
      if (savedDarkMode === 'false') {
        dispatch({ type: 'TOGGLE_DARK_MODE' });
      }
    }

    if (savedToken && savedRepo) {
      loadAppData(savedToken, savedRepo);
    }
  }, []);

  // Save token and repo to localStorage
  useEffect(() => {
    if (state.token) localStorage.setItem('pt_token', state.token);
  }, [state.token]);

  useEffect(() => {
    if (state.repo) localStorage.setItem('pt_repo', state.repo);
  }, [state.repo]);

  useEffect(() => {
    localStorage.setItem('pt_darkMode', state.darkMode);
  }, [state.darkMode]);

  // Online/offline listeners
  useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Process pending sync when coming online
  useEffect(() => {
    if (state.isOnline && state.pendingSync.length > 0) {
      processPendingSync();
    }
  }, [state.isOnline]);

  const loadAppData = useCallback(async (token, repo) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    try {
      const [protocolRes, cyclesRes, inventoryRes] = await Promise.all([
        readFile(repo, 'protocol.json', token),
        readFile(repo, 'cycles.json', token),
        readFile(repo, 'inventory.json', token),
      ]);

      if (protocolRes) dispatch({ type: 'SET_PROTOCOL', payload: protocolRes.data });
      if (cyclesRes) dispatch({ type: 'SET_CYCLES', payload: cyclesRes.data });
      if (inventoryRes) dispatch({ type: 'SET_INVENTORY', payload: inventoryRes.data });

      // Load today's log
      const now = new Date();
      const monthKey = format(now, 'yyyy-MM');
      const logPath = `logs/${monthKey}.json`;
      const logRes = await readFile(repo, logPath, token);

      if (logRes) {
        const todayEntry = logRes.data.entries.find(e => e.date === format(now, 'yyyy-MM-dd'));
        if (todayEntry) {
          dispatch({ type: 'SET_TODAY_LOG', payload: { entries: [todayEntry], sha: logRes.sha } });
        }
      }
    } catch (err) {
      console.error('Failed to load app data:', err);
      dispatch({ type: 'SET_ERROR', payload: err.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const processPendingSync = useCallback(async () => {
    const { pendingSync, token, repo } = state;
    if (!token || !repo || pendingSync.length === 0) return;

    try {
      for (const item of pendingSync) {
        await upsertFile(repo, item.path, item.content, token, item.message);
      }
      dispatch({ type: 'CLEAR_PENDING_SYNC' });
    } catch (err) {
      console.error('Sync failed:', err);
    }
  }, [state]);

  const writeTodayLog = useCallback(
    (logData) => {
      if (!state.token || !state.repo) return;

      const now = new Date();
      const monthKey = format(now, 'yyyy-MM');
      const path = `logs/${monthKey}.json`;

      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);

      syncTimeoutRef.current = setTimeout(() => {
        if (state.isOnline) {
          upsertFile(state.repo, path, logData, state.token, `Update log for ${format(now, 'yyyy-MM-dd')}`)
            .catch(err => dispatch({ type: 'SET_ERROR', payload: err.message }));
        } else {
          dispatch({ type: 'ADD_PENDING_SYNC', payload: { path, content: logData, message: `Update log for ${format(now, 'yyyy-MM-dd')}` } });
        }
      }, 2000);
    },
    [state.token, state.repo, state.isOnline]
  );

  const value = {
    state,
    dispatch,
    loadAppData,
    writeTodayLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

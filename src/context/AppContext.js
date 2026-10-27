import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@wird_state_v1';

const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};


const defaultState = {
  favSurahs: [],
  favZikr: [],
  tasbeehToday: 0,
  tasbeehTotal: 0,
  tasbeehDate: todayKey(),
  lastRead: null,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);


  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = { ...defaultState, ...JSON.parse(raw) };

          if (saved.tasbeehDate !== todayKey()) {
            saved.tasbeehToday = 0;
            saved.tasbeehDate = todayKey();
          }
          setState(saved);
        }
      } catch (e) {
        console.log('خطأ في قراءة البيانات', e);
      }
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => { });
    }
  }, [state, loaded]);


  const toggleFavSurah = (id) =>
    setState((p) => ({
      ...p,
      favSurahs: p.favSurahs.includes(id)
        ? p.favSurahs.filter((x) => x !== id)
        : [...p.favSurahs, id],
    }));

  const toggleFavZikr = (id) =>
    setState((p) => ({
      ...p,
      favZikr: p.favZikr.includes(id)
        ? p.favZikr.filter((x) => x !== id)
        : [...p.favZikr, id],
    }));

  const addTasbeeh = () =>
    setState((p) => {
      const sameDay = p.tasbeehDate === todayKey();
      return {
        ...p,
        tasbeehDate: todayKey(),
        tasbeehToday: (sameDay ? p.tasbeehToday : 0) + 1,
        tasbeehTotal: p.tasbeehTotal + 1,
      };
    });

  const saveLastRead = (surah, ayah) =>
    setState((p) => ({ ...p, lastRead: { surah, ayah } }));

  const value = {
    ...state,
    loaded,
    toggleFavSurah,
    toggleFavZikr,
    addTasbeeh,
    saveLastRead,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);

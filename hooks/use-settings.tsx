'use client';

import React, { createContext, useContext, useState } from 'react';
import Cookies from 'js-cookie';
import { UserSettings, SETTINGS_COOKIE_NAME, DEFAULT_SETTINGS } from '@/types/settings';

interface SettingsContextType {
  settings: UserSettings;
  updateSetting: <T extends keyof UserSettings>(key: T, value: UserSettings[T]) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const initialSettings : UserSettings = JSON.parse(Cookies.get(SETTINGS_COOKIE_NAME) ?? JSON.stringify(DEFAULT_SETTINGS));
  const [settings, setSettings] = useState<UserSettings>(initialSettings);

  const updateSetting = <T extends keyof UserSettings>(key: T, value: UserSettings[T]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    Cookies.set(SETTINGS_COOKIE_NAME, JSON.stringify(updated));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
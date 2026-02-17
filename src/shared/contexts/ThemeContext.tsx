import React, { createContext, useContext, useMemo, useState } from 'react';

export type ThemeState = {
  fontFamily: string;
  palette: 'indigo' | 'emerald' | 'pink' | 'blue' | 'gray';
};

export type ThemeContextType = ThemeState & {
  setFontFamily: (font: string) => void;
  setPalette: (palette: ThemeState['palette']) => void;
};

const defaultState: ThemeState = {
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, \"Apple Color Emoji\", \"Segoe UI Emoji\"',
  palette: 'indigo',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [fontFamily, setFontFamily] = useState<string>(defaultState.fontFamily);
  const [palette, setPalette] = useState<ThemeState['palette']>(defaultState.palette);

  const value = useMemo<ThemeContextType>(() => ({ fontFamily, palette, setFontFamily, setPalette }), [fontFamily, palette]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

export default ThemeContext;

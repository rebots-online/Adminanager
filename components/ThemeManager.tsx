
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThemeName, ThemeMode, ThemeStyleSet } from '../types';
import { SunIcon, MoonIcon, CogIcon } from './FormElements'; // Assuming icons are in FormElements or separate Icon file

interface ThemeContextType {
  themeName: ThemeName;
  themeMode: ThemeMode;
  styles: ThemeStyleSet;
  setThemeName: (name: ThemeName) => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
}

const defaultStyles: ThemeStyleSet = {
  fontFamily: 'font-["Inter",_sans-serif]',
  appBg: 'bg-gray-100',
  headerBg: 'bg-white',
  headerText: 'text-gray-800',
  cardBg: 'bg-white',
  cardBorder: 'border border-gray-200',
  cardShadow: 'shadow-lg',
  textPrimary: 'text-gray-900',
  textSecondary: 'text-gray-700',
  textAccent: 'text-blue-600',
  textMuted: 'text-gray-500',
  inputBg: 'bg-white',
  inputBorder: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  inputText: 'text-gray-900',
  inputPlaceholder: 'placeholder-gray-400',
  buttonPrimaryBg: 'bg-blue-600 hover:bg-blue-700',
  buttonPrimaryText: 'text-white',
  buttonPrimaryBorder: 'border border-transparent',
  buttonPrimaryShadow: 'shadow-sm',
  buttonSecondaryBg: 'bg-white hover:bg-gray-50',
  buttonSecondaryText: 'text-gray-700',
  buttonSecondaryBorder: 'border border-gray-300',
  tableHeaderBg: 'bg-gray-50',
  tableHeaderText: 'text-xs text-gray-500 uppercase tracking-wider',
  tableRowBg: 'bg-white',
  tableRowBgHover: 'hover:bg-gray-50',
  tableBorder: 'border-gray-200',
  progressBarBg: 'bg-gray-200',
  progressBarFg: 'bg-blue-600',
  iconColor: 'text-gray-500',
  scrollbarThumb: 'scrollbar-thumb-gray-400',
  scrollbarTrack: 'scrollbar-track-gray-100',
  dangerText: 'text-red-600',
  successText: 'text-green-600',
  warningText: 'text-yellow-600',
  tooltipBg: 'bg-gray-800',
  tooltipText: 'text-white',
};

const themes: Record<ThemeName, Record<ThemeMode, ThemeStyleSet>> = {
  [ThemeName.SKEUOMORPHIC]: {
    [ThemeMode.LIGHT]: {
      ...defaultStyles,
      cardShadow: 'shadow-xl rounded-lg',
      buttonPrimaryBg: 'bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
      buttonPrimaryShadow: 'shadow-md active:shadow-inner',
      inputBorder: 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner',
    },
    [ThemeMode.DARK]: {
      ...defaultStyles,
      fontFamily: 'font-["Inter",_sans-serif]',
      appBg: 'bg-slate-900',
      headerBg: 'bg-slate-800',
      headerText: 'text-slate-200',
      cardBg: 'bg-slate-800',
      cardBorder: 'border border-slate-700',
      cardShadow: 'shadow-xl rounded-lg shadow-slate-950/50',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textAccent: 'text-sky-500',
      textMuted: 'text-slate-400',
      inputBg: 'bg-slate-700',
      inputBorder: 'border-slate-600 focus:border-sky-500 focus:ring-sky-500 shadow-inner',
      inputText: 'text-slate-100',
      inputPlaceholder: 'placeholder-slate-500',
      buttonPrimaryBg: 'bg-gradient-to-b from-sky-600 to-sky-800 hover:from-sky-700 hover:to-sky-900',
      buttonPrimaryText: 'text-white',
      buttonPrimaryShadow: 'shadow-md active:shadow-inner',
      buttonSecondaryBg: 'bg-slate-700 hover:bg-slate-600',
      buttonSecondaryText: 'text-slate-300',
      buttonSecondaryBorder: 'border border-slate-600',
      tableHeaderBg: 'bg-slate-700',
      tableHeaderText: 'text-xs text-slate-400 uppercase tracking-wider',
      tableRowBg: 'bg-slate-800',
      tableRowBgHover: 'hover:bg-slate-700/50',
      tableBorder: 'border-slate-700',
      progressBarBg: 'bg-slate-700',
      progressBarFg: 'bg-sky-600',
      iconColor: 'text-slate-400',
      dangerText: 'text-red-400',
      successText: 'text-green-400',
      warningText: 'text-yellow-400',
      tooltipBg: 'bg-slate-100',
      tooltipText: 'text-slate-800',
    },
  },
  [ThemeName.BRUTALIST]: {
    [ThemeMode.LIGHT]: {
      ...defaultStyles,
      fontFamily: 'font-["Arial",_sans-serif]',
      appBg: 'bg-white',
      headerBg: 'bg-white border-b-2 border-black',
      headerText: 'text-black',
      cardBg: 'bg-white',
      cardBorder: 'border-2 border-black',
      cardShadow: 'shadow-[4px_4px_0px_#000000]',
      textPrimary: 'text-black',
      textSecondary: 'text-black',
      textAccent: 'text-black underline',
      textMuted: 'text-gray-600',
      inputBg: 'bg-white',
      inputBorder: 'border-2 border-black focus:ring-0',
      inputText: 'text-black',
      inputPlaceholder: 'placeholder-gray-500',
      buttonPrimaryBg: 'bg-black hover:bg-gray-800',
      buttonPrimaryText: 'text-white',
      buttonPrimaryBorder: 'border-2 border-black',
      buttonPrimaryShadow: 'shadow-[2px_2px_0px_#000000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
      buttonSecondaryBg: 'bg-white hover:bg-gray-100',
      buttonSecondaryText: 'text-black',
      buttonSecondaryBorder: 'border-2 border-black',
      tableHeaderBg: 'bg-white border-b-2 border-black',
      tableHeaderText: 'text-xs text-black uppercase font-semibold',
      tableRowBg: 'bg-white',
      tableRowBgHover: 'hover:bg-gray-100',
      tableBorder: 'border-2 border-black',
      progressBarBg: 'bg-gray-300 border-2 border-black',
      progressBarFg: 'bg-black',
      iconColor: 'text-black',
      dangerText: 'text-red-700 font-bold',
      successText: 'text-green-700 font-bold',
      warningText: 'text-yellow-700 font-bold',
      tooltipBg: 'bg-black',
      tooltipText: 'text-white',
    },
    [ThemeMode.DARK]: {
      ...defaultStyles,
      fontFamily: 'font-["Arial",_sans-serif]',
      appBg: 'bg-black',
      headerBg: 'bg-black border-b-2 border-white',
      headerText: 'text-white',
      cardBg: 'bg-black',
      cardBorder: 'border-2 border-white',
      cardShadow: 'shadow-[4px_4px_0px_#FFFFFF]',
      textPrimary: 'text-white',
      textSecondary: 'text-white',
      textAccent: 'text-white underline',
      textMuted: 'text-gray-400',
      inputBg: 'bg-black',
      inputBorder: 'border-2 border-white focus:ring-0',
      inputText: 'text-white',
      inputPlaceholder: 'placeholder-gray-500',
      buttonPrimaryBg: 'bg-white hover:bg-gray-300',
      buttonPrimaryText: 'text-black',
      buttonPrimaryBorder: 'border-2 border-white',
      buttonPrimaryShadow: 'shadow-[2px_2px_0px_#FFFFFF] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
      buttonSecondaryBg: 'bg-black hover:bg-gray-800',
      buttonSecondaryText: 'text-white',
      buttonSecondaryBorder: 'border-2 border-white',
      tableHeaderBg: 'bg-black border-b-2 border-white',
      tableHeaderText: 'text-xs text-white uppercase font-semibold',
      tableRowBg: 'bg-black',
      tableRowBgHover: 'hover:bg-gray-800',
      tableBorder: 'border-2 border-white',
      progressBarBg: 'bg-gray-700 border-2 border-white',
      progressBarFg: 'bg-white',
      iconColor: 'text-white',
      dangerText: 'text-red-400 font-bold',
      successText: 'text-green-400 font-bold',
      warningText: 'text-yellow-400 font-bold',
      tooltipBg: 'bg-white',
      tooltipText: 'text-black',
    },
  },
  [ThemeName.RETRO]: {
    [ThemeMode.LIGHT]: { // C64-ish
      ...defaultStyles,
      fontFamily: 'font-["Press_Start_2P",_cursive] text-[10px] leading-normal',
      appBg: 'bg-[#70A4B2]', // C64 blue
      headerBg: 'bg-[#39545E] border-b-2 border-[#B8DEEB]', // Darker blue, light blue border
      headerText: 'text-[#FFFFFF]',
      cardBg: 'bg-[#39545E]',
      cardBorder: 'border-2 border-[#B8DEEB]',
      cardShadow: 'shadow-none',
      textPrimary: 'text-[#FFFFFF]',
      textSecondary: 'text-[#B8DEEB]',
      textAccent: 'text-[#FFFF00]', // Yellow
      textMuted: 'text-[#80C3D1]',
      inputBg: 'bg-[#39545E]',
      inputBorder: 'border-2 border-[#B8DEEB] focus:ring-0',
      inputText: 'text-[#FFFFFF]',
      inputPlaceholder: 'placeholder-[#80C3D1]',
      buttonPrimaryBg: 'bg-[#FFFF00] hover:bg-[#FFEE00]',
      buttonPrimaryText: 'text-[#39545E]',
      buttonPrimaryBorder: 'border-2 border-[#39545E]',
      buttonPrimaryShadow: 'shadow-none',
      buttonSecondaryBg: 'bg-[#B8DEEB] hover:bg-[#A0CFDD]',
      buttonSecondaryText: 'text-[#39545E]',
      buttonSecondaryBorder: 'border-2 border-[#39545E]',
      tableHeaderBg: 'bg-[#39545E] border-b-2 border-[#B8DEEB]',
      tableHeaderText: 'text-xs text-[#FFFF00] uppercase',
      tableRowBg: 'bg-[#4A6A76]',
      tableRowBgHover: 'hover:bg-[#5A7A86]',
      tableBorder: 'border-2 border-[#B8DEEB]',
      progressBarBg: 'bg-[#39545E] border-2 border-[#B8DEEB]',
      progressBarFg: 'bg-[#FFFF00]',
      iconColor: 'text-[#B8DEEB]',
      dangerText: 'text-red-300',
      successText: 'text-lime-300',
      warningText: 'text-yellow-300',
      tooltipBg: 'bg-[#FFFF00]',
      tooltipText: 'text-[#39545E]',
    },
    [ThemeMode.DARK]: { // Green Phosphor
      ...defaultStyles,
      fontFamily: 'font-["Press_Start_2P",_cursive] text-[10px] leading-normal',
      appBg: 'bg-[#0A0F09]', // Dark green/black
      headerBg: 'bg-[#0A0F09] border-b-2 border-[#33FF33]', // Green border
      headerText: 'text-[#33FF33]', // Green text
      cardBg: 'bg-[#101F0F]',
      cardBorder: 'border-2 border-[#33FF33]',
      cardShadow: 'shadow-none',
      textPrimary: 'text-[#33FF33]',
      textSecondary: 'text-[#22AA22]',
      textAccent: 'text-[#55FF55]',
      textMuted: 'text-[#1A661A]',
      inputBg: 'bg-[#101F0F]',
      inputBorder: 'border-2 border-[#33FF33] focus:ring-0',
      inputText: 'text-[#33FF33]',
      inputPlaceholder: 'placeholder-[#1A661A]',
      buttonPrimaryBg: 'bg-[#33FF33] hover:bg-[#22EE22]',
      buttonPrimaryText: 'text-[#0A0F09]',
      buttonPrimaryBorder: 'border-2 border-[#0A0F09]',
      buttonPrimaryShadow: 'shadow-none',
      buttonSecondaryBg: 'bg-[#101F0F] hover:bg-[#152A14]',
      buttonSecondaryText: 'text-[#33FF33]',
      buttonSecondaryBorder: 'border-2 border-[#33FF33]',
      tableHeaderBg: 'bg-[#0A0F09] border-b-2 border-[#33FF33]',
      tableHeaderText: 'text-xs text-[#55FF55] uppercase',
      tableRowBg: 'bg-[#101A0E]',
      tableRowBgHover: 'hover:bg-[#152513]',
      tableBorder: 'border-2 border-[#33FF33]',
      progressBarBg: 'bg-[#101F0F] border-2 border-[#33FF33]',
      progressBarFg: 'bg-[#33FF33]',
      iconColor: 'text-[#33FF33]',
      dangerText: 'text-red-400',
      successText: 'text-lime-400',
      warningText: 'text-yellow-400',
      tooltipBg: 'bg-[#33FF33]',
      tooltipText: 'text-[#0A0F09]',
    },
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeNameState] = useState<ThemeName>(ThemeName.SKEUOMORPHIC);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(ThemeMode.LIGHT);

  const setThemeAttribute = useCallback((name: ThemeName, mode: ThemeMode) => {
    const selectedThemeStyles = themes[name][mode];
    document.documentElement.className = `${selectedThemeStyles.appBg} ${selectedThemeStyles.fontFamily}`;
    if (mode === ThemeMode.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  useEffect(() => {
    setThemeAttribute(themeName, themeMode);
  }, [themeName, themeMode, setThemeAttribute]);

  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
  };

  const toggleThemeMode = () => {
    setThemeModeState(prevMode => prevMode === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT);
  };
  
  const styles = themes[themeName][themeMode];

  return (
    <ThemeContext.Provider value={{ themeName, themeMode, styles, setThemeName, setThemeMode, toggleThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeSwitcher: React.FC = () => {
  const { themeName, themeMode, setThemeName, toggleThemeMode, styles } = useTheme();

  return (
    <div className="flex items-center space-x-2 p-1 rounded-md">
      <div className="relative">
        <select
          value={themeName}
          onChange={(e) => setThemeName(e.target.value as ThemeName)}
          className={`appearance-none py-1.5 pl-3 pr-8 text-sm ${styles.inputBg} ${styles.inputText} ${styles.inputBorder} rounded-md focus:outline-none focus:ring-2`}
        >
          {Object.values(ThemeName).map(name => (
            <option key={name} value={name} className={`${styles.inputBg} ${styles.inputText}`}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </option>
          ))}
        </select>
        <CogIcon className={`w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${styles.iconColor}`} />
      </div>
      <button
        onClick={toggleThemeMode}
        className={`p-1.5 rounded-md ${styles.buttonSecondaryBg} ${styles.buttonSecondaryText} ${styles.buttonSecondaryBorder} hover:opacity-80`}
        aria-label={themeMode === ThemeMode.LIGHT ? "Switch to dark mode" : "Switch to light mode"}
      >
        {themeMode === ThemeMode.LIGHT ? <MoonIcon className={`w-5 h-5 ${styles.iconColor}`} /> : <SunIcon className={`w-5 h-5 ${styles.iconColor}`} />}
      </button>
    </div>
  );
};


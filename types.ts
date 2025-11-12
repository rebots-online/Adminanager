
export enum ThemeName {
  SKEUOMORPHIC = 'skeuomorphic',
  BRUTALIST = 'brutalist',
  RETRO = 'retro',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface ThemeStyleSet {
  fontFamily: string;
  appBg: string;
  headerBg: string;
  headerText: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  textPrimary: string;
  textSecondary: string;
  textAccent: string;
  textMuted: string;
  inputBg: string;
  inputBorder: string;
  inputText: string;
  inputPlaceholder: string;
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonPrimaryBorder: string;
  buttonPrimaryShadow: string;
  buttonSecondaryBg: string;
  buttonSecondaryText: string;
  buttonSecondaryBorder: string;
  tableHeaderBg: string;
  tableHeaderText: string;
  tableRowBg: string;
  tableRowBgHover: string;
  tableBorder: string;
  progressBarBg: string;
  progressBarFg: string;
  iconColor: string;
  scrollbarThumb: string;
  scrollbarTrack: string;
  dangerText: string;
  successText: string;
  warningText: string;
  tooltipBg: string;
  tooltipText: string;
}

export interface PoolConfig {
  id: string;
  enabled: boolean;
  url: string;
  subAccount: string;
  pwd?: string;
  workerSuffix: 'IP' | 'No Change' | 'Empty';
}

export enum MinerStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PENDING = 'pending',
  REFRESHING = 'refreshing',
  UNKNOWN = 'unknown'
}

export type MinerModel = 'Antminer S9' | 'Antminer S9j' | 'Antminer S15' | 'Antminer S17' | 'Antminer S21' | 'Unknown';

export interface Miner {
  id: string;
  ip: string;
  status: MinerStatus;
  type: MinerModel;
  workingMode: string;
  hashRateRT: string; // e.g., "12.29 TH/s"
  hashRateAvg: string; // e.g., "12.01 TH/s"
  temperature: string; // e.g., "79.0° / 84.0°"
  fanSpeed: string; // e.g., "4020 / 2580"
  elapsed: string; // e.g., "1d 10h 50m 19s"
  pools: { url: string; worker: string }[];
  historicalHashrate: { time: number; rate: number }[]; // For charts
  historicalTemperature: { time: number; temp1: number; temp2?: number }[]; // For charts
}

export interface GlobalConfig {
  pools: PoolConfig[];
  overclock: {
    enabled: boolean;
    model: MinerModel;
    workMode: string; // e.g., 'Normal', 'LPM'
    option: string; // e.g., 'Normal'
  };
  onlySuccessMiners: boolean;
  reOverclocking: boolean;
  powerControl: {
    enabled: boolean;
    lpm: boolean;
    enhancedLpm: boolean;
  };
}

export interface IPRange {
  id: string;
  range: string; // e.g., "192.168.0.0-255"
}

export enum HistoricalChartType {
  LINE = 'line',
  BAR = 'bar',
}

export enum HistoricalTimeRange {
  HOUR = 'hour', // Last 1 hour
  DAY = 'day',   // Last 24 hours
  WEEK = 'week', // Last 7 days
  MONTH = 'month', // Last 30 days
  YEAR = 'year', // Last 365 days
  ALL = 'all',   // All available data
}

export interface AggregatedHistoricalDataPoint {
  time: number; // Timestamp
  totalRate: number; // Sum of hashrates for this time point
}


import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// FIX: Import ThemeMode to correctly compare themeMode variable with enum values
import { Miner, MinerStatus, ThemeMode } from '../types';
import { useTheme } from './ThemeManager';
import { Card } from './FormElements';

interface MinerInfoDisplayProps {
  miners: Miner[];
  selectedMiner: Miner | null;
  onSelectMiner: (miner: Miner | null) => void;
  onGenerateSummary: (miner: Miner) => void;
  isLoadingSummary: boolean;
  summaryText: string | null;
}

const MinerStatusBadge: React.FC<{ status: MinerStatus; styles: ReturnType<typeof useTheme>['styles'] }> = ({ status, styles }) => {
  let bgColor = styles.textMuted;
  let textColor = styles.textPrimary; // Default text color for badge, can adjust

  switch (status) {
    case MinerStatus.SUCCESS:
      bgColor = styles.successText.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-700'); // Adjust for bg
      textColor = styles.successText;
      break;
    case MinerStatus.ERROR:
      bgColor = styles.dangerText.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-700');
      textColor = styles.dangerText;
      break;
    // FIX: Removed MinerStatus.WARNING as it does not exist in the MinerStatus enum
    // case MinerStatus.WARNING: 
    //   bgColor = styles.warningText.replace('text-', 'bg-').replace('-600', '-100').replace('-400', '-700');
    //   textColor = styles.warningText;
    //   break;
    case MinerStatus.REFRESHING:
    case MinerStatus.PENDING:
      bgColor = styles.textAccent.replace('text-', 'bg-').replace('-600', '-100').replace('-500', '-700');
      textColor = styles.textAccent;
      break;
  }
  // Ensure dark mode compatibility for badge backgrounds
  if (document.documentElement.classList.contains('dark')) {
    if (status === MinerStatus.SUCCESS) bgColor = 'bg-green-800';
    if (status === MinerStatus.ERROR) bgColor = 'bg-red-800';
    // FIX: Removed check for MinerStatus.WARNING as it does not exist
    // if (status === MinerStatus.WARNING) bgColor = 'bg-yellow-800';
     if (status === MinerStatus.REFRESHING || status === MinerStatus.PENDING) bgColor = 'bg-sky-800';
  }


  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bgColor} ${textColor}`}>
      {status}
    </span>
  );
};

export const MinerInfoDisplay: React.FC<MinerInfoDisplayProps> = ({ miners, selectedMiner, onSelectMiner, onGenerateSummary, isLoadingSummary, summaryText }) => {
  const { styles, themeMode } = useTheme();

  // FIX: Corrected usage of ThemeMode enum by ensuring it's imported and used for comparison
  const chartStrokeColor = themeMode === ThemeMode.DARK ? '#60a5fa' : '#3b82f6'; // sky-500 / blue-600
  // FIX: Corrected usage of ThemeMode enum by ensuring it's imported and used for comparison
  const chartGridColor = themeMode === ThemeMode.DARK ? '#4b5567' : '#e5e7eb'; // slate-600 / gray-200
  // FIX: Corrected usage of ThemeMode enum by ensuring it's imported and used for comparison
  const chartTextColor = themeMode === ThemeMode.DARK ? styles.textSecondary.split(' ')[0] : styles.textSecondary.split(' ')[0];


  const TableHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <th scope="col" className={`px-3 py-3 text-left text-xs font-medium ${styles.tableHeaderText} ${styles.fontFamily}`}>
      {children}
    </th>
  );

  const TableCell: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <td className={`px-3 py-2 whitespace-nowrap text-sm ${styles.textSecondary} ${className || ''}`}>
      {children}
    </td>
  );
  
  const renderHashrateChart = (data: Miner['historicalHashrate']) => (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
        <XAxis dataKey="time" tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()} stroke={chartTextColor} tick={{className: styles.fontFamily, fontSize: '0.7rem'}} />
        <YAxis stroke={chartTextColor} tick={{className: styles.fontFamily, fontSize: '0.7rem'}}/>
        <Tooltip 
            contentStyle={{ backgroundColor: styles.tooltipBg.split(' ')[0], color: styles.tooltipText.split(' ')[0], borderRadius: '0.25rem', borderColor: styles.cardBorder.split(' ')[1] }}
            itemStyle={{color: styles.tooltipText.split(' ')[0], fontFamily: styles.fontFamily.replace('font-', '')}}
            cursor={{fill: 'transparent'}}
        />
        <Legend wrapperStyle={{fontFamily: styles.fontFamily.replace('font-', ''), fontSize: '0.8rem'}}/>
        <Line type="monotone" dataKey="rate" name="Hashrate (TH/s)" stroke={chartStrokeColor} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );

  return (
    <div className="mt-6 space-y-6">
      <Card title="Miners Overview" className="overflow-x-auto">
        <table className={`min-w-full divide-y ${styles.tableBorder} ${styles.fontFamily}`}>
          <thead className={`${styles.tableHeaderBg}`}>
            <tr>
              <TableHeader>IP</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Type</TableHeader>
              <TableHeader>Working Mode</TableHeader>
              <TableHeader>Hash Rate RT</TableHeader>
              <TableHeader>Hash Rate Avg</TableHeader>
              <TableHeader>Temp</TableHeader>
              <TableHeader>Fan Speed</TableHeader>
              <TableHeader>Elapsed</TableHeader>
              <TableHeader>Pool 1</TableHeader>
            </tr>
          </thead>
          <tbody className={`divide-y ${styles.tableBorder} ${styles.tableRowBg}`}>
            {miners.map((miner) => (
              <tr 
                key={miner.id} 
                // FIX: Corrected usage of ThemeMode enum by ensuring it's imported and used for comparison
                className={`${styles.tableRowBgHover} cursor-pointer ${selectedMiner?.id === miner.id ? (themeMode === ThemeMode.LIGHT ? 'bg-blue-100' : 'bg-sky-900') : ''}`}
                onClick={() => onSelectMiner(miner)}
              >
                <TableCell className={`${styles.textPrimary} font-medium`}>{miner.ip}</TableCell>
                <TableCell><MinerStatusBadge status={miner.status} styles={styles} /></TableCell>
                <TableCell>{miner.type}</TableCell>
                <TableCell>{miner.workingMode}</TableCell>
                <TableCell className={miner.hashRateRT.includes('0.00') || miner.status === MinerStatus.ERROR ? styles.dangerText : styles.textSecondary}>{miner.hashRateRT}</TableCell>
                <TableCell>{miner.hashRateAvg}</TableCell>
                <TableCell className={parseFloat(miner.temperature.split('°')[0]) > 85 ? styles.dangerText : styles.textSecondary}>{miner.temperature}</TableCell>
                <TableCell>{miner.fanSpeed}</TableCell>
                <TableCell>{miner.elapsed}</TableCell>
                <TableCell>{miner.pools[0]?.url.substring(0,20)}...</TableCell>
              </tr>
            ))}
            {miners.length === 0 && (
              <tr>
                <td colSpan={10} className={`px-3 py-10 text-center text-sm ${styles.textMuted}`}>No miners found. Adjust IP range and scan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {selectedMiner && (
        <Card title={`Details for ${selectedMiner.ip} (${selectedMiner.type})`} className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`text-md font-medium ${styles.textPrimary} mb-2`}>Hashrate Trend (TH/s)</h4>
              {renderHashrateChart(selectedMiner.historicalHashrate)}
            </div>
            <div className="space-y-3">
              <h4 className={`text-md font-medium ${styles.textPrimary} mb-2`}>Quick Info</h4>
                <p><strong className={styles.textPrimary}>Pool 1:</strong> <span className={styles.textSecondary}>{selectedMiner.pools[0]?.url} ({selectedMiner.pools[0]?.worker})</span></p>
                <p><strong className={styles.textPrimary}>Pool 2:</strong> <span className={styles.textSecondary}>{selectedMiner.pools[1]?.url} ({selectedMiner.pools[1]?.worker})</span></p>
                <p><strong className={styles.textPrimary}>Pool 3:</strong> <span className={styles.textSecondary}>{selectedMiner.pools[2]?.url} ({selectedMiner.pools[2]?.worker})</span></p>

              <button
                onClick={() => onGenerateSummary(selectedMiner)}
                disabled={isLoadingSummary}
                className={`mt-4 w-full text-sm ${styles.buttonPrimaryBg} ${styles.buttonPrimaryText} ${styles.buttonPrimaryBorder} ${styles.buttonPrimaryShadow} px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
              >
                {isLoadingSummary ? 'Generating...' : 'Generate Smart Summary (Gemini)'}
              </button>
              {summaryText && (
                <div className={`mt-4 p-3 rounded-md ${styles.cardBg === 'bg-white' ? 'bg-gray-50' : 'bg-slate-700'} ${styles.inputBorder}`}>
                  <p className={`text-sm ${styles.textSecondary}`}>{summaryText}</p>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

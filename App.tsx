
import React, { useState, useEffect, useCallback } from 'react';
import { ThemeName, ThemeMode, Miner, MinerStatus, MinerModel, GlobalConfig, PoolConfig, IPRange } from './types';
import { useTheme, ThemeSwitcher } from './components/ThemeManager';
import { MinerInfoDisplay } from './components/MinerInfoDisplay';
import { DashboardOverview } from './components/DashboardOverview'; // Import the new component
import { Button, Input, Select, Checkbox, RadioGroup, Card, PlusIcon, MinusIcon, RefreshCwIcon } from './components/FormElements';
import { generateMinerSummary } from './services/geminiService';

// Mock Data (replace with actual API calls in a real app)
const generateHistoricalData = (baseRate: number, points: number, period: number, variance: number) => {
  const data = [];
  const now = Date.now();
  for (let i = 0; i < points; i++) {
    const time = now - (points - 1 - i) * (period / points);
    const rate = baseRate + (Math.random() - 0.5) * variance;
    data.push({ time, rate: Math.max(0, parseFloat(rate.toFixed(2))) });
  }
  return data;
};


const MOCK_MINERS: Miner[] = [
  { id: '1', ip: '192.168.0.81', status: MinerStatus.SUCCESS, type: 'Antminer S9', workingMode: 'LPM', hashRateRT: '12.29 TH/s', hashRateAvg: '12.01 TH/s', temperature: '79.0°/84.0°', fanSpeed: '4020/2580', elapsed: '1d 10h 50m', pools: [{url: 'stratum+tcp://pool1.example.com:3333', worker: 'user.worker1'}], historicalHashrate: generateHistoricalData(12.01, 60, 24*60*60*1000, 1), historicalTemperature: [] }, // 60 points over last day
  { id: '2', ip: '192.168.0.137', status: MinerStatus.SUCCESS, type: 'Antminer S17', workingMode: 'Normal', hashRateRT: '55.72 TH/s', hashRateAvg: '55.60 TH/s', temperature: '62.0°/68.0°', fanSpeed: '4560/6600', elapsed: '1d 10h 47m', pools: [{url: 'stratum+tcp://pool2.example.com:3333', worker: 'user.worker2'}], historicalHashrate: generateHistoricalData(55.60, 60, 24*60*60*1000, 3), historicalTemperature: []  },
  // FIX: Removed extra `true` argument from generateHistoricalData call.
  { id: '3', ip: '192.168.0.160', status: MinerStatus.ERROR, type: 'Antminer S9j', workingMode: 'Normal', hashRateRT: '0.00 TH/s', hashRateAvg: '8.95 TH/s', temperature: '52.0°/54.0°', fanSpeed: '4680/3240', elapsed: '7h 55m', pools: [{url: 'stratum+tcp://pool3.example.com:3333', worker: 'user.worker3'}], historicalHashrate: generateHistoricalData(8.95, 60, 24*60*60*1000, 5), historicalTemperature: [] }, // includes zero values due to error potential
];


const initialGlobalConfig: GlobalConfig = {
  pools: [
    { id: '1', enabled: true, url: 'p://ca.stratum.braiins.com:3333', subAccount: 'miningmyownedbusiness', workerSuffix: 'IP' },
    { id: '2', enabled: true, url: 'stratum+tcp://solo.ckpool.org:3333', subAccount: '6540azd7...', workerSuffix: 'No Change' },
    { id: '3', enabled: false, url: '', subAccount: '', workerSuffix: 'Empty' },
  ],
  overclock: { enabled: true, model: 'Antminer S9', workMode: 'Normal', option: 'Normal' },
  onlySuccessMiners: true,
  reOverclocking: false,
  powerControl: { enabled: true, lpm: true, enhancedLpm: false },
};

const App: React.FC = () => {
  const { styles, themeMode } = useTheme(); // Get themeMode here
  const [miners, setMiners] = useState<Miner[]>([]);
  const [selectedMiner, setSelectedMiner] = useState<Miner | null>(null);
  const [ipRanges, setIpRanges] = useState<IPRange[]>([{ id: '1', range: '192.168.0.0-255' }]);
  const [newIpRange, setNewIpRange] = useState<string>('');
  const [globalConfig, setGlobalConfig] = useState<GlobalConfig>(initialGlobalConfig);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanStatus, setScanStatus] = useState<string>("Ready to scan.");
  const [progress, setProgress] = useState<number>(0);

  const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);


  useEffect(() => {
    // Simulate initial load with mock miners for dashboard visibility
     setMiners(MOCK_MINERS); 
  }, []);

  const handleScan = useCallback(() => {
    setIsLoading(true);
    setScanStatus("Scanning started...");
    setProgress(0);
    setSelectedMiner(null); 
    setSummaryText(null);
    setMiners([]); 

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setMiners(MOCK_MINERS); 
        setScanStatus(`Scan complete. Found ${MOCK_MINERS.length} miners.`);
      } else {
         const foundIndex = Math.floor(MOCK_MINERS.length * (currentProgress / 100));
         const currentMinerIp = MOCK_MINERS[foundIndex]?.ip || ipRanges[0]?.range.split('-')[0] || '...';
         setScanStatus(`${currentProgress}% - Refreshing miner's info: ${currentMinerIp}. Found ${foundIndex} of ${MOCK_MINERS.length}`);
      }
    }, 200);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ipRanges]);

  const handleAddIpRange = () => {
    if (newIpRange.trim() === '') return;
    setIpRanges([...ipRanges, { id: String(Date.now()), range: newIpRange.trim() }]);
    setNewIpRange('');
  };
  
  const handleRemoveIpRange = (id: string) => {
    setIpRanges(ipRanges.filter(range => range.id !== id));
  };

  const handlePoolConfigChange = (index: number, field: keyof PoolConfig, value: any) => {
    const newPools = [...globalConfig.pools];
    (newPools[index] as any)[field] = value;
    setGlobalConfig({ ...globalConfig, pools: newPools });
  };

  const handleGenerateSummary = async (minerToSummarize: Miner) => {
    setIsLoadingSummary(true);
    setSummaryText(null);
    const summary = await generateMinerSummary(minerToSummarize);
    setSummaryText(summary);
    setIsLoadingSummary(false);
  };

  const Header: React.FC = () => (
    <header className={`p-3 ${styles.headerBg} ${styles.cardShadow} flex justify-between items-center sticky top-0 z-50 ${styles.fontFamily}`}>
      <h1 className={`text-xl font-semibold ${styles.headerText}`}>Advanced Miner Manager</h1>
      <ThemeSwitcher />
    </header>
  );

  const MinerConfigurationPanel: React.FC = () => (
     <Card title="Global Miner Configuration" className="mb-6">
        <div className="space-y-6">
          {/* Pools Configuration */}
          <fieldset className="space-y-3">
            <legend className={`text-md font-medium ${styles.textPrimary}`}>Pool Configuration</legend>
            {globalConfig.pools.map((pool, index) => (
              <Card key={pool.id} className={`p-3 ${styles.inputBorder}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
                  <Checkbox 
                    label={`Pool ${index + 1}`} 
                    checked={pool.enabled} 
                    onChange={(e) => handlePoolConfigChange(index, 'enabled', e.target.checked)}
                  />
                  <Input 
                    placeholder="Pool URL (e.g., stratum+tcp://...)" 
                    value={pool.url} 
                    onChange={(e) => handlePoolConfigChange(index, 'url', e.target.value)}
                    disabled={!pool.enabled}
                  />
                  <Input 
                    placeholder="SubAccount / Username" 
                    value={pool.subAccount} 
                    onChange={(e) => handlePoolConfigChange(index, 'subAccount', e.target.value)}
                    disabled={!pool.enabled}
                  />
                  <Input 
                    type="password"
                    placeholder="Password (optional)" 
                    value={pool.pwd || ''} 
                    onChange={(e) => handlePoolConfigChange(index, 'pwd', e.target.value)}
                    disabled={!pool.enabled}
                  />
                   <div className="col-span-full md:col-span-2 lg:col-span-4">
                     <label className={`block text-sm font-medium ${styles.textSecondary} mb-1`}>Worker Suffix</label>
                     <RadioGroup
                        name={`workerSuffix-${pool.id}`}
                        options={[{label: 'IP', value: 'IP'}, {label: 'No Change', value: 'No Change'}, {label: 'Empty', value: 'Empty'}]}
                        selectedValue={pool.workerSuffix}
                        onChange={(val) => handlePoolConfigChange(index, 'workerSuffix', val)}
                        inline
                     />
                   </div>
                </div>
              </Card>
            ))}
          </fieldset>

          {/* Overclock/Underclock Configuration */}
          <fieldset className="space-y-3">
             <legend className={`text-md font-medium ${styles.textPrimary}`}>Performance Tuning</legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <Checkbox 
                label="Overclock/Underclock"
                checked={globalConfig.overclock.enabled}
                onChange={(e) => setGlobalConfig({...globalConfig, overclock: {...globalConfig.overclock, enabled: e.target.checked}})}
              />
              <Select 
                value={globalConfig.overclock.model} 
                onChange={(e) => setGlobalConfig({...globalConfig, overclock: {...globalConfig.overclock, model: e.target.value as MinerModel}})}
                disabled={!globalConfig.overclock.enabled}
              >
                {(['Antminer S9', 'Antminer S9j', 'Antminer S15', 'Antminer S17', 'Antminer S21', 'Unknown'] as MinerModel[]).map(m => <option key={m} value={m}>{m}</option>)}
              </Select>
              <Input 
                placeholder="Work Mode (e.g., Normal)" 
                value={globalConfig.overclock.workMode}
                onChange={(e) => setGlobalConfig({...globalConfig, overclock: {...globalConfig.overclock, workMode: e.target.value}})}
                disabled={!globalConfig.overclock.enabled}
              />
            </div>
          </fieldset>
          
          {/* Other Settings */}
           <fieldset className="space-y-3">
             <legend className={`text-md font-medium ${styles.textPrimary}`}>General Settings</legend>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Checkbox label="Only Success Miners" checked={globalConfig.onlySuccessMiners} onChange={e => setGlobalConfig({...globalConfig, onlySuccessMiners: e.target.checked})} />
                <Checkbox label="Re-overclocking" checked={globalConfig.reOverclocking} onChange={e => setGlobalConfig({...globalConfig, reOverclocking: e.target.checked})} />
                <Checkbox 
                    label="Power Control"
                    checked={globalConfig.powerControl.enabled} 
                    onChange={e => setGlobalConfig({...globalConfig, powerControl: {...globalConfig.powerControl, enabled: e.target.checked}})}
                />
                {globalConfig.powerControl.enabled && (
                    <>
                    <Checkbox label="LPM" checked={globalConfig.powerControl.lpm} onChange={e => setGlobalConfig({...globalConfig, powerControl: {...globalConfig.powerControl, lpm: e.target.checked}})} />
                    <Checkbox label="Enhanced LPM" checked={globalConfig.powerControl.enhancedLpm} onChange={e => setGlobalConfig({...globalConfig, powerControl: {...globalConfig.powerControl, enhancedLpm: e.target.checked}})} />
                    </>
                )}
             </div>
           </fieldset>
        </div>
     </Card>
  );

  return (
    <div className={`min-h-screen ${styles.appBg} ${styles.textPrimary} ${styles.fontFamily} flex flex-col`}>
      <Header />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
        {/* New Dashboard Overview */}
        <DashboardOverview miners={miners} styles={styles} themeMode={themeMode} />

        {/* IP Ranges and Scan Controls */}
        <Card title="Network Scan & Control">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${styles.textSecondary} mb-1`}>IP Ranges</label>
              {ipRanges.map(ipRange => (
                <div key={ipRange.id} className="flex items-center space-x-2 mb-1">
                  <Input value={ipRange.range} readOnly className="flex-grow"/>
                  <Button variant="secondary" size="sm" onClick={() => handleRemoveIpRange(ipRange.id)} aria-label="Remove IP Range">
                    <MinusIcon className={`w-4 h-4 ${styles.iconColor}`} />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2 mt-2">
                <Input 
                  placeholder="Add IP range (e.g., 192.168.1.100-150)" 
                  value={newIpRange} 
                  onChange={(e) => setNewIpRange(e.target.value)} 
                />
                <Button variant="secondary" size="sm" onClick={handleAddIpRange} aria-label="Add IP Range">
                  <PlusIcon className={`w-4 h-4 ${styles.iconColor}`} />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <Button onClick={handleScan} disabled={isLoading} leftIcon={isLoading ? <RefreshCwIcon className="animate-spin w-4 h-4"/> : null}>
                {isLoading ? 'Scanning...' : 'Scan'}
              </Button>
              <Button variant="secondary" onClick={() => alert('Stop Monitor clicked (not implemented)')}>Stop Monitor</Button>
              <Button variant="secondary" onClick={() => alert('Config All clicked (not implemented)')}>Config All</Button>
              <Button variant="secondary" onClick={() => alert('Config Selected clicked (not implemented)')} disabled={!selectedMiner}>Config Selected</Button>
              {/* More buttons can be added here */}
            </div>
          </div>
          {/* Progress Bar and Status */}
          {isLoading && (
            <div className="mt-4">
              <div className={`w-full ${styles.progressBarBg} rounded-full h-2.5 ${styles.fontFamily}`}>
                <div 
                  className={`${styles.progressBarFg} h-2.5 rounded-full transition-all duration-300 ease-linear`} 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className={`mt-1 text-xs ${styles.textMuted}`}>{scanStatus}</p>
            </div>
          )}
          {!isLoading && scanStatus !== "Ready to scan." && (
             <p className={`mt-2 text-sm ${styles.textMuted}`}>{scanStatus}</p>
          )}
        </Card>
        
        <MinerConfigurationPanel />

        <MinerInfoDisplay 
          miners={miners} 
          selectedMiner={selectedMiner} 
          onSelectMiner={setSelectedMiner}
          onGenerateSummary={handleGenerateSummary}
          isLoadingSummary={isLoadingSummary}
          summaryText={summaryText}
        />
      </main>
      <footer className={`p-4 text-center text-xs ${styles.headerBg} border-t ${styles.tableBorder} ${styles.textMuted} ${styles.fontFamily}`}>
        Advanced Miner Manager &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
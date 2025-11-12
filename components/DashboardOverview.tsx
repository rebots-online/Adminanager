
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Miner, ThemeMode, ThemeStyleSet, HistoricalChartType, HistoricalTimeRange, AggregatedHistoricalDataPoint } from '../types';
import { Card, RadioGroup } from './FormElements';

interface DashboardOverviewProps {
  miners: Miner[];
  styles: ThemeStyleSet;
  themeMode: ThemeMode;
}

const MOCK_BTC_PRICE_USD = 60000; // USD
const MOCK_DIFFICULTY = 80 * 1e12; // Example: 80 Trillion
const BLOCK_REWARD_BTC = 3.125; // Current block reward (post-2024 halving)
const TWO_POW_32 = Math.pow(2, 32);
const SECONDS_PER_DAY = 86400;

const parseHashrate = (hashRateStr: string): number => {
  if (!hashRateStr) return 0;
  const match = hashRateStr.match(/([\d.]+)\s*(TH\/s|GH\/s|MH\/s|KH\/s|H\/s)/i);
  if (!match) return 0;
  let value = parseFloat(match[1]);
  const unit = match[2].toUpperCase();
  if (unit === 'GH/S') value /= 1000;
  else if (unit === 'MH/S') value /= 1000 * 1000;
  else if (unit === 'KH/S') value /= 1000 * 1000 * 1000;
  else if (unit === 'H/S') value /= 1000 * 1000 * 1000 * 1000;
  return value; // Assumes default is TH/s if unit is TH/s
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82Ca9D'];

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ miners, styles, themeMode }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<HistoricalTimeRange>(HistoricalTimeRange.DAY);
  const [selectedChartType, setSelectedChartType] = useState<HistoricalChartType>(HistoricalChartType.LINE);

  const totalAverageHashrate = useMemo(() => {
    return miners.reduce((sum, miner) => sum + parseHashrate(miner.hashRateAvg), 0);
  }, [miners]);

  const doughnutData = useMemo(() => {
    if (totalAverageHashrate === 0) return [];
    return miners.map(miner => ({
      name: miner.ip,
      value: parseHashrate(miner.hashRateAvg),
      percentage: totalAverageHashrate > 0 ? (parseHashrate(miner.hashRateAvg) / totalAverageHashrate * 100).toFixed(1) : 0,
    })).filter(data => data.value > 0);
  }, [miners, totalAverageHashrate]);

  const estimatedDailyEarningsUSD = useMemo(() => {
    if (totalAverageHashrate === 0) return 0;
    const totalHashrateHPS = totalAverageHashrate * 1e12; // Convert TH/s to H/s
    // Earnings_BTC_Per_Day = (Your_Hashrate_HPS * Block_Reward_BTC * Seconds_Per_Day) / (Difficulty * 2^32)
    const earningsBTC = (totalHashrateHPS * BLOCK_REWARD_BTC * SECONDS_PER_DAY) / (MOCK_DIFFICULTY * TWO_POW_32);
    return earningsBTC * MOCK_BTC_PRICE_USD;
  }, [totalAverageHashrate]);

  const aggregatedHistoricalData = useMemo((): AggregatedHistoricalDataPoint[] => {
    const dataMap: { [time: number]: number } = {};
    miners.forEach(miner => {
      miner.historicalHashrate.forEach(point => {
        dataMap[point.time] = (dataMap[point.time] || 0) + point.rate;
      });
    });
    return Object.entries(dataMap)
      .map(([time, totalRate]) => ({ time: parseInt(time), totalRate }))
      .sort((a, b) => a.time - b.time);
  }, [miners]);

  const filteredHistoricalData = useMemo(() => {
    const now = Date.now();
    let startTime = 0;

    switch (selectedTimeRange) {
      case HistoricalTimeRange.HOUR:
        startTime = now - 1 * 60 * 60 * 1000;
        break;
      case HistoricalTimeRange.DAY:
        startTime = now - 24 * 60 * 60 * 1000;
        break;
      case HistoricalTimeRange.WEEK:
        startTime = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case HistoricalTimeRange.MONTH:
        startTime = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case HistoricalTimeRange.YEAR:
        startTime = now - 365 * 24 * 60 * 60 * 1000;
        break;
      case HistoricalTimeRange.ALL:
      default:
        startTime = 0;
        break;
    }
    return aggregatedHistoricalData.filter(d => d.time >= startTime);
  }, [aggregatedHistoricalData, selectedTimeRange]);
  
  const chartStrokeColor = themeMode === ThemeMode.DARK ? '#60a5fa' : '#3b82f6'; // sky-500 / blue-600
  const chartGridColor = themeMode === ThemeMode.DARK ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.7)'; // Adjust opacity
  const chartTextColorClass = themeMode === ThemeMode.DARK ? styles.textSecondary : styles.textSecondary;


  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value, percentage }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentageValue = (percent * 100).toFixed(0);

    if (parseFloat(percentageValue) < 5) return null; // Don't render label for very small slices

    return (
      <text x={x} y={y} fill={themeMode === ThemeMode.DARK ? styles.textPrimary.split(' ')[0] : styles.textPrimary.split(' ')[0]} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className={`text-[8px] md:text-[10px] ${styles.fontFamily}`}>
        {`${name.split('.').pop()} (${percentageValue}%)`}
      </text>
    );
  };
  
  const historicalChartControls = (
    <div className="my-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <div>
          <label className={`block text-sm font-medium ${styles.textSecondary} mb-1`}>Time Range</label>
          <RadioGroup
            name="timeRange"
            options={[
              { label: 'Hour', value: HistoricalTimeRange.HOUR },
              { label: 'Day', value: HistoricalTimeRange.DAY },
              { label: 'Week', value: HistoricalTimeRange.WEEK },
              { label: 'Month', value: HistoricalTimeRange.MONTH },
             // { label: 'Year', value: HistoricalTimeRange.YEAR }, // Year might be too much for mock data
              { label: 'All', value: HistoricalTimeRange.ALL },
            ]}
            selectedValue={selectedTimeRange}
            onChange={(val) => setSelectedTimeRange(val as HistoricalTimeRange)}
            inline
          />
        </div>
        <div>
          <label className={`block text-sm font-medium ${styles.textSecondary} mb-1`}>Chart Type</label>
          <RadioGroup
            name="chartType"
            options={[
              { label: 'Line', value: HistoricalChartType.LINE },
              { label: 'Bar', value: HistoricalChartType.BAR },
            ]}
            selectedValue={selectedChartType}
            onChange={(val) => setSelectedChartType(val as HistoricalChartType)}
            inline
          />
        </div>
      </div>
       <p className={`text-xs ${styles.textMuted}`}>Note: Mock data is limited. Longer time ranges might not show extensive history.</p>
    </div>
  );


  return (
    <Card title="Farm Performance Overview" className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-1 h-64 md:h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={doughnutData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius="80%"
                innerRadius="50%"
                fill="#8884d8"
                dataKey="value"
                stroke={styles.cardBg.split(' ')[0]} // Use card background for border to blend
              >
                {doughnutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip 
                formatter={(value: number, name: string, props: any) => [`${value.toFixed(2)} TH/s (${props.payload.percentage}%)`, `Miner ${props.payload.name}`]}
                contentStyle={{ backgroundColor: styles.tooltipBg.split(' ')[0], color: styles.tooltipText.split(' ')[0], borderRadius: '0.25rem', borderColor: styles.cardBorder.split(' ')[1], fontFamily: styles.fontFamily.replace('font-','') }}
                itemStyle={{color: styles.tooltipText.split(' ')[0]}}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className={`md:col-span-2 text-center md:text-left flex flex-col justify-center h-full p-4 rounded-lg ${themeMode === ThemeMode.LIGHT ? 'bg-gray-50' : 'bg-slate-800/50'}`}>
          <div>
            <h3 className={`text-lg font-medium ${styles.textSecondary}`}>Total Farm Hashrate</h3>
            <p className={`text-4xl md:text-5xl font-bold ${styles.textAccent} my-1`}>
              {totalAverageHashrate.toFixed(2)} <span className="text-2xl md:text-3xl">TH/s</span>
            </p>
          </div>
          <div className="mt-4">
            <h3 className={`text-lg font-medium ${styles.textSecondary}`}>Est. Daily Earnings</h3>
            <p className={`text-3xl md:text-4xl font-bold ${styles.successText} my-1`}>
              ${estimatedDailyEarningsUSD.toFixed(2)}
            </p>
            <p className={`text-xs ${styles.textMuted}`}>
              (BTC Price: ${MOCK_BTC_PRICE_USD.toLocaleString()} USD, Difficulty: ${(MOCK_DIFFICULTY/1e12).toFixed(2)}T - Mock Data)
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className={`text-xl font-semibold ${styles.textPrimary} mb-1`}>Historical Farm Hashrate</h3>
        {historicalChartControls}
        <div className="h-72 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            {selectedChartType === HistoricalChartType.LINE ? (
              <LineChart data={filteredHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                  stroke={chartTextColorClass.split(' ')[0]} 
                  tick={{className: `${styles.fontFamily} text-[10px] md:text-xs ${chartTextColorClass}`}} 
                />
                <YAxis 
                  stroke={chartTextColorClass.split(' ')[0]}  
                  tick={{className: `${styles.fontFamily} text-[10px] md:text-xs ${chartTextColorClass}`}} 
                  label={{ value: 'TH/s', angle: -90, position: 'insideLeft', offset:0, className: `${styles.fontFamily} text-xs ${chartTextColorClass}` }}
                />
                <RechartsTooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} TH/s`, "Total Hashrate"]}
                    labelFormatter={(label: number) => new Date(label).toLocaleString()}
                    contentStyle={{ backgroundColor: styles.tooltipBg.split(' ')[0], color: styles.tooltipText.split(' ')[0], borderRadius: '0.25rem', borderColor: styles.cardBorder.split(' ')[1], fontFamily: styles.fontFamily.replace('font-','') }}
                    itemStyle={{color: styles.tooltipText.split(' ')[0]}}
                    cursor={{fill: themeMode === ThemeMode.DARK ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{fontFamily: styles.fontFamily.replace('font-', ''), fontSize: '0.8rem'}}/>
                <Line type="monotone" dataKey="totalRate" name="Total Hashrate" stroke={chartStrokeColor} strokeWidth={2} dot={{ r: 2, fill: chartStrokeColor }} activeDot={{ r: 6 }} />
              </LineChart>
            ) : (
              <BarChart data={filteredHistoricalData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGridColor} />
                 <XAxis 
                  dataKey="time" 
                  tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} 
                  stroke={chartTextColorClass.split(' ')[0]} 
                  tick={{className: `${styles.fontFamily} text-[10px] md:text-xs ${chartTextColorClass}`}} 
                  interval="preserveStartEnd" // Attempt to show more labels if possible
                />
                <YAxis 
                  stroke={chartTextColorClass.split(' ')[0]}  
                  tick={{className: `${styles.fontFamily} text-[10px] md:text-xs ${chartTextColorClass}`}} 
                  label={{ value: 'TH/s', angle: -90, position: 'insideLeft', offset:0, className: `${styles.fontFamily} text-xs ${chartTextColorClass}` }}
                />
                <RechartsTooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} TH/s`, "Total Hashrate"]}
                    labelFormatter={(label: number) => new Date(label).toLocaleString()}
                    contentStyle={{ backgroundColor: styles.tooltipBg.split(' ')[0], color: styles.tooltipText.split(' ')[0], borderRadius: '0.25rem', borderColor: styles.cardBorder.split(' ')[1], fontFamily: styles.fontFamily.replace('font-','') }}
                    itemStyle={{color: styles.tooltipText.split(' ')[0]}}
                    cursor={{fill: themeMode === ThemeMode.DARK ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
                />
                <Legend wrapperStyle={{fontFamily: styles.fontFamily.replace('font-', ''), fontSize: '0.8rem'}}/>
                <Bar dataKey="totalRate" name="Total Hashrate" fill={chartStrokeColor} barSize={20} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
};

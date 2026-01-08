import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface ChartDataPoint {
  label: string;
  views: number;
  saves: number;
}

interface ActivityChartProps {
  dailyData: Array<{ date: string; views: number; saves: number }>;
  weeklyData: Array<{ week: string; views: number; saves: number }>;
  monthlyData: Array<{ month: string; views: number; saves: number }>;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';
type DataType = 'views' | 'saves' | 'both';

export const ActivityChart: React.FC<ActivityChartProps> = ({
  dailyData,
  weeklyData,
  monthlyData,
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const [dataType, setDataType] = useState<DataType>('both');

  const getData = (): ChartDataPoint[] => {
    let data: ChartDataPoint[];
    switch (timeRange) {
      case 'daily':
        data = dailyData.map(d => ({ label: d.date, views: d.views, saves: d.saves }));
        // Show last 14 days on mobile for better readability
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          return data.slice(-14);
        }
        return data;
      case 'weekly':
        data = weeklyData.map(d => ({ label: d.week, views: d.views, saves: d.saves }));
        // Show last 8 weeks on mobile
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          return data.slice(-8);
        }
        return data;
      case 'monthly':
        return monthlyData.map(d => ({ label: d.month, views: d.views, saves: d.saves }));
      default:
        data = dailyData.map(d => ({ label: d.date, views: d.views, saves: d.saves }));
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          return data.slice(-14);
        }
        return data;
    }
  };

  const chartData = getData();
  const maxValue = Math.max(
    ...chartData.map(d => Math.max(d.views, d.saves)),
    10
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Activity Overview</span>
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your profile engagement over time
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2">
          {/* Time Range Selector */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button
              onClick={() => setTimeRange('daily')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === 'daily'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeRange('weekly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === 'weekly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                timeRange === 'monthly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
          </div>

          {/* Data Type Selector */}
          <div className="inline-flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
            <button
              onClick={() => setDataType('views')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dataType === 'views'
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Views
            </button>
            <button
              onClick={() => setDataType('saves')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dataType === 'saves'
                  ? 'bg-green-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Saves
            </button>
            <button
              onClick={() => setDataType('both')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                dataType === 'both'
                  ? 'bg-purple-500 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Both
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64 md:h-72 mt-4 w-full">
        <div className="absolute inset-0 flex items-end justify-between px-1 md:px-2 gap-0.5 md:gap-1">
          {chartData.map((data, index) => {
            const viewHeight = (data.views / maxValue) * 100;
            const saveHeight = (data.saves / maxValue) * 100;

            return (
              <div key={index} className="flex-1 flex flex-col items-center justify-end min-w-0 max-w-full">
                {/* Bars */}
                <div className="w-full flex justify-center items-end gap-0.5 h-44 md:h-52 mb-1">
                  {(dataType === 'views' || dataType === 'both') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${viewHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.02 }}
                      className="flex-1 min-w-0 bg-blue-500 dark:bg-blue-600 rounded-t hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors cursor-pointer group relative"
                      title={`${data.views} views`}
                    >
                      {viewHeight > 20 && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.views}
                        </span>
                      )}
                    </motion.div>
                  )}
                  {(dataType === 'saves' || dataType === 'both') && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${saveHeight}%` }}
                      transition={{ duration: 0.5, delay: index * 0.02 + 0.1 }}
                      className="flex-1 min-w-0 bg-green-500 dark:bg-green-600 rounded-t hover:bg-green-600 dark:hover:bg-green-700 transition-colors cursor-pointer group relative"
                      title={`${data.saves} saves`}
                    >
                      {saveHeight > 20 && (
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-medium text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {data.saves}
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Labels */}
                <div className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 text-center w-full mt-1 h-8 flex items-start justify-center overflow-hidden">
                  <span className="block truncate max-w-full px-0.5 leading-tight">
                    {timeRange === 'daily' 
                      ? new Date(data.label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                      : data.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {(dataType === 'views' || dataType === 'both') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Profile Views</span>
          </div>
        )}
        {(dataType === 'saves' || dataType === 'both') && (
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Contact Saves</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};


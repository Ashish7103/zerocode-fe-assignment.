import React from 'react'
import { BarChart, Activity, MessageSquare, Clock } from 'lucide-react'

const Analytics = () => {
  const stats = [
    { icon: MessageSquare, label: 'Total Messages', value: '1,234' },
    { icon: Clock, label: 'Avg. Response Time', value: '1.5s' },
    { icon: Activity, label: 'User Engagement', value: '87%' },
    { icon: BarChart, label: 'Weekly Growth', value: '+12%' }
  ]

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        Analytics Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-semibold mt-1 text-gray-800 dark:text-white">
                  {value}
                </p>
              </div>
              <Icon className="w-8 h-8 text-blue-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            Message Volume
          </h2>
          {/* Add chart component here */}
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            User Activity
          </h2>
          {/* Add chart component here */}
          <div className="h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
            Chart Placeholder
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
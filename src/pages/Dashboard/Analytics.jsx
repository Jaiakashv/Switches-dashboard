import { useState, useMemo } from 'react'
import { useCpuUsage } from '../../hooks/useCpuUsage'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format } from 'date-fns'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('24h')
  const [selectedPoint, setSelectedPoint] = useState(null)
  
  // Use custom hook for real-time CPU data
  const { data: cpuData, loading, error } = useCpuUsage(timeRange, 60000)

  const chartData = useMemo(() => {
    if (!cpuData || cpuData.length === 0) return null

    // Format labels based on time range for better readability
    const labels = cpuData.map(d => {
      const date = new Date(d.timestamp)
      if (timeRange === '1h') {
        return format(date, 'HH:mm:ss')
      } else if (timeRange === '6h') {
        return format(date, 'HH:mm')
      } else {
        return format(date, 'HH:mm')
      }
    })
    
    // Extract min, median, max from API response
    const cpuMax = cpuData.map(d => d.max)
    const cpuMedian = cpuData.map(d => d.median)
    const cpuMin = cpuData.map(d => d.min)

    return {
      labels,
      datasets: [
        {
          label: 'CPU Max',
          data: cpuMax,
          borderColor: '#EF4444', // Red
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          fill: '+1', // fill to median
          pointRadius: 0,
          tension: 0.4,
          borderWidth: 2
        },
        {
          label: 'CPU Median',
          data: cpuMedian,
          borderColor: '#3B82F6', // Blue
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: false,
          tension: 0.4,
          pointHoverRadius: 8,
          borderWidth: 2
        },
        {
          label: 'CPU Min',
          data: cpuMin,
          borderColor: '#10B981', // Green
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          fill: '-1', // fill to median
          pointRadius: 0,
          tension: 0.4,
          borderWidth: 2
        }
      ]
    }
  }, [cpuData, timeRange])

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 300, // Smooth animation for updates
      easing: 'easeInOutQuad'
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: `CPU Usage Band Chart (${timeRange.toUpperCase()})`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
          text: 'Usage (%)',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
    },
    onClick: (event, elements, chart) => {
      if (!elements.length || !cpuData) return
      const index = elements[0].index
      const dataPoint = cpuData[index]
      
      const now = Date.now()
      if (window.lastClickTime && (now - window.lastClickTime < 300)) {
        // Double click detected
        setSelectedPoint(dataPoint)
      }
      window.lastClickTime = now
    }
  }

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange)
    setSelectedPoint(null) // Clear selected point when range changes
  }

  if (loading) return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System performance and metrics</p>
      </div>
      <div className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm h-64 sm:h-80 md:h-96 flex items-center justify-center">
        <div className="text-[var(--text-muted)]">Loading CPU usage data...</div>
      </div>
    </div>
  )
  
  if (error) return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System performance and metrics</p>
      </div>
      <div className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="text-red-500">{error}</div>
      </div>
    </div>
  )

  if (!cpuData || cpuData.length === 0) return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System performance and metrics</p>
      </div>
      <div className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
        <div className="text-[var(--text-muted)]">No CPU usage data available</div>
      </div>
    </div>
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Analytics</h2>
        <p className="text-[var(--text-muted)] text-sm mt-1">System performance and metrics</p>
      </div>

      {/* Time Range Dropdown */}
      <div className="flex items-center gap-4">
        <label htmlFor="timeRange" className="text-sm font-medium text-[var(--text-muted)]">
          Time Range:
        </label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          <option value="1h">Last 1 Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="12h">Last 12 Hours</option>
          <option value="24h">Last 24 Hours</option>
        </select>
        <div className="text-xs text-[var(--text-muted)]">
          Updates every 1 minute
        </div>
      </div>

      <div className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm h-64 sm:h-80 md:h-96">
        {chartData && <Line options={chartOptions} data={chartData} />}
      </div>

      {selectedPoint && (
        <div className="bg-[var(--surface)] p-4 sm:p-6 rounded-2xl border border-[var(--border)] shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Detailed Metrics - {format(new Date(selectedPoint.timestamp), 'PPpp')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-[var(--page-bg)] rounded-xl border border-[var(--border)]">
              <div className="text-xs sm:text-sm text-[var(--text-muted)] mb-1">CPU Min</div>
              <div className="text-lg sm:text-xl font-medium text-green-600">{selectedPoint.min}%</div>
            </div>
            <div className="p-3 sm:p-4 bg-[var(--page-bg)] rounded-xl border border-[var(--border)]">
              <div className="text-xs sm:text-sm text-[var(--text-muted)] mb-1">CPU Median</div>
              <div className="text-lg sm:text-xl font-medium text-blue-600">{selectedPoint.median}%</div>
            </div>
            <div className="p-3 sm:p-4 bg-[var(--page-bg)] rounded-xl border border-[var(--border)]">
              <div className="text-xs sm:text-sm text-[var(--text-muted)] mb-1">CPU Max</div>
              <div className="text-lg sm:text-xl font-medium text-red-600">{selectedPoint.max}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

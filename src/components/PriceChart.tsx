import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface PriceChartProps {
  data: {
    labels: string[]
    prices: number[]
  }
  title: string
}

const PriceChart: React.FC<PriceChartProps> = ({ data, title }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Price',
        data: data.prices,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="w-full h-[300px] p-4 card">
      <Line data={chartData} options={options} />
    </div>
  )
}

export default PriceChart
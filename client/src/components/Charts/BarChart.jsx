import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const BarChart = ({ categoryData }) => {
  const [chartData, setChartData] = useState({
    datasets: [],
  })

  const [chartOptions, setChartOptions] = useState({})

  useEffect(() => {
    setChartData({
      labels: categoryData?.map((item) => item.category),
      datasets: [
        {
          label: `Total Products : ${categoryData?.reduce(
            (acc, item) => acc + item.productCount,
            0
          )}`,
          data: categoryData?.map((item) => item.productCount),
          fill: false,
          backgroundColor: 'rgba(53, 162, 235, 0.4)',
        },
      ],
    })
    setChartOptions({
      plugins: {
        legend: {
          position: 'top',
        },
      },
      maintainAspectRatio: false,
      responsive: true,
    })
  }, [categoryData])

  return (
    <div>
      <Bar
        height={100}
        options={chartOptions}
        data={chartData}
        style={{
          minHeight: '200px',
        }}
      />
    </div>
  )
}

export default BarChart

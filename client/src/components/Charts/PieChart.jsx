import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const PieChart = ({ productData }) => {
  const data = {
    labels: productData?.map((item) => item.name),
    datasets: [
      {
        label: 'Number of Sales',
        data: productData?.map((item) => item.count),
        backgroundColor: productData?.map(() => {
          const randomColor = `rgba(${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, 0.2)`
          return randomColor
        }),
        borderColor: productData?.map(() => {
          const randomColor = `rgba(${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, 0.2)`
          return randomColor
        }),
        borderWidth: 1,
      },
    ],
  }
  return (
    <div className='mb-20 bg-white py-3 shadow-sm px-4 rounded'>
      <h1 className='text-center text-2xl font-bold mb-2'>Total Sales </h1>
      <p className='text-center mb-7'>Total Sales according to product</p>
      <Pie height={100} data={data} />
    </div>
  )
}

export default PieChart

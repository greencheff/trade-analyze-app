import { Line } from 'react-chartjs-2'
import {
  Chart as C,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

C.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export default function Chart({ data, label = 'Fiyat' }) {
  const labels = data.map((_, i) => i)
  const values = data.map((d) => d.close)

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data: values,
        fill: false,
      },
    ],
  }

  return <Line data={chartData} />
}

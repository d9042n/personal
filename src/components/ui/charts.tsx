"use client";

import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

interface ChartProps {
  data: number[];
  labels: string[];
}

export function LineChart({ data, labels }: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        borderColor: "hsl(var(--primary))",
        backgroundColor: "hsl(var(--primary) / 0.1)",
        tension: 0.3,
      },
    ],
  };

  return <Line options={chartOptions} data={chartData} />;
}

export function BarChart({ data, labels }: ChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: "hsl(var(--primary) / 0.8)",
      },
    ],
  };

  return <Bar options={chartOptions} data={chartData} />;
}

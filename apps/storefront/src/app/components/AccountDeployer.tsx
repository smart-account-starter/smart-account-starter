"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/shadcn/ui/card"
import { SBChart } from "./StackedBarApps"
import { MSChart } from "./MarketshareBarApps"
import { DataTable } from "./DataTable"
import { Deployer, deployercolumns } from "./columns"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { LeaderboardItem, useAccountDeployerData } from "./useAccountDeployerData"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

export default function AccountDeployer() {
  const { data, loading, error } = useAccountDeployerData()
  const timeframe = "week" // You might want to make this dynamic
  const chain = "all" // You might want to make this dynamic

  let titleparam =
    timeframe === "week" ? "Weekly" : timeframe === "day" ? "Daily" : "Monthly"
  let chainlabel = chain !== "all" ? chain : ""
  const options: Highcharts.Options = {
    title: {
      text: "Number of Accounts Over Time",
    },
    xAxis: {
      categories: Array.isArray(data) ? data.map((item) => item.DATE) : [],
      title: {
        text: "Date",
      },
    },
    yAxis: {
      title: {
        text: "Number of Accounts",
      },
    },
    series: [
      {
        type: "line",
        name: "Accounts",
        data: data?.leaderboard?.map((item) => item.NUM_ACCOUNTS) || [],
      },
    ],
    tooltip: {
      formatter: function () {
        return `<b>Date:</b> ${this.x}<br><b>Accounts:</b> ${this.y}`
      },
    },
  }
  const accountsChartOptions: Highcharts.Options = {
    chart: { type: "line" },
    title: { text: "Accounts Over Time by Factory" },
    xAxis: {
      categories: Array.from(
        new Set(data?.accounts_chart?.map((item) => item.DATE) || [])
      ),
      title: { text: "Date" },
    },
    yAxis: {
      title: { text: "Number of Accounts" },
    },
    series: data?.accounts_chart?.reduce((acc: any, item: any) => {
      const series = acc.find((s: any) => s.name === item.FACTORY_NAME)
      if (series) {
        ;(series.data as any).push([item.DATE, item.NUM_ACCOUNTS])
      } else {
        acc.push({
          name: item.FACTORY_NAME,
          data: [[item.DATE, item.NUM_ACCOUNTS]],
        })
      }
      return acc
    }, [] as Highcharts.SeriesOptionsType[]),
  }
  const deploymentsChartOptions: Highcharts.Options = {
    chart: { type: "column" },
    title: { text: "Deployments Over Time by Deployer" },
    xAxis: {
      categories: Array.from(
        new Set(data?.deployments_chart?.map((item) => item.DATE) || [])
      ),
      title: { text: "Date" },
    },
    yAxis: {
      title: { text: "Number of Accounts" },
    },
    series: data?.deployments_chart?.reduce((acc: any, item: any) => {
      const series = acc.find((s: any) => s.name === item.DEPLOYER_NAME)
      if (series) {
        ;(series.data as any).push([item.DATE, item.NUM_ACCOUNTS])
      } else {
        acc.push({
          name: item.DEPLOYER_NAME,
          data: [[item.DATE, item.NUM_ACCOUNTS]],
        })
      }
      return acc
    }, [] as Highcharts.SeriesOptionsType[]),
  }

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const leaderboardChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y' as const, // This will make it a horizontal bar chart
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#333', // Dark gray color for legend labels
        },
      },
      title: {
        display: true,
        text: 'Account Deployer Leaderboard',
        color: '#333', // Dark gray color for title
        font: {
          size: 18,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Number of Accounts: ${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)', // Light gray grid lines
        },
        ticks: {
          color: '#333', // Dark gray color for x-axis labels
        },
      },
      y: {
        grid: {
          display: false, // Remove y-axis grid lines
        },
        ticks: {
          color: '#333', // Dark gray color for y-axis labels
        },
      },
    },
  };

  const leaderboardChartData = {
    labels: data?.leaderboard.map((item: LeaderboardItem) => {
      if (item.NUM_ACCOUNTS < 500000) {
        return `${item.DEPLOYER_NAME} (${item.NUM_ACCOUNTS.toLocaleString()})`;
      }
      return item.DEPLOYER_NAME;
    }) || [],
    datasets: [
      {
        label: 'Number of Accounts',
        data: data?.leaderboard.map((item: LeaderboardItem) => item.NUM_ACCOUNTS) || [],
        backgroundColor: 'rgba(53, 162, 235, 0.8)', // Slightly more opaque blue
        borderColor: 'rgba(53, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const formatNumber = (num: number) => {
    if (num >= 5000) {
      return `${Math.round(num / 1000)}k`;
    }
    return num.toLocaleString();
  };

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>Account Deployer Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] bg-white">
            <Bar options={leaderboardChartOptions} data={leaderboardChartData} />
          </div>
        </CardContent>
      </Card>
      <HighchartsReact highcharts={Highcharts} options={accountsChartOptions} />
      <HighchartsReact
        highcharts={Highcharts}
        options={deploymentsChartOptions}
      />
    </>
  )
}

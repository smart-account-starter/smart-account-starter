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
import { useAccountDeployerData } from "./useAccountDeployerData"

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

  if (loading) {
    return <LoadingIndicator />
  }

  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <DataTable
        columns={deployercolumns}
        data={data?.leaderboard || []}
        entity={false}
      />
      <HighchartsReact highcharts={Highcharts} options={accountsChartOptions} />
      <HighchartsReact
        highcharts={Highcharts}
        options={deploymentsChartOptions}
      />
    </>
  )
}

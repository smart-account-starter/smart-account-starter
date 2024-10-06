"use client"
import React from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/shadcn/ui/card"
import HighchartsReact from "highcharts-react-official"
import Highcharts from "highcharts"
import { useAccountDeployerData } from "./useAccountDeployerData"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getAccountsChartOptions, getDeploymentsChartOptions, getLeaderboardChartOptions, getLeaderboardChartData } from "../utils/chartUtils";

// Loading indicator component
const LoadingIndicator = () => (
  <div className="flex justify-center items-center p-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

export default function AccountDeployer() {
  const { data, loading, error } = useAccountDeployerData()

  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

  const accountsChartOptions = getAccountsChartOptions(data);
  const deploymentsChartOptions = getDeploymentsChartOptions(data);
  const leaderboardChartOptions = getLeaderboardChartOptions();
  const leaderboardChartData = getLeaderboardChartData(data);

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
      <HighchartsReact highcharts={Highcharts} options={deploymentsChartOptions} />
    </>
  )
}

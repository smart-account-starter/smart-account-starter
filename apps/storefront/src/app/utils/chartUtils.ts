import Highcharts from "highcharts";
import { ChartOptions } from 'chart.js';
import { LeaderboardItem } from "../components/useAccountDeployerData";

export const getAccountsChartOptions = (data: any): Highcharts.Options => ({
  chart: { type: "line" },
  title: { text: "Accounts Over Time by Factory" },
  xAxis: {
    categories: Array.from(new Set(data?.accounts_chart?.map((item: any) => item.DATE) || [])),
    title: { text: "Date" },
  },
  yAxis: {
    title: { text: "Number of Accounts" },
  },
  series: data?.accounts_chart?.reduce((acc: any, item: any) => {
    const series = acc.find((s: any) => s.name === item.FACTORY_NAME);
    if (series) {
      (series.data as any).push([item.DATE, item.NUM_ACCOUNTS]);
    } else {
      acc.push({
        name: item.FACTORY_NAME,
        data: [[item.DATE, item.NUM_ACCOUNTS]],
      });
    }
    return acc;
  }, [] as Highcharts.SeriesOptionsType[]),
});

export const getDeploymentsChartOptions = (data: any): Highcharts.Options => ({
  chart: { type: "column" },
  title: { text: "Deployments Over Time by Deployer" },
  xAxis: {
    categories: Array.from(new Set(data?.deployments_chart?.map((item: any) => item.DATE) || [])),
    title: { text: "Date" },
  },
  yAxis: {
    title: { text: "Number of Accounts" },
  },
  series: data?.deployments_chart?.reduce((acc: any, item: any) => {
    const series = acc.find((s: any) => s.name === item.DEPLOYER_NAME);
    if (series) {
      (series.data as any).push([item.DATE, item.NUM_ACCOUNTS]);
    } else {
      acc.push({
        name: item.DEPLOYER_NAME,
        data: [[item.DATE, item.NUM_ACCOUNTS]],
      });
    }
    return acc;
  }, [] as Highcharts.SeriesOptionsType[]),
});

export const getLeaderboardChartOptions = (): ChartOptions<'bar'> => ({
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#333',
      },
    },
    title: {
      display: true,
      text: 'Account Deployer Leaderboard',
      color: '#333',
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
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        color: '#333',
      },
    },
    y: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#333',
      },
    },
  },
});

export const getLeaderboardChartData = (data: any) => ({
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
      backgroundColor: 'rgba(53, 162, 235, 0.8)',
      borderColor: 'rgba(53, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
});
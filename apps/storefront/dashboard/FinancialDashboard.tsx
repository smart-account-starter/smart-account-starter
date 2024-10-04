'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@repo/ui/table";
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ArcElement);

function FinancialDashboard() {
  // Sample data for charts
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const barChartData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Expenses',
        data: [12, 19, 3, 5],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Stocks', 'Bonds', 'Cash', 'Real Estate'],
    datasets: [
      {
        data: [30, 50, 10, 10],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Financial Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$1,234,567</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$876,543</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">$358,024</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <Line data={lineChartData} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Quarterly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Bar data={barChartData} />
          </CardContent>
        </Card>
        <Card className="md:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle>Asset Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut data={doughnutChartData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>2023-06-01</TableCell>
                  <TableCell>Product Sale</TableCell>
                  <TableCell>$1,000</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-02</TableCell>
                  <TableCell>Service Fee</TableCell>
                  <TableCell>$500</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2023-06-03</TableCell>
                  <TableCell>Supplier Payment</TableCell>
                  <TableCell>-$750</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default FinancialDashboard;

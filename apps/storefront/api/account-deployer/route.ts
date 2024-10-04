import { NextResponse } from 'next/server';

interface DeployerData {
  leaderboard: any[];
  deployments_chart: any[];
  accounts_chart: any[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chain = searchParams.get('chain');
  const timeframe = 'week'; // searchParams.get('timeframe');

  if (!chain) {
    return NextResponse.json({ error: 'Chain and timeframe parameters are required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://bundlebear-api.onrender.com/account_deployer?chain=${chain}&timeframe=${timeframe}`);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const bundlerData: DeployerData = await response.json();

    return NextResponse.json(bundlerData);
  } catch (error) {
    console.error('Error fetching deployer data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

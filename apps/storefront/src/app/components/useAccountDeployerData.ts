'use client'
import { useState, useEffect } from 'react';

interface DeployerData {
    leaderboard: any[];
    deployments_chart: any[];
    accounts_chart: any[];
}

export function useAccountDeployerData() {
    const [data, setData] = useState<DeployerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch('/api/account-deployer?chain=all&timeframe=week')
            .then(response => response.json())
            .then((responseData: DeployerData) => {
                setData(responseData);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    return { data, loading, error };
}
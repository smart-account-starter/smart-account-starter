import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Token } from '@uniswap/sdk-core';
import { getQuoteWithRoute } from '../services/uniswap/QuoteService';
import debounce from 'lodash/debounce';

interface UseUniswapQuoteParams {
  sellAmount: string;
  tokenIn: Token;
  tokenOut: Token;
  fee: number;
  chainId: number;
}

export function useUniswapQuote({
  sellAmount,
  tokenIn,
  tokenOut,
  fee,
  chainId,
}: UseUniswapQuoteParams) {
  const [debouncedSellAmount, setDebouncedSellAmount] = useState(sellAmount);

  useEffect(() => {
    const debouncedSetSellAmount = debounce(setDebouncedSellAmount, 500);
    debouncedSetSellAmount(sellAmount);
    return () => debouncedSetSellAmount.cancel();
  }, [sellAmount]);

  return useQuery({
    queryKey: ['uniswapQuote', debouncedSellAmount, tokenIn.address, tokenOut.address, fee, chainId],
    queryFn: () => getQuoteWithRoute(debouncedSellAmount, tokenIn, tokenOut, chainId),
    enabled: !!debouncedSellAmount && parseFloat(debouncedSellAmount) > 0,
  });
}
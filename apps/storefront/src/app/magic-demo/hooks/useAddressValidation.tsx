import { useState, useEffect, useCallback } from 'react';
import { isAddress } from 'viem';
import debounce from 'lodash/debounce';

export function useAddressValidation(address: string) {
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);

  const validateAddress = useCallback(
    debounce((address: string) => {
      setIsValidAddress(address ? isAddress(address) : null);
    }, 300),
    []
  );

  useEffect(() => {
    validateAddress(address);
  }, [address, validateAddress]);

  return isValidAddress;
}
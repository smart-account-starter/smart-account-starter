import { parseUnits, formatUnits } from 'viem'

// const READABLE_FORM_LEN = 4

export function fromReadableAmount(amount: string, decimals: number): bigint {
  return parseUnits(amount, decimals)
}

export function toReadableAmount(rawAmount: bigint, decimals: number): string {
  return formatUnits(rawAmount, decimals)
}
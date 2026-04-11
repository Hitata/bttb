import { MASTER_NUMBERS } from './constants'

export function digitSum(n: number): number {
  let sum = 0
  let val = Math.abs(n)
  while (val > 0) {
    sum += val % 10
    val = Math.floor(val / 10)
  }
  return sum
}

export function reduce(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = digitSum(n)
  }
  return n
}

export function reduceStrict(n: number): number {
  while (n > 9) {
    n = digitSum(n)
  }
  return n
}

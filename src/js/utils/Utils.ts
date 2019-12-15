import Ticker from './Ticker'
import { rafTimeout } from './rafTimer'

export default class Utils {
  static wait(ms: number): Promise<void> {
    return new Promise(resolve => {
      rafTimeout(() => resolve(), ms)
    })
  }

  static timeout(promise: Promise<void>[], ms: number): Promise<void[] | void> {
    return Promise.race([Promise.all(promise), this.wait(ms)])
  }

  static nextTick(): Promise<void> {
    return new Promise(resolve => {
      const once = () => {
        Ticker.shared.remove(once)

        resolve()
      }

      Ticker.shared.add(once)
    })
  }

  static math = {

    lineEq(y2: number, y1: number, x2: number, x1: number, currentVal: number) {
      const m = (y2 - y1) / (x2 - x1)
      const b = y1 - m * x1

      return m * currentVal + b;
    },

    lerp(a: number, b: number, n: number) {
      return (1 - n) * a + n * b
    },

    norm(val: number, min: number, max: number) {
      if (val < min) return 0
      if (val > max) return 1

      return val === max ? 1 : (val - min) / (max - min)
    },

    map(value: number, min1: number, max1: number, min2: number, max2: number) {
      return min2 + (max2 - min2) * ((value - min1) / (max1 - min1))
    },

    hypot(n: number, m: number) {
      return Math.sqrt(n * n + m * m)
    },

    deg2rad(n: number) {
      return (n * Math.PI) / 180
    },

    rad2deg(n: number) {
      return (180 * n) / Math.PI
    }
  }
}

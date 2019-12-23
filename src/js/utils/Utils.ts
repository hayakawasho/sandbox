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
}

import Abstract from '~/js/abstracts/Abstract'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { IBootable, IStore } from '~/js/defs'
import Stats from 'stats.js'
import Ticker from '~/js/utils/Ticker'

const checkFPS = () => {
  const stats = new Stats()

  document.body.appendChild(stats.domElement)

  Ticker.shared.add(() => stats.update())
}

@injectable()
export default class extends Abstract implements IBootable {
  constructor(@inject(Services.STORE) private _store: IStore) {
    super()
  }

  boot() {
    if (process.env.NODE_ENV !== 'production') {
      checkFPS()
    }
  }
}

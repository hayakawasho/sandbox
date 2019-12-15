import Abstract from '~/js/abstracts/Abstract'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { IBootable, IStore } from '~/js/defs'
import Ua from '~/js/context/ua'

@injectable()
export default class extends Abstract implements IBootable {
  private _ua = new Ua()

  constructor(@inject(Services.STORE) private _store: IStore) {
    super()
  }

  boot() {
    const device = this._ua.device
    const os = this._ua.os
    const browser = this._ua.browser
    const engine = this._ua.engine

    if (browser !== 'ie') {
      this.html.classList.add(
        'no-ie',
        `is-${device}`,
        `is-${os}`,
        `is-${browser}`
      )
    } else {
      this.html.classList.add(
        'is-ie',
        `is-${device}`,
        `is-${os}`,
        `is-${browser}`
      )
    }

    this._store.setState({
      ua: {
        device,
        os,
        browser,
        engine
      }
    })
  }
}

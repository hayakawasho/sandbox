import UAParser from 'ua-parser-js'
import { camelCase, toLower } from 'lodash-es'
import { IUa } from '~/js/defs'

export default class Ua implements IUa {
  private _ua: UAParser = null

  constructor() {
    const parser = new UAParser()
    this._ua = parser.getResult()
  }

  get device(): string {
    let device

    switch (this._ua.device.type) {
      case 'mobile':
        device = 'sp'
        break
      case 'tablet':
        device = 'tablet'
        break
      default:
        device = 'pc'
        break
    }

    return device
  }

  get os(): string {
    return camelCase(toLower(this._ua.os.name))
  }

  get browser(): string {
    return camelCase(toLower(this._ua.browser.name))
  }

  get engine(): string {
    return this._ua.engine.name
  }
}

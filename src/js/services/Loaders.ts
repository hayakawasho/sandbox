import { IEventBus, ILoader } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { Loader as ResourceLoader } from 'resource-loader'
import * as webfontLoader from 'webfontloader'

@injectable()
export default class Loaders implements ILoader {
  public loader = new ResourceLoader()

  constructor(@inject(Services.EVENT_BUS) private _bus: IEventBus) {}

  promiseLoad(): Promise<void> {
    return new Promise(resolve => {
      this.loader.load(() => resolve())
    })
  }

  loadWebfont(fonts: string[]): Promise<void> {
    return new Promise(resolve => {
      console.time('webfont load time')
      console.log('webfont load start')

      webfontLoader.load({
        classes: false,
        timeout: 10000,
        custom: {
          families: fonts
        },
        fontloading(fontFamily, fontDescription) {
          console.log('webfont fontloading', fontFamily, fontDescription)
        },
        fontactive(fontFamily, fontDescription) {
          console.log('webfont fontactive', fontFamily, fontDescription)
        },
        fontinactive(fontFamily, fontDescription) {
          console.log('webfont fontinactive', fontFamily, fontDescription)
        },
        active() {
          console.log('webfont load complete')
          console.timeEnd('webfont load time')

          resolve()
        },
        inactive() {
          console.log('webfont load error or timeout')
          console.timeEnd('webfont load time')

          resolve()
        }
      })
    })
  }
}

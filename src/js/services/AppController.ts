import Abstract from '~/js/abstracts/Abstract'
import { IEventBus, ILoader, IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services, Events } from '~/js/const'
import Utils from '~/js/utils/Utils'
import { when } from 'mobx'

@injectable()
export default class AppController extends Abstract {
  private _currentScene = null
  private _app = document.getElementById('js-app')

  constructor(
    @inject(Services.EVENT_BUS) private _bus: IEventBus,
    @inject(Services.STORE) private _store: IStore,
    @inject(Services.LOADER) private _loaders: ILoader
  ) {
    super()

    when(
      () => this._store.state.siteLoaded,
      () => {
        this._app.classList.remove('is-loading')
      }
    )

    when(
      () => this._store.state.webfontLoaded,
      () => {
        this._app.classList.add('is-webfontloaded')
      }
    )
  }

  private async _once(scene) {
    console.time('load time')
    console.log('load start')

    await Utils.timeout(
      [
        this._loaders.loadWebfont(['Fjalla One']),
        this._loaders.promiseLoad()
      ],
      3000
    )

    console.log('load finish')
    console.timeEnd('load time')

    this._store.setState({
      siteLoaded: true,
      webfontLoaded: true
    })

    console.time('scene init time')
    console.log('scene init start')

    await scene.init()

    console.log('scene init finish')
    console.timeEnd('scene init time')

    // event to inform that the new page is ready
    this._bus.emit(Events.AFTER_PAGE_BOOT, scene)
  }

  async goto(scene) {
    if (!this._currentScene) {
      await this._once(scene)
      return
    }
  }
}

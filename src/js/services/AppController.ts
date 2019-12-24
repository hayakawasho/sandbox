import Abstract from '~/js/abstracts/Abstract'
import { IEventBus, ILoader, IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services, Events } from '~/js/const'
import Utils from '~/js/utils/Utils'
import { when } from 'mobx'

@injectable()
export default class AppController extends Abstract {
  private _currentScene = null
  private rootElement = document.getElementById('js-app')

  private get isCanvasLoaded() {
    return this._store.state.canvasLoaded
  }

  private get isWebfontLoaded() {
    return this._store.state.webfontLoaded
  }

  constructor(
    @inject(Services.EVENT_BUS) private _bus: IEventBus,
    @inject(Services.STORE) private _store: IStore,
    @inject(Services.LOADER) private _loaders: ILoader
  ) {
    super()

    when(
      () => this.isWebfontLoaded,
      () => {
        if (this.isWebfontLoaded) {
          this.rootElement.classList.add('is-webfontloaded')

          if (this.isCanvasLoaded) this._hideLooader()
        }
      }
    )

    when(
      () => this.isCanvasLoaded,
      () => {
        if (this.isCanvasLoaded && this.isWebfontLoaded) {
          this._hideLooader()
        }
      }
    )
  }

  private async _once(scene) {
    console.time('load time')
    console.log('load start')

    await Utils.timeout(
      [
        this._loaders.loadWebfont([
          'Product Sans:n7',
          'Noto Sans JP:n7'
        ]),
        this._loaders.promiseLoad()
      ],
      3000
    )

    console.log('load finish')
    console.timeEnd('load time')

    this._store.setState({
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
    if (scene.path === '/') {
      // homeはcanvas動かしていないので
      // canvasLoadedになっているとする
      this._hideLooader()
    }

    if (!this._currentScene) {
      await this._once(scene)
      return
    }
  }

  private _hideLooader() {
    this.rootElement.classList.remove('is-loading')

    this._store.setState({
      siteLoaded: true
    })
  }
}

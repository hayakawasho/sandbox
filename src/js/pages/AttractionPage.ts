import AbstractPage from '~/js/abstracts/AbstractPage'
import { inject, autoInjectable } from 'tsyringe'
import { IModuleLoader, IEventBus } from '~/js/defs'
import { Services, Events } from '~/js/const'
import Canvas from '~/js/context/webgl/Canvas'
import Particle from '~/js/context/webgl/Particle'

@autoInjectable()
export default class extends AbstractPage {
  private _canvas = new Canvas({
    mesh: new Particle({})
  })

  constructor(
    @inject(Services.MODULE_LOADER) _moduleLoader?: IModuleLoader,
    @inject(Services.EVENT_BUS) bus?: IEventBus,
  ) {
    super(_moduleLoader, bus)

    this._setup()
  }

  protected initEvents() {
    this.bus.on(Events.AFTER_PAGE_BOOT, this.onAfterPageLoad)
  }

  protected destroyEvents() {
    this.bus.off(Events.AFTER_PAGE_BOOT, this.onAfterPageLoad)
  }

  private _setup() {
    this._canvas.boot()
  }

  protected onAfterPageLoad() {

  }
}

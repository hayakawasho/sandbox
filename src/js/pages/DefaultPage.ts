import AbstractPage from '~/js/abstracts/AbstractPage'
import { inject, autoInjectable } from 'tsyringe'
import { IModuleLoader, IEventBus, IBootable } from '~/js/defs'
import { Services, Events } from '~/js/const'
import { gsap } from 'gsap/dist/gsap'

@autoInjectable()
export default class DefaultPage extends AbstractPage {
  constructor(
    @inject(Services.MODULE_LOADER) _moduleLoader?: IModuleLoader,
    @inject(Services.EVENT_BUS) bus?: IEventBus,
    @inject(Services.CANVAS) private _canvas?: IBootable
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

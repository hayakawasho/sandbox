import { container } from 'tsyringe'
import { IBootable } from '~/js/defs'
import { Services } from '~/js/const'
import WebpackDynamicImport from '~/js/services/WebpackDynamicImport'
import EventBus from '~/js/services/EventBus'
import { browserRouter } from 'prouter'

class App {
  private _bootables: Array<symbol | string> = []
  readonly container = container

  constructor() {
    this.provider(Services.MODULE_LOADER, WebpackDynamicImport)
    this.provider(Services.EVENT_BUS, EventBus)

    this.container.register(Services.ROUTER, {
      useValue: browserRouter()
    })
  }

  boot(): void {
    for (const serviceName of this._bootables) {
      if (this.container.isRegistered(serviceName)) {
        const service = this.container.resolve<IBootable>(serviceName)
        service.boot()
      }
    }
  }

  provider(token: symbol | string, ClassName): void {
    this.container.register(token, { useClass: ClassName }, { singleton: true })
  }

  bootableProvider(token: symbol | string, ClassName): void {
    this.provider(token, ClassName)
    this._bootables.push(token)
  }
}

export default App

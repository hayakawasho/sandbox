import Abstract from '~/js/abstracts/Abstract'
import { IModuleLoader, IModule, IScene, IEventBus } from '~/js/defs'
import { getNodeData } from '~/js/utils/html'
import { Events } from '~/js/const'
import * as fastdom from 'fastdom'

export default abstract class AbstractPage extends Abstract implements IScene {
  readonly context: 'static' | 'ajax' = null
  public rootElement = document.querySelector('.js-template')
  public path = ''
  private _modules: Array<IModule> = []
  private _read
  private _write

  constructor(
    private _moduleLoader: IModuleLoader,
    protected bus?: IEventBus
  ) {
    super()

    this.onAfterPageLoad = this.onAfterPageLoad.bind(this)
    this._update = this._update.bind(this)
  }

  async init(): Promise<void> {
    await this.ready()

    this.initEvents()
  }

  protected initEvents(): void {
    window.addEventListener('scroll', this._update, {
      passive: true
    })
  }

  destroy(): void {
    let i = this._modules.length

    while (i--) {
      this._modules[i].destroy()
      this._modules.splice(i)
    }
  }

  protected destroyEvents(): void {
    window.removeEventListener('scroll', this._update)

    fastdom.clear(this._read)
    fastdom.clear(this._write)
  }

  protected async ready(): Promise<void> {
    const container = this.context !== 'ajax' ? document : this.rootElement
    const moduleEls = Array.from(container.querySelectorAll('[data-module]'))

    this._modules = await moduleEls.reduce(async (promise, cur) => {
      const acc = await promise
      const props = getNodeData(cur)
      const attr = props.module
      const moduleIdents = attr.split(/,\s*|\s+/g)

      await Promise.all(
        moduleIdents.map(async name => {
          try {
            const module = await this._moduleLoader.instance<IModule>(
              name,
              cur,
              props
            )

            this._initModule(module)

            return acc.push(module)
          } catch (err) {
            console.error('page:ready', err.message)

            return null
          }
        })
      )

      return Promise.resolve(acc)
    }, Promise.resolve([]))

    // Notify all modules that page init is over.
    for (let i = 0; i < this._modules.length; i++) {
      const module = this._modules[i]
      module.onPageReady()
    }
  }

  private _initModule(module: IModule): void {
    module.init()
    module.initEvents()
  }

  protected onAfterPageLoad(): void {}

  private _update() {
    this._read = fastdom.measure(() => {
      const scrollTop = window.pageYOffset

      this._write = fastdom.mutate(() => {
        this.bus.emit(Events.SCROLL, {
          scrollTop
        })
      })
    })
  }
}

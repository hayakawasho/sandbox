import AbstractResizeObserable from '~/js/abstracts/AbstractResizeObserable'
import { autoInjectable, inject } from 'tsyringe'
import { IEventBus, IStore } from '~/js/defs'
import { Services, Events } from '~/js/const'
import * as fastdom from 'fastdom'

@autoInjectable()
export default class Viewport extends AbstractResizeObserable {
  constructor(
    el,
    props,
    @inject(Services.EVENT_BUS) private _bus?: IEventBus,
    @inject(Services.STORE) private _store?: IStore
  ) {
    super(el, props)
  }

  init() {
    super.init()

    this._store.setWindowSize(window.innerWidth, window.innerHeight)
  }

  destroy() {
    // noop
  }

  protected onResize(entry: ResizeObserverEntry) {
    const rect = entry.contentRect
    const { width, height } = rect

    this._store.setWindowSize(width, height)

    this._bus.emit(Events.RESIZE, {
      width,
      height
    })

    fastdom.measure(() => {
      const vh = window.innerHeight * 0.01

      fastdom.mutate(() => {
        this.html.style.setProperty('--vh', `${vh}px`)
      })
    })
  }
}

import AbstractModule from '~/js/abstracts/AbstractModule'

export default abstract class AbstractResizeObserable extends AbstractModule {
  private _ro: ResizeObserver = null

  init() {
    super.init()

    this._ro = new ResizeObserver(entries => {
      for (const entry of entries) {
        this.onResize(entry)
      }
    })

    this._ro.observe(this.el)
  }

  protected destroyEvents() {
    super.destroyEvents()

    if (this._ro !== null) {
      this._ro.unobserve(this.el)
      this._ro = null
    }
  }

  protected onResize(entry: ResizeObserverEntry) {}
}

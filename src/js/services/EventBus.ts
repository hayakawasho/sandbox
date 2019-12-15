import { IEventBus } from '~/js/defs'

export default class EventBus implements IEventBus {
  private _frag = document.createDocumentFragment()

  on(e: string, cb) {
    this._frag.addEventListener(e, cb)
  }

  off(e: string, cb) {
    this._frag.removeEventListener(e, cb)
  }

  once(e: string, cb) {
    const once = () => {
      this.off(e, once)
      cb()
    }
    this.on(e, once)
  }

  emit(e: string, detail?) {
    const event = new CustomEvent(e, {
      detail
    })
    this._frag.dispatchEvent(event)
  }
}

import AbstractModule from '~/js/abstracts/AbstractModule'

const HANDLE_CLASS = {
  HOVER: 'is-hover'
}

export default abstract class AbstractHover extends AbstractModule {
  constructor(el, props) {
    super(el, props)

    this.enter = this.enter.bind(this)
    this.leave = this.leave.bind(this)
  }

  initEvents() {
    if ('ontouchstart' in window) {
      this.el.addEventListener('touchstart', this.enter, {
        passive: true
      })
      this.el.addEventListener('touchend', this.leave)
    } else {
      this.el.addEventListener('mouseenter', this.enter)
      this.el.addEventListener('mouseleave', this.leave)
    }
  }

  protected destroyEvents() {
    if ('ontouchstart' in window) {
      this.el.removeEventListener('touchstart', this.enter)
      this.el.removeEventListener('touchend', this.leave)
    } else {
      this.el.removeEventListener('mouseenter', this.enter)
      this.el.removeEventListener('mouseleave', this.leave)
    }
  }

  protected enter() {
    this.el.classList.add(HANDLE_CLASS.HOVER)
  }

  protected leave() {
    this.el.classList.remove(HANDLE_CLASS.HOVER)
  }
}

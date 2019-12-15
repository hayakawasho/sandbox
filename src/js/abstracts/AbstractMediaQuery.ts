import AbstractModule from '~/js/abstracts/AbstractModule'
import mq from '~/js/mq'

export default class extends AbstractModule {
  constructor(el, props) {
    super(el, props)

    this.onSmallScreen = this.onSmallScreen.bind(this)
    this.onLargeScreen = this.onLargeScreen.bind(this)
  }

  initEvents() {
    mq.sp.addListener(this.onSmallScreen)
    mq.pc.addListener(this.onLargeScreen)
  }

  protected destoryEvents() {
    mq.sp.removeListener(this.onSmallScreen)
    mq.pc.removeListener(this.onLargeScreen)
  }

  protected onSmallScreen(mql: MediaQueryListEvent) {
    if (!mql.matches) return

    if (mq.sp.matches) {

    }
  }

  protected onLargeScreen(mql: MediaQueryListEvent) {
    if (!mql.matches) return

    if (mq.pc.matches) {

    }
  }
}

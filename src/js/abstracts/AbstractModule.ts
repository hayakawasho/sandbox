import Abstract from '~/js/abstracts/Abstract'

export default abstract class AbstractModule extends Abstract {
  constructor(protected el, protected props) {
    super()
  }

  /**
   * @abstract
   */
  init(): void {
    console.log('init', this)
  }

  /**
   * @abstract
   */
  initEvents(): void {}

  /**
   * super.destroy()
   */
  destroy(): void {
    this.destroyEvents()
  }

  /**
   * @abstract
   */
  protected destroyEvents(): void {}

  /**
   * Called once all page modules have been created.
   *
   * @abstract
   */
  onPageReady(): void {
    console.log('onPageReady', this)
  }
}

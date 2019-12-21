import { observable, computed, action } from 'mobx'
import { IUa } from '~/js/defs'

interface IState {
  siteLoaded?: boolean,
  webfontLoaded?: boolean,
  canvasLoaded?: boolean,
  ua?: IUa
}

export default class Store {
  @observable.ref
  private _state = {
    siteLoaded: false,
    webfontLoaded: false,
    canvasLoaded: false,
    ua: null
  }

  get state() {
    return this._state
  }

  @action.bound
  setState(stateUpdate: IState) {
    this._state = Object.assign({}, this._state, stateUpdate)
  }

  @observable.ref
  windowWidth = 0

  @observable.ref
  windowHeight = 0

  @computed
  get centerX(): number {
    return this.windowWidth * 0.5
  }

  @computed
  get centerY(): number {
    return this.windowHeight * 0.5
  }

  @action.bound
  setWindowSize(width: number, height: number) {
    this.windowWidth = width
    this.windowHeight = height
  }

  @observable.ref
  mouseX = 0

  @observable.ref
  mouseY = 0

  @action.bound
  setMousePos(x: number, y: number) {
    this.mouseX = x
    this.mouseY = y
  }
}

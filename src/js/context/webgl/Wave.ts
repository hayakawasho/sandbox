import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'
import Utils from '~/js/utils/Utils'
// const SimplexNoise = require('glsl-noise/simplex/2d')

const defaults = {
  len: 10,
  depth: 0,
  size: 7,
  friction: 0.01,
  mass: 1.0,
  springiness: .1,
  distance: 1.0
}

@injectable()
export default class Particle extends THREE.Group {
  private _options

  private _ticker: Ticker = new Ticker

  private _frame = 0

  private _clock = new THREE.Clock(true)

  private _geometry: THREE.Geometry = new THREE.Geometry()

  private get ww(): number {
    return this._store.windowWidth
  }

  private get wh(): number {
    return this._store.windowHeight
  }

  private get halfX(): number {
    return this._store.windowHalfX
  }

  private get halfY(): number {
    return this._store.windowHalfY
  }

  constructor(
    @inject(Services.STORE) private _store?: IStore
  ) {
    super()

    this._options = {
      ...defaults
    }

    bindAll(this, '_update')

    this._ticker.maxFPS = 60
    this._ticker.add(this._update)

    when(
      () => this._store.state.siteLoaded,
      () => {
        this._ticker.start()
      }
    )

    reaction(
      () => [this.ww, this.wh],
      ([ww, wh]) => {
        this.position.x = 0
        this.position.y = 0
      }
    )

    this.setup()
  }

  setup() {

  }

  private _update(deltaTime) {

  }
}


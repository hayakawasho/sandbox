import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'
const vertexShader = require('./vertexShader.vert').default
const fragmentShader = require('./fragShader.frag').default

const defaults = {
  radius: 14
}

@injectable()
export default class Sphere extends THREE.Group {
  private _options

  private _uniforms

  private _ticker: Ticker = new Ticker

  private _clock = new THREE.Clock(true)

  private _mesh: any

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

    this._ticker.maxFPS = 30
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
    const ww = window.innerWidth
    const wh = window.innerHeight
    const half = {
      x: ww * .5,
      y: wh * .5
    }
    const dpr = window.devicePixelRatio

    const geometry = new THREE.IcosahedronGeometry(this._options.radius, 4)

    this._uniforms = {
      time: {
        type: 'f',
        value: 0.0
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(ww * dpr, wh * dpr)
      }
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader,
      fragmentShader
    })

    this._mesh = new THREE.Mesh(
      geometry,
      material
    )

    this._mesh.scale.set(10, 10, 10)

    this.add(this._mesh)
  }

  private _update(deltaTime) {
    this._uniforms.time.value += .01 * deltaTime
  }
}


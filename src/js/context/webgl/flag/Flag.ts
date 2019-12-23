import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'
import Utils from '~/js/utils/Utils'
const vertexShader = require('./vertexShader.vert').default
const fragmentShader = require('./fragShader.frag').default

const defaults = {
  speed: 2.0,
  offset: 20.0,
  text: 'HELLO WORLD',
  fontSize: 40,
}

@injectable()
export default class Particle extends THREE.Group {
  private _options

  private _uniforms

  private _ticker: Ticker = new Ticker

  private _frame = 0

  private _clock = new THREE.Clock(true)

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

    when(
      () => this._store.state.canvasLoaded,
      async () => {
        await Utils.nextTick()
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

    this._ticker.maxFPS = 60
    this._ticker.add(this._update)

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

    const canvas = document.createElement('canvas')
    canvas.width = ww * dpr
    canvas.height = wh * dpr

    const ctx = canvas.getContext('2d')
    ctx.font = `bold ${this._options.fontSize}px Helvetica`

    const width = ctx.measureText(this._options.text).width

    ctx.fillText(
      this._options.text,
      half.x - width * .5,
      half.y + this._options.fontSize * .5
    )

    ctx.fill()

    const tex = new THREE.Texture(canvas)

    tex.needsUpdate = true

    const geometry = new THREE.PlaneGeometry(ww, wh, 200, 200)

    this._uniforms = {
			texture: {
				type: 't',
				value: tex
			},
			time: {
				type: 'f',
				value: this._frame
			},
      resolution: {
        type: '2f'
      }
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader,
      fragmentShader,
      transparent : true
    })

    const mesh = new THREE.Mesh(geometry, material)

    this.add(mesh)
  }

  private _update(deltaTime) {
    const delta = this._clock.getDelta()

    this._uniforms.time.value += delta
  }
}


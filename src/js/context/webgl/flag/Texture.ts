import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'

const vertexShader = require('./vertShader.vert').default
const fragmentShader = require('./fragShader.frag').default

const defaults = {
  offset: 25.0,
  fontSize: 240,
}

const text = 'Hello World'

@injectable()
export default class extends THREE.Group {
  private _options

  private _uniforms

  private _ticker: Ticker = new Ticker

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

    const canvas = document.createElement('canvas')
		canvas.height = 2048
    canvas.width = canvas.height * ww / wh

    const ctx = canvas.getContext('2d')
		ctx.font = 'Bold '+ this._options.fontSize +'px Helvetica'
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 4

    const width = ctx.measureText(text).width

    ctx.strokeText(text, canvas.width * .5 - width * .5, canvas.height * .5 + this._options.fontSize / (2 * 1.5))
		ctx.stroke()

    const texture = new THREE.Texture(canvas)
		texture.needsUpdate = true

    const geometry = new THREE.PlaneGeometry(ww, wh)

    this._uniforms = {
			texture1: {
				type: 't',
				value: texture
			},
			time: {
				type: 'f',
				value: 0.0
      },
			offset: {
				type: 'f',
				value: this._options.offset
			},
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(ww, wh)
      }
    }

    const material = new THREE.ShaderMaterial({
      uniforms: this._uniforms,
      vertexShader,
      fragmentShader
    })

    const mesh = new THREE.Mesh(geometry, material)

		this.add(mesh)
  }

  private _update(deltaTime) {
    this._uniforms.time.value += .01 * deltaTime
  }
}


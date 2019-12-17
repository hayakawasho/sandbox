import * as THREE from 'three'
import { gsap } from 'gsap'
import { IStore } from '~/js/defs'
import { inject, autoInjectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'

const defaults = {
  len: 10000,
  depth: 0
}

@autoInjectable()
export default class Particle extends THREE.Group {
  private _app: {
    geometry: THREE.Geometry,
    material: THREE.PointsMaterial
  } = {
    geometry: null,
    material: null
  }
  private _ticker: Ticker = new Ticker
  private _clock = new THREE.Clock(true)
  private _tick = null
  private _frame = 1

  private _posOfForce = new THREE.Vector3(0, 0, 0)
  private _velocity: Array<THREE.Vector3> = []
  private _force: Array<THREE.Vector3> = []
  private _friction

  private get ww(): number {
    return this._store.windowWidth
  }

  private get wh(): number {
    return this._store.windowHeight
  }

  private get centerX(): number {
    return this._store.centerX
  }

  private get centerY(): number {
    return this._store.centerY
  }

  constructor(@inject(Services.STORE) private _store?: IStore) {
    super()

    bindAll(this, '_update')

    when(
      () => this._store.state.canvasLoaded,
      () => {
        this._ticker.start()
      }
    )

    reaction(
      () => [this.ww, this.wh],
      ([ww, wh]) => {
        this._resize(ww, wh)
      }
    )

    this.setup()
  }

  setup() {
    const ww = window.innerWidth
    const wh = window.innerHeight

    this._ticker.maxFPS = 60
    this._ticker.add(this._update)

    this._app.geometry = new THREE.Geometry()

    for (let i = 0; i < defaults.len; i++) {
      const vertex = new THREE.Vector3(0, 0, 0)
      vertex.x = THREE.Math.randFloat(0, ww)
      vertex.y = THREE.Math.randFloat(0, wh)
      vertex.z = THREE.Math.randFloat(0, defaults.depth)

      const velocity = new THREE.Vector3(0, 0, 0)
      velocity.x = THREE.Math.randFloat(-10, 10)
      velocity.y = THREE.Math.randFloat(-10, 10)

      this._velocity.push(velocity)
      this._app.geometry.vertices.push(vertex)
    }

    this._app.material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 2
    })

    const mesh = new THREE.Points(this._app.geometry, this._app.material)

    this.add(mesh)
  }

  private _update(deltaTime) {
    this._app.geometry.verticesNeedUpdate = true

    const delta = this._clock.getDelta()

    this._tick += delta * 0.1 * deltaTime

    for (let i = 0; i < defaults.len; i++) {
      const p = this._app.geometry.vertices[i]
      const v = this._velocity[i]

      p.x += v.x
      p.y += v.y
      p.z += v.z

      if (p.x < 0 || p.x > this.ww) {
        v.x *= -1
      }

      if (p.y < 0 || p.y > this.wh) {
        v.y *= -1
      }
    }
  }

  private _resize(ww, wh) {
    this.position.x = -this.centerX
    this.position.y = - this.centerY
  }
}

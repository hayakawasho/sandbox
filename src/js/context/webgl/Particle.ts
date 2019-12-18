import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, autoInjectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'
import Utils from '~/js/utils/Utils'

const defaults = {
  len: 10000,
  depth: 0,
  size: 1,
  friction: 0.01
}

@autoInjectable()
export default class Particle extends THREE.Group {
  private _app: {
    geometry: THREE.Geometry,
    material: THREE.PointsMaterial
  } = {
    geometry: new THREE.Geometry(),
    material: new THREE.PointsMaterial({
      color: 0x000000,
      size: defaults.size
    })
  }
  private _ticker: Ticker = new Ticker
  private _velocity: Array<THREE.Vector3> = []
  private _force: Array<THREE.Vector3> = []

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
      async () => {
        await Utils.nextTick()
        this._ticker.start()
      }
    )

    reaction(
      () => [this.ww, this.wh],
      ([ww, wh]) => {
        this.position.x = -this.centerX
        this.position.y = -this.centerY
      }
    )

    this._ticker.maxFPS = 60
    this._ticker.add(this._update)

    this.setup()
  }

  setup() {
    const ww = window.innerWidth
    const wh = window.innerHeight

    for (let i = 0; i < defaults.len; i++) {
      const pos = new THREE.Vector3(0, 0, 0)
      pos.x = THREE.Math.randFloat(0, ww)
      pos.y = THREE.Math.randFloat(0, wh)
      pos.z = THREE.Math.randFloat(-defaults.depth, defaults.depth)

      const len = Math.random() * 20
      const r = Math.random() * Math.PI * 2

      const velocity = new THREE.Vector3(0, 0, 0)
      velocity.x = Math.cos(r) * len
      velocity.y = Math.sin(r) * len

      this._velocity.push(velocity)

      this._force.push(new THREE.Vector3(0, 0, 0))

      this._app.geometry.vertices.push(pos)
    }

    const mesh = new THREE.Points(this._app.geometry, this._app.material)

    this.add(mesh)
  }

  private _update(deltaTime) {
    this._app.geometry.verticesNeedUpdate = true

    for (let i = 0; i < defaults.len; i++) {
      const pos = this._app.geometry.vertices[i]
      const f = this._force[i]
      const v = this._velocity[i]

      this._resetForce(f)

      this._addForce(f, 0, -0.5)

      this._updateForce(f, v)

      this._updatePos(pos, f, v)

      if (pos.x > this.ww) {
        pos.x = this.ww
        v.x *= -1
      }

      if (pos.x < 0) {
        pos.x = 0
        v.x *= -1
      }

      if (pos.y > this.wh) {
        pos.y = this.wh
        v.y *= -1
      }

      if (pos.y < 0) {
        pos.y = 0
        v.y *= -1
      }
    }
  }

  private _resetForce(force) {
    force.x = 0
    force.y = 0
  }

  private _addForce(force, forceX: number, forceY: number) {
    force.x += forceX
    force.y += forceY
  }

  private _updateForce(force, velocity) {
    force.x -= velocity.x * defaults.friction
    force.y -= velocity.y * defaults.friction
  }

  private _updatePos(pos, force, velocity) {
    velocity.x += force.x
    velocity.y += force.y

    pos.x += velocity.x
    pos.y += velocity.y
  }
}


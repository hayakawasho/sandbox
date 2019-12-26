import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'

const defaults = {
  len: 10000,
  depth: 0,
  size: 1,
  friction: 0.01,
  mass: 1.0,
  radius: 5.0,
  speed: {
    x: 1.24,
    y: 1.5,
  }
}

let tick = 0

interface IVex {
  force: Array<THREE.Vector3>
  velocity: Array<THREE.Vector3>
}

@injectable()
export default class extends THREE.Group {
  private _options

  private _ticker: Ticker = new Ticker

  private _frame = 0

  private _clock = new THREE.Clock(true)

  private _geometry: THREE.Geometry = new THREE.Geometry()

  private _posOfForce = new THREE.Vector3(0, 0, 0)

  private _phase: 'attraction' | 'repulsion' = 'attraction'

  private _vex: IVex = {
    force: [],
    velocity: []
  }

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
    const ww = window.innerWidth
    const wh = window.innerHeight
    const half = {
      w: ww * .5,
      h: wh * .5
    }

    for (let i = 0; i < this._options.len; i++) {
      const pos = new THREE.Vector3(0, 0, 0)
      pos.x = THREE.Math.randFloat(-half.w, half.w)
      pos.y = THREE.Math.randFloat(-half.h, half.h)
      pos.z = THREE.Math.randFloat(
        -this._options.depth,
        this._options.depth
      )

      const v = new THREE.Vector3(0, 0, 0)

      const f = new THREE.Vector3(0, 0, 0)

      this._vex.force.push(f)

      this._vex.velocity.push(v)

      this._geometry.vertices.push(pos)
    }

    const material = new THREE.PointsMaterial({
      color: 0x000000,
      size: this._options.size
    })

    const mesh = new THREE.Points(
      this._geometry,
      material
    )

    this.add(mesh)
  }

  private _update(deltaTime) {
    this._geometry.verticesNeedUpdate = true

    const delta = this._clock.getDelta()

    tick += delta * .1

    const posX = Math.cos(tick * this._options.speed.x)
    const posY = Math.sin(tick * this._options.speed.y)

    // center
    if (this._frame < 1) {
      this._posOfForce.x = posX
      this._posOfForce.y = posY
    } else {
      this._posOfForce.x = posX * -this.halfX
      this._posOfForce.y = posY * this.halfY
    }

    for (let i = 0; i < this._options.len; i++) {
      const p = this._geometry.vertices[i]
      const f = this._vex.force[i]
      const v = this._vex.velocity[i]

      this._resetForce(f)

      this._updateForce(f, v)

      if (this._phase === 'attraction') {
        this._addAttractionForce(
          p,
          f,
          this._posOfForce.x,
          this._posOfForce.y,
          this._posOfForce.z,
          900,
          0.02
        )
        this._addRepulsionForce(
          p,
          f,
          this._posOfForce.x * 0.5,
          this._posOfForce.y * 0.5,
          this._posOfForce.z * 0.5,
          200,
          0.02
        )
      } else if (this._phase === 'repulsion') {
        this._addAttractionForce(
          p,
          f,
          this._posOfForce.x * -0.5,
          this._posOfForce.y * -0.5,
          this._posOfForce.z * -0.5,
          500,
          0.02
        )
        this._addRepulsionForce(
          p,
          f,
          this._posOfForce.x,
          this._posOfForce.y,
          this._posOfForce.z,
          300,
          0.02
        )
      }

      this._updatePos(p, f, v)

      if (p.x > this.halfX) {
        // v.x *= -1
        p.x = -this.halfX
      }

      if (p.y > this.halfY) {
        // v.y *= -1
        p.y = -this.halfY
      }

      if (p.x < -this.halfX) {
        // v.x *= -1
        p.x = this.halfX
      }

      if (p.y < -this.halfY) {
        // v.y *= -1
        p.y = this.halfY
      }
    }

    if (this._frame % (60 * 8) === 0) {
      if (this._phase === 'attraction') {
        this._phase = 'repulsion'
      } else if (this._phase === 'repulsion') {
        this._phase = 'attraction';
      }
    }

    this._frame++
  }

  private _resetForce(force) {
    force.x = 0
    force.y = 0
  }

  private _updateForce(force, velocity) {
    force.x -= velocity.x * this._options.friction * 0.41
    force.y -= velocity.y * this._options.friction * 0.41
  }

  private _updatePos(vex, force, velocity) {
    velocity.x += force.x * 0.41
    velocity.y += force.y * 0.41

    vex.x += velocity.x
    vex.y += velocity.y
  }

  private _addAttractionForce(
    vex, force, forceX, forceY, forceZ, radius, scale
  ) {
    let diff = new THREE.Vector3(0, 0, 0)
    diff.x = vex.x - forceX
    diff.y = vex.y - forceY
    diff.z = vex.z - forceZ

    const l = diff.length()

    if (l < radius) {
      const pct = 1 - (l / radius) // normalize

      diff.normalize()

      force.x = force.x - (diff.x * scale * pct)
      force.y = force.y - (diff.y * scale * pct)
      force.z = force.z - (diff.z * scale * pct)
    }
  }

  private _addRepulsionForce(
    vex, force, forceX, forceY, forceZ, radius, scale
  ) {
    let diff = new THREE.Vector3(0, 0, 0)
    diff.x = vex.x - forceX
    diff.y = vex.y - forceY
    diff.z = vex.z - forceZ

    const l = diff.length()

    if (l < radius) {
      const pct = 1 - (l / radius) // normalize

      diff.normalize()

      force.x = force.x + (diff.x * scale * pct)
      force.y = force.y + (diff.y * scale * pct)
      force.z = force.z + (diff.z * scale * pct)
    }
  }
}


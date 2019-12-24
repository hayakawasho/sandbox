import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when, reaction } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'
import Utils from '~/js/utils/Utils'

const defaults = {
  len: 10,
  depth: 0,
  size: 7,
  friction: 0.01,
  mass: 1.0,
  springiness: .1,
  distance: 1.0
}

let tick = 0

interface ISpring {
  pos: {
    start: Array<THREE.Vector3>,
    end: Array<THREE.Vector3>
  }
}

@injectable()
export default class Particle extends THREE.Group {
  private _options

  private _ticker: Ticker = new Ticker

  private _frame = 0

  private _clock = new THREE.Clock(true)

  private _geometry: THREE.Geometry = new THREE.Geometry()

  private _spring: ISpring = {
    pos: {
      start: [],
      end: []
    }
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
      x: ww * .5,
      y: wh * .5
    }

    for (let i = 0; i < this._options.len; i++) {
      const pos = new THREE.Vector3(0, 0, 0)
      pos.x = 0
      pos.y = i * -20 + 100

      this._geometry.vertices.push(pos)
    }

    for (let i = 0; i < this._options.len - 1; i++) {
      const p1 = this._geometry.vertices[i]
      const p2 = this._geometry.vertices[i + 1]

      this._spring.pos.start.push(p1)
      this._spring.pos.end.push(p2)
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

    tick += delta * 0.1

    for (let i = 0; i < this._options.len - 1; i++) {
      const startPos = this._spring.pos.start[i]
      const endPos = this._spring.pos.end[i]

      const d = startPos.length() - endPos.length()
      const f = this._options.springiness * (this._options.distance - d)
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
}


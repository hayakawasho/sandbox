import * as THREE from 'three'
import { gsap } from 'gsap'
import { IStore } from '~/js/defs'
import { inject, autoInjectable } from 'tsyringe'
import { Services } from '~/js/const'
import { when } from 'mobx'
import { bindAll } from 'lodash-es'
import { Ticker } from '@pixi/ticker'

const defaults = {
  len: 10000,
  depth: 0,
  speed: {
    horizontal: 1,
    vertical: 1.5,
  }
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
  private _posOfForce = new THREE.Vector3(0, 0, 0)
  private _clock = new THREE.Clock(true)
  private _tick = null
  private _forcePhase: 'attraction' | 'repulsion' = 'attraction'
  private _frame = 1

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

    this.setup()
  }

  setup() {
    const ww = window.innerWidth
    const wh = window.innerHeight

    this._ticker.maxFPS = 60
    this._ticker.add(this._update)

    this._app.geometry = new THREE.Geometry()

    for (let i = 0; i < defaults.len; i++) {
      const vertex: any = new THREE.Vector3(0, 0, 0)
      vertex.x = THREE.Math.randFloat(-ww, ww)
      vertex.y = THREE.Math.randFloat(-wh, wh)
      vertex.z = THREE.Math.randFloat(-defaults.depth, defaults.depth)

      vertex.velocity = new THREE.Vector3(0, 0, 0)
      vertex.force = new THREE.Vector3(0, 0, 0)
      vertex.friction = 0.01
      vertex.mass = 1.0

      this._app.geometry.vertices.push(vertex)
    }

    this._app.material = new THREE.PointsMaterial({
      color: 0x000000,
      size: 1
    })

    const mesh = new THREE.Points(this._app.geometry, this._app.material)

    this.add(mesh)
  }

  private _update(deltaTime) {
    this._app.geometry.verticesNeedUpdate = true

    const delta = this._clock.getDelta()

    this._tick += delta * 0.1 * deltaTime

    // center
    if (this._tick < 1) {
      this._posOfForce.set(
        Math.cos(this._tick * defaults.speed.horizontal) * 50 * deltaTime,
        Math.sin(this._tick * defaults.speed.vertical) * 50 * deltaTime,
        0
      )
    } else {
      this._posOfForce.set(
        Math.cos(this._tick * defaults.speed.horizontal) * this.ww * -0.5 * deltaTime,
        Math.sin(this._tick * defaults.speed.vertical) * this.wh * 0.5 * deltaTime,
        0
      )
    }

    for (let i = 0; i < defaults.len; i++) {
      const particle = this._app.geometry.vertices[i]
      this._vertexUpdate(particle, this._posOfForce, deltaTime)
    }

    if (this._frame % (60 * 8) === 0) {
      if (this._forcePhase === 'attraction') {
        this._forcePhase = 'repulsion'
      } else if (this._forcePhase === 'repulsion') {
        this._forcePhase = 'attraction';
      }
    }

    this._frame++
  }

  private _vertexUpdate(vertex, posOfForce, deltaTime) {
    vertex.force.set(
      (vertex.force.x - vertex.velocity.x * vertex.friction) * 0.41 * deltaTime,
      (vertex.force.y - vertex.velocity.y * vertex.friction) * 0.41 * deltaTime,
      (vertex.force.z - vertex.velocity.z * vertex.friction) * 0.41 * deltaTime
    )

    if (this._forcePhase === 'attraction') {
      this.attraction(
        vertex,
        posOfForce.x,
        posOfForce.y,
        posOfForce.z,
        900,
        0.02
      )
      this.repulsion(
        vertex,
        posOfForce.x * 0.5,
        posOfForce.y * 0.5,
        posOfForce.z * 0.5,
        200,
        0.02
      )
    } else if (this._forcePhase === 'repulsion') {
      this.attraction(
        vertex,
        posOfForce.x * -0.5,
        posOfForce.y * -0.5,
        posOfForce.z * -0.5,
        500,
        0.02
      )
      this.repulsion(
        vertex,
        posOfForce.x,
        posOfForce.y,
        posOfForce.z,
        300,
        0.02
      )
    }

    vertex.velocity.x += vertex.force.x * 0.41 * deltaTime;
    vertex.velocity.y += vertex.force.y * 0.41 * deltaTime;
    vertex.velocity.z += vertex.force.z * 0.41 * deltaTime;

    vertex.x += vertex.velocity.x * deltaTime;
    vertex.y += vertex.velocity.y * deltaTime;
    vertex.z += vertex.velocity.z * deltaTime;

    // 端まで来たら戻る
    if (vertex.x > this.ww) {
      // vertex.velocity.x = vertex.velocity.x * -1;
      vertex.x = -this.ww;
    }
    if (vertex.y > this.wh) {
      // vertex.velocity.y = vertex.velocity.y * -1;
      vertex.y = -this.wh;
    }
    if (vertex.z > defaults.depth) {
      // vertex.velocity.z = vertex.velocity.z * -1;
      vertex.z = -defaults.depth;
    }
    if (vertex.x < -this.ww) {
      // vertex.velocity.x = vertex.velocity.x * -1;
      vertex.x = this.ww;
    }
    if (vertex.y < -this.wh) {
      // vertex.velocity.y = vertex.velocity.y * -1;
      vertex.y = this.wh;
    }
    if (vertex.z < -defaults.depth) {
      // vertex.velocity.z = vertex.velocity.z * -1;
      vertex.z = defaults.depth;
    }
  }

  // 引き付ける
  attraction(vertex, forceX, forceY, forceZ, radius, scale){
    const posOfForce = new THREE.Vector3(forceX, forceY, forceZ);

    let diff = new THREE.Vector3;
    diff.x = vertex.x - posOfForce.x;
    diff.y = vertex.y - posOfForce.y;
    diff.z = vertex.z - posOfForce.z;

    const length = diff.length();

    let bAmCloseEnough = true;

    if(radius > 0){
      if(length > radius){
        bAmCloseEnough = false;
      }
    }

    if(bAmCloseEnough == true) {
      const pct = 1 - (length / radius);
      diff.normalize();
      vertex.force.x = vertex.force.x - diff.x * scale * pct;
      vertex.force.y = vertex.force.y - diff.y * scale * pct;
      vertex.force.z = vertex.force.y - diff.y * scale * pct;
    }
  }

  // 反発する
  repulsion(vertex, forceX, forceY, forceZ, radius, scale) {
    const posOfForce = new THREE.Vector3(forceX, forceY, forceZ);

    let diff = new THREE.Vector3;
    diff.x = vertex.x - posOfForce.x;
    diff.y = vertex.y - posOfForce.y;
    diff.z = vertex.z - posOfForce.z;

    const length = diff.length();

    let bAmCloseEnough = true;

    if(radius > 0){
      if(length > radius){
        bAmCloseEnough = false;
      }
    }

    if(bAmCloseEnough == true) {
      const pct = 1 - (length / radius);
      diff.normalize();
      vertex.force.x = vertex.force.x + diff.x * scale * pct;
      vertex.force.y = vertex.force.y + diff.y * scale * pct;
      vertex.force.z = vertex.force.y + diff.y * scale * pct;
    }
  }
}

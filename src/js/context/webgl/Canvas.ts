import * as THREE from 'three'
import { IStore, IBootable } from '~/js/defs'
import { inject, autoInjectable } from 'tsyringe'
import { Services } from '~/js/const'
import { reaction, when } from 'mobx'
import { bindAll } from 'lodash-es'
import { deg2rad } from '~/js/utils/math'
import { isProd } from '~/js/env'

interface IPointerDelta {
  x: number
  y: number
}

@autoInjectable()
export default class Canvas implements IBootable {
  private elements = {
    wrap: document.getElementById('js-canvas-wrap')
  }

  private _app: {
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
  } = {
    renderer: null,
    scene: null,
    camera: null
  }

  private _requestId: number = 0

  private isDrag = false

  private _touchStartDelta!: IPointerDelta

  private _lastTouchMoveAmount: IPointerDelta = {
    x: 0,
    y: 0
  }

  private get ww(): number {
    return this._store.windowWidth
  }

  private get wh(): number {
    return this._store.windowHeight
  }

  private get halfY(): number {
    return this._store.windowHalfY
  }

  constructor(
    @inject(Services.STORE) private _store?: IStore,
    @inject(Services.CANVAS_MESH) private _mesh?: THREE.Group
  ) {

    bindAll(this, '_onMouseMove', '_onTouchStart', '_onTouchMove', '_onTouchend')

    when(
      () => this._store.state.canvasLoaded,
      () => {
        this.elements.wrap.classList.add('is-visible')

        this.animate()

        this.addEvents()
      }
    )

    reaction(
      () => [this.ww, this.wh],
      ([ww, wh]) => {
        if (!this._app.renderer) return
        this._resize(ww, wh)
      }
    )
  }

  boot() {
    const ww = window.innerWidth
    const wh = window.innerHeight

    this._app.renderer = new THREE.WebGLRenderer({
      canvas: this.elements.wrap.getElementsByTagName('canvas')[0],
      alpha: true
    })
    this._app.renderer.setPixelRatio(window.devicePixelRatio)
    this._app.renderer.setSize(ww, wh)
    // this._app.renderer.setClearColor(new THREE.Color(0xffffff), 1.0)

    this._app.scene = new THREE.Scene()

    this._app.camera = new THREE.PerspectiveCamera(
      60,
      ww / wh,
      10,
      10000
    )
    this._app.camera.lookAt(this._app.scene.position)

    // let light = new THREE.AmbientLight(0xffffff, 1.0)
    // this._app.scene.add(light)

    this._app.scene.add(this._mesh)

    if (!isProd) {
      const axesHelper = new THREE.AxesHelper(10)
      this._app.scene.add(axesHelper)
    }

    this._store.setState({
      canvasLoaded: true
    })
  }

  addEvents() {
    if ('ontouchstart' in window !== true) {
      window.addEventListener('mousemove', this._onMouseMove)
    }

    window.addEventListener('touchstart', this._onTouchStart)
    window.addEventListener('touchmove', this._onTouchMove)
    window.addEventListener('touchend', this._onTouchend)
    window.addEventListener('touchcancel', this._onTouchend)
  }

  removeEvents() {
    if ('ontouchstart' in window !== true) {
      window.removeEventListener('mousemove', this._onMouseMove)
    }

    window.removeEventListener('touchstart', this._onTouchStart)
    window.removeEventListener('touchmove', this._onTouchMove)
    window.removeEventListener('touchend', this._onTouchend)
    window.removeEventListener('touchcancel', this._onTouchend)
  }

  animate() {
    this._requestId = requestAnimationFrame(this.animate.bind(this))

    this._app.renderer.render(this._app.scene, this._app.camera)
  }

  stop() {
    cancelAnimationFrame(this._requestId)
  }

  private _resize(ww, wh) {
    const radFov = deg2rad(this._app.camera.fov)

    this._app.camera.aspect = ww / wh

    this._app.camera.position.z = this.halfY / Math.tan(radFov * 0.5)

    this._app.camera.updateProjectionMatrix()

    this._app.renderer.setSize(ww, wh)
  }

  private _onMouseMove(e: MouseEvent) {

  }

  private _onTouchStart(e: TouchEvent) {
    this.isDrag = true
  }

  private _onTouchMove(e: TouchEvent) {

  }

  private _onTouchend(e: TouchEvent) {
    this.isDrag = false
  }


  private _getDelta(x: number, y: number) {

  }
}

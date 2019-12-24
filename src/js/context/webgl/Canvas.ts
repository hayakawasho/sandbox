import * as THREE from 'three'
import { IStore } from '~/js/defs'
import { inject, injectable } from 'tsyringe'
import { Services } from '~/js/const'
import { reaction, when } from 'mobx'
import { bindAll } from 'lodash-es'
import { deg2rad } from '~/js/utils/math'
import { isProd } from '~/js/env'
import Abstract from '~/js/abstracts/Abstract'

interface IPointerDelta {
  x: number
  y: number
}

@injectable()
export default class Canvas extends Abstract {
  private elements = {
    wrap: document.getElementById('js-canvas-wrap')
  }

  public app: {
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
    super()

    bindAll(this, 'onMouseMove', 'onTouchStart', 'onTouchMove', 'onTouchend')

    when(
      () => this._store.state.canvasLoaded,
      () => {
        this.elements.wrap.classList.add('is-visible')

        this.start()

        this.initEvents()
      }
    )

    reaction(
      () => [this.ww, this.wh],
      ([ww, wh]) => {
        if (!this.app.renderer) return
        this._resize(ww, wh)
      }
    )
  }

  init() {
    const ww = window.innerWidth
    const wh = window.innerHeight

    this.app.renderer = new THREE.WebGLRenderer({
      canvas: this.elements.wrap.getElementsByTagName('canvas')[0],
      alpha: true
    })
    this.app.renderer.setPixelRatio(window.devicePixelRatio)
    this.app.renderer.setSize(ww, wh)

    // this.app.renderer.setClearColor(new THREE.Color(0xffffff), 1.0)

    this.app.scene = new THREE.Scene()

    this.app.camera = new THREE.PerspectiveCamera(
      60,
      ww / wh,
      10,
      10000
    )
    this.app.camera.lookAt(this.app.scene.position)

    // let light = new THREE.AmbientLight(0xffffff, 1.0)
    // this.app.scene.add(light)

    this.app.scene.add(this._mesh)

    if (!isProd) {
      const axesHelper = new THREE.AxesHelper(10)
      this.app.scene.add(axesHelper)
    }

    this._store.setState({
      canvasLoaded: true
    })
  }

  destroy() {

  }

  protected initEvents() {
    if ('ontouchstart' in window !== true) {
      window.addEventListener('mousemove', this.onMouseMove)
    }

    window.addEventListener('touchstart', this.onTouchStart)
    window.addEventListener('touchmove', this.onTouchMove)
    window.addEventListener('touchend', this.onTouchend)
    window.addEventListener('touchcancel', this.onTouchend)
  }

  protected destroyEvents() {
    if ('ontouchstart' in window !== true) {
      window.removeEventListener('mousemove', this.onMouseMove)
    }

    window.removeEventListener('touchstart', this.onTouchStart)
    window.removeEventListener('touchmove', this.onTouchMove)
    window.removeEventListener('touchend', this.onTouchend)
    window.removeEventListener('touchcancel', this.onTouchend)
  }

  start() {
    this._requestId = requestAnimationFrame(this.start.bind(this))

    this.app.renderer.render(this.app.scene, this.app.camera)
  }

  stop() {
    cancelAnimationFrame(this._requestId)
  }

  private _resize(ww, wh) {
    const radFov = deg2rad(this.app.camera.fov)

    this.app.camera.aspect = ww / wh

    this.app.camera.position.z = this.halfY / Math.tan(radFov * 0.5)

    this.app.camera.updateProjectionMatrix()

    this.app.renderer.setSize(ww, wh)
  }

  protected onMouseMove(e: MouseEvent) {

  }

  protected onTouchStart(e: TouchEvent) {
    this.isDrag = true
  }

  protected onTouchMove(e: TouchEvent) {

  }

  protected onTouchend(e: TouchEvent) {
    this.isDrag = false
  }


  protected getDelta(x: number, y: number) {

  }
}

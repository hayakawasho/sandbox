import * as THREE from 'three'
import { IStore, IBootable } from '~/js/defs'
import { inject, autoInjectable } from 'tsyringe'
import { Services } from '~/js/const'
import { reaction, when } from 'mobx'

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
    when(
      () => this._store.state.canvasLoaded,
      () => {
        this.elements.wrap.classList.add('is-visible')
        this.animate()
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

    this._app.scene = new THREE.Scene()

    this._app.camera = new THREE.PerspectiveCamera(
      60,
      ww / wh,
      10,
      10000
    )
    this._app.camera.lookAt(this._app.scene.position)

    this._app.scene.add(this._mesh)

    this._store.setState({
      canvasLoaded: true
    })
  }

  animate() {
    this._requestId = requestAnimationFrame(this.animate.bind(this))

    this._app.renderer.render(this._app.scene, this._app.camera)
  }

  stop() {
    cancelAnimationFrame(this._requestId)
  }

  private _resize(ww, wh) {
    const radFov = (this._app.camera.fov * Math.PI) / 180

    this._app.camera.aspect = ww / wh

    this._app.camera.position.z = this.halfY / Math.tan(radFov * 0.5)

    this._app.camera.updateProjectionMatrix()

    this._app.renderer.setSize(ww, wh)
  }
}

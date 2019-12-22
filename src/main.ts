import '~/css'
import 'reflect-metadata'
import App from '~/js/App'
import * as Stores from '~/js/stores'
import { Services } from '~/js/const'
import { IRouter } from '~/js/defs'
import Loaders from '~/js/services/Loaders'
import AppController from '~/js/services/AppController'
import UaBootable from '~/js/services/UaBootable'
import Bootstrap from '~/js/services/Bootstrap'
import LoadModule from '~/js/services/LoadModule'
import DefaultPage from '~/js/pages/DefaultPage'
import CanvasPage from '~/js/pages/CanvasPage'
import Particle from '~/js/context/webgl/Particle'
import Bound from '~/js/context/webgl/Bound'
import Spring from '~/js/context/webgl/Spring'

;
(() => {
  // BEING IMPORTANT (Bug Safari 10.1)
  // DO NOT REMOVE
  if ((window as any).MAIN_EXECUTED) {
    throw new Error('Safari 10')
  }

  ;(window as any).MAIN_EXECUTED = true
  // END IMPORTANT

  const app = new App()

  // add services
  app.provider(Services.LOADER, Loaders)
  app.provider(Services.STORE, Stores.common)
  app.provider(Services.APP_CONTROLLER, AppController)
  app.provider(Services.MODULE_LOADER, LoadModule)

  // add bootable services
  app.bootableProvider(Services.UA, UaBootable)
  app.bootableProvider(Services.BOOT, Bootstrap)

  const controller = app.container.resolve<AppController>(
    Services.APP_CONTROLLER
  )

  const router = app.container.resolve<IRouter>(Services.ROUTER)

  router
    .use('/attraction', req => {
      app.provider(Services.CANVAS_MESH, Particle)
      const page = new CanvasPage()
      page.path = req.path
      controller.goto(page)
    })
    .use('/bound', req => {
      app.provider(Services.CANVAS_MESH, Bound)
      const page = new CanvasPage()
      page.path = req.path
      controller.goto(page)
    })
    .use('/spring', req => {
      app.provider(Services.CANVAS_MESH, Spring)
      const page = new CanvasPage()
      page.path = req.path
      controller.goto(page)
    })
    .use('*', req => {
      const page = new DefaultPage()
      page.path = req.path
      controller.goto(page)
    })

  // start listening for navigation events
  router.listen()

  app.boot()
})()

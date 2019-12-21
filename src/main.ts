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
import DefaultPage from '~/js/pages/DefaultPage'
import AttractionPage from '~/js/pages/AttractionPage'

;(() => {
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

  // add bootable services
  app.bootableProvider(Services.UA, UaBootable)
  app.bootableProvider(Services.BOOT, Bootstrap)

  const controller = app.container.resolve<AppController>(
    Services.APP_CONTROLLER
  )

  const router = app.container.resolve<IRouter>(Services.ROUTER)

  router
    .use('/attraction', req => {
      const page = new AttractionPage()
      page.path = req.path
      controller.goto(page)
    })
    .use('*', req => {
      const defalut = new DefaultPage()
      defalut.path = req.path
      controller.goto(defalut)
    })

  // start listening for navigation events
  router.listen()

  app.boot()
})()

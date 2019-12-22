const Services = {
  EVENT_BUS: Symbol(),
  LOADER: Symbol(),
  MODULE_LOADER: Symbol(),
  ROUTER: Symbol(),
  APP_CONTROLLER: Symbol(),
  UA: Symbol(),
  BOOT: Symbol(),
  STORE: Symbol(),
  CANVAS_MESH: Symbol()
}

const Events = {
  OPEN_MENU: 'openMenu',
  CLOSE_MENU: 'closeMenu',
  SCROLL: 'windowScroll',
  RESIZE: 'windowResize',
  AFTER_PAGE_BOOT: 'AFTER_PAGE_BOOT'
}

const Sizes = {
  TABLET_LAND: 1024,
  TABLET_PORT: 768,
  SMARTHPHONE: 480,
  CUSTOM: 980,
  WIDE_SCREEN: 1680
}

export { Events, Services, Sizes }

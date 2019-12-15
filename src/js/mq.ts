import { Sizes } from '~/js/const'

const mq = {
  sp: window.matchMedia(`(max-width: ${Sizes.TABLET_PORT - 1}px)`),
  pc: window.matchMedia(`(min-width: ${Sizes.TABLET_PORT}px)`),
  portrait: window.matchMedia('(orientation:portrait)'),
  landscape: window.matchMedia('(orientation:landscape)')
}

export default mq

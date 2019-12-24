import { ProuterBrowserRouter } from 'prouter'
import { Loader } from 'resource-loader'
import { common } from './stores'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStore extends common {}

export interface IBootable {
  boot(): void
}

export interface IEventBus {
  on(event: string, callback)
  off(event: string, callback)
  once(event: string, callback)
  emit(event: string, detail?)
}

export interface IModuleLoader {
  instance<T>(name: string, ...arg): Promise<T>
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRouter extends ProuterBrowserRouter {}

export interface ILoader {
  loader: Loader
  promiseLoad(): Promise<void>
  loadWebfont(fonts: string[]): Promise<void>
}

export interface IUa {
  device: string
  os: string
  browser: string
  engine: string
}

export interface IScene {
  init(): Promise<void>
}

export interface IModule {
  init(): void
  initEvents(): void
  destroy(): void
  onPageReady(): void
}

export interface ICanvas {
  init(): void
  destroy(): void
}

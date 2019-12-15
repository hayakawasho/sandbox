import { IModuleLoader } from '~/js/defs'

export default class WebpackDynamicImport implements IModuleLoader {
  async instance<T>(name: string, ...arg): Promise<T> {
    try {
      const Module = await this._import(name)

      return new Module(...arg)
    } catch (err) {
      console.error('WebpackDynamicImport', err.message)

      return null
    }
  }

  private async _import(name: string): Promise<(...arg) => void> {
    return import(`../modules/${name}` /* webpackChunkName: "module-" */).then(
      module => {
        return module.default
      }
    )
  }
}

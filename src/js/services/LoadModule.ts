import { IModuleLoader } from '~/js/defs'

export default class LoadModule implements IModuleLoader {
  async instance<T>(name: string, ...arg): Promise<T> {
    try {
      const Module = await require(`../modules/${name}`).default

      return new Module(...arg)
    } catch (err) {
      console.error('LoadModule', err.message)

      return null
    }
  }
}

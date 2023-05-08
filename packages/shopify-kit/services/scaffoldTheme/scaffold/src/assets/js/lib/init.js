/**
 * This file enables the automatic initialization
 * of module Javascript based on the existence of
 * data-module="" attributes in the DOM. You should not
 * really need to interact with this file. It is
 * included once in main.js only.
 */
class Init {
  constructor() {
    this.modules = []
    this.init = this.init.bind(this)
  }

  init() {
    const nodes = Array.prototype.slice.call(
      document.querySelectorAll('[data-module], [is]')
    )

    for (let i = 0; i < nodes.length; i++) {
      const type = !!nodes[i].getAttribute('data-module') ? 'module' : 'vue'

      const name =
        type === 'module'
          ? nodes[i].getAttribute('data-module')
          : nodes[i].getAttribute('is')

      if (typeof nodes[i].dataset.noPrefetch !== 'undefined') {
        continue
      }

      const request = enqueueModule(type === 'module' ? name : `${name}.vue`)

      request &&
        request.then &&
        request.then((mod) => {
          this.modules.push(mod)
          try {
            mod && mod.default && mod.default(nodes[i])
          } catch (error) {
            console.warn(error)
          }
        })
    }
  }
}

export default new Init()

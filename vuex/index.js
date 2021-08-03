let _Vue = null;
const EMPTY_OBJECT = {};
// TODO  单例实现下 Store
class Store {
  constructor(options) {
    const {
      state = EMPTY_OBJECT,
      getters = EMPTY_OBJECT,
      mutations = EMPTY_OBJECT,
      actions = EMPTY_OBJECT
    } = options;

    this.state = _Vue.observable(state);
    this.getters = Object.create(null);
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        // configurable: true,
        // enumerable: true,
        get: () => getters[key](state),
      })
    })

    this._mutations = mutations;
    this._actions = actions;
  }

  commit (type, payload) {
    this._mutations[type](this.state, payload);
  }

  dispatch (type, payload) {
    this._actions[type](this, payload);
  }
}

function install(Vue) {
  _Vue = Vue;

  _Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        _Vue.prototype.$sore = this.$options.store;
      }
    },
  })


}

export default {
  Store,
  install
}
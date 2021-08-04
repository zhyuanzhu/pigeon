let _Vue = null;

export default class VueRouter {
  static install (Vue) {
    // 判断插件是否已经被安装，给 install 增加个属性
    if (VueRouter.install.installed) return;
    VueRouter.install.installed = true;

    // 把 Vue 的构造函数记录到全局变量
    _Vue = Vue;

    // 把 router 对象注入到所有的 Vue 实例上
    // _Vue.prototype.$router = this.$options.router
    // 由于 install 是 VueRouter 的静态属性，所以 this 指向 VueRouter
    // 使用 Vue 的混入 mixin
    _Vue.mixin({
      beforeCreate() {
        // Vue 实例化的时候 $options 中才有 router，组建的 $options 中没有 router
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router;
          this.$options.router.init();
        }
      },
    })
  }

  constructor (options) {
    this.options = options;
    // 存储路由
    this.routerMap = {};
    // 一个响应式对象，用来存储当前路由
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouterMap();
    this.initComponents();
    this.initEvent();
  }

  createRouterMap () {
    const { routes } = this.options;
    routes.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }

  // 创建 RouterLink
  initComponents (Vue) {
    // 需要完整版的 vue  runtime + compiler 
    // Vue.component('router-link', {
    //   props: {
    //     to: String,
    //   },
    //   template: '<a :href="to"><slot></slot></a>'
    // })

    // 运行时版本 runtime
    Vue.component('router-link', {
      props: {
        to: String,
      },
      render (h) {
        return h('a', {
          attrs: {
            href: this.to,
          },
          on: {
            click: this.handlerClick
          }
        }, [this.$slots.default])
      },
      methods: {
        handlerClick (e) {
          e.preventDefault();
          const { to } = this;
          history.pushState({}, '', to);
          this.$router.data.current = to;
        }
      },
    })

    const _this = this;
    Vue.component('router-view', {
      render (h) {
        const current = _this.data.current;
        const component = _this.routerMap[current];
        return h(component)
      }
    })
  }

  // 处理事件
  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }


}
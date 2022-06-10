import Vue from 'vue'
import Router from 'vue-router'
import myComponents from '@/components/myComponents'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'myComponents',
      component: myComponents
    }
  ]
})

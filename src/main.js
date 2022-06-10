
import Vue from 'vue'
import App from './App'
import router from './router'

// 按需导入elementUI库
import { Button, Select, Option,Message,Tabs,TabPane,Calendar,DatePicker} from 'element-ui';

// 导入vuex
import store from './store';
// i18n
import { i18n } from './lang/i18n-setup';
// Vue.config.productionTip = false
Vue.component(Button.name, Button);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Message.name, Message);
Vue.component(Tabs.name, Tabs);
Vue.component(TabPane.name, TabPane);
// Vue.component(Calendar.name, Calendar);
Vue.component(DatePicker.name, DatePicker);
Vue.prototype.$message=Message
i18n.loadLanguageAsync().then(() => {
    new Vue({
        el: '#app',
          router,
        i18n,
        store,
        components: { App },
        template: '<App/>'
      })
})

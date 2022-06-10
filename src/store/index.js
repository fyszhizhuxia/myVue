import Vue from 'vue';
import Vuex from 'vuex';
import PersistedStatePlugin from './plugin/PersistedState';
// import createPersistedState from 'vuex-persistedstate';
import currentPage from './modules/currentPage'
import * as types from './mutation-types';
Vue.use(Vuex);
const store = {
    state: {
        hobby: 'read',
        num:10
    },
    mutations: {
        [types.ADD_MUTATION](state,n) {
			state.num += n;
		},
    },
    modules: {
        currentPage
    },
	actions: {},
    plugins: [PersistedStatePlugin]
};

export default new Vuex.Store(store);

import createPersistedState from 'vuex-persistedstate';

export default createPersistedState({
	// 保存到 localStorage 的 key 值。已经确定的值，不要改就好了
	key: 'my_persisted_state',
	// 仅将特定的 state 值持久化到本地。例如：'a' => 'state.a' 对应的值持久化到本地。
	// 目前暂时不需要使用。
	paths: [
		// 像 isLogin、language 这些值初始化就已经计算好了，就不需要做持久化。
		// 'isLogin',
		// 'language',
		'currentPage',
	]
});

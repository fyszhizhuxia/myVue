function defaultState() {
    return {
        myInfos: { name: '一瓶人间小样', age: 18 },//电报用户信息
    }
}

export default {
    namespaced: true,
    state: defaultState(),
    mutations: {
        setMyInfos(state , payload) {
            state.myInfos = payload;
        }
    }
}
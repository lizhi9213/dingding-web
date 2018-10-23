import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    serHttp: "http://171.8.5.209:19000",
    uId: sessionStorage.uId || '',
    uName: sessionStorage.uName || "",
    allowBack: false,
    dingId: sessionStorage.dingId || "", // 钉钉id
    cusKw: sessionStorage.cusKw || "",
    timerId: sessionStorage.timerId || null,
    todos: [
      { pageId: 1, title: '首页', showBack: false}
    ]
  },
  getters: {
    getTodoById: (state) => (pageId) => {
      return state.todos.find(todo => todo.pageId === pageId)
    }
  },
  mutations: {
    increment: state => state.count++,
    decrement: state => state.count--,
    changeuId(state, n) {
      state.uId = n
    },
    changeuName(state, n) {
      state.uId = n
    },
    sessionuId(state, n) {
      sessionStorage.uId = n
      state.uId = sessionStorage.uId
    },
    sessionuName(state, n) {
      sessionStorage.uName = n
      state.uName = sessionStorage.uName
    },
    sessionuAllow(state, n) {
      sessionStorage.allowBack = n
      state.allowBack = sessionStorage.allowBack
    },
    changeKey(state, n) {
      sessionStorage.cusKw = n
      state.cusKw = sessionStorage.cusKw
    },
    setTimerId(state, n) {
      sessionStorage.timerId = n
      state.timerId = sessionStorage.timerId
    },
    setDingId(state, n) {
      sessionStorage.dingId = n
      state.dingId = sessionStorage.dingId
    }
  }
})

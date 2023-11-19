import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 定义你的状态变量
    todoLists: [],
    // 其他状态变量
  },
  getters: {
  },
  mutations: {
    // 定义 mutations 用于修改状态
    SET_TODO_LISTS(state, todoLists) {
      state.todoLists = todoLists;
    },
    // 其他 mutations
  },
  actions: {
    // 定义 actions 用于处理异步操作
    async getTodoLists({ commit }) {
      // 处理异步逻辑，例如发起 API 请求
      const res = await service.get("/task");
      const todoLists = res.data;

      // 提交 mutation 来修改状态
      commit('SET_TODO_LISTS', todoLists);
    },
    // 其他 actions
  },
  modules: {
  }
})

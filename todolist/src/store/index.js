import Vue from 'vue'
import Vuex from 'vuex'
import service from "../utils/request"
Vue.use(Vuex)

export default new Vuex.Store({
  //存储数据
  state: {
    // 定义你的状态变量
    todoLists: [],
    // 其他状态变量
  },
  getters: {
  },
  //mutation 来更新todoLists 状态
  mutations: {
    // 定义 mutations 用于修改状态
    setTodoLists(state, todoLists) {
      state.todoLists = todoLists;
    },

  },
  actions: {
    // 定义 actions 用于处理异步操作
    async getTodoLists({ commit }) {
      // 处理异步逻辑，例如发起 API 请求
      const res = await service.get("/task");
      const todoLists = res.data;

      // 提交 mutation 来修改状态
      commit('setTodoLists', todoLists);
    },
    // 其他 actions
  },
  modules: {
  }
})

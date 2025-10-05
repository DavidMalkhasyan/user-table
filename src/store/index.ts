import { createStore } from 'vuex';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: { city: string };
  phone: string;
  website: string;
  [key: string]: any;
}

export interface State {
  users: User[];
}

export const store = createStore<State>({
  state: { users: [] },
  mutations: { setUsers(state, users: User[]) { state.users = users; } },
  actions: {
    async fetchUsers({ commit }) {
      const res = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await res.json();
      commit('setUsers', data);
    },
  },
});

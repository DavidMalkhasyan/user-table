import { createRouter, createWebHistory } from 'vue-router';
import UsersTable from '../components/UsersTable.vue';

const routes = [{ path: '/', component: UsersTable }];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

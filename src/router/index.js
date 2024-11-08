import { createRouter, createWebHistory } from 'vue-router';
import UserLogin from '@/components/public/UserLogin.vue';
import Supplier from '@/components/private/supplier/supplier.vue';
import Dashboard from '@/components/Dashboard.vue';

import NotFound from '@/components/NotFound.vue';
import Home from '@/components/private/Home.vue';
import RiskAssessment from '@/components/private/riskAssessment/risk-assessment.vue';
// Define your routes
const routes = [
  { path: '/signin', name: 'signin', component: UserLogin }, 
  // { path: '/view-grades', name: 'view-grades', component: ViewGrades },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    children: [
      { path: '', redirect: '/dashboard/home' }, // Redirect root dashboard to home
      { path: 'home', name: 'home', component: Home },
      { path: 'supplier', name: 'supplier', component: Supplier },
      { path: 'risk-assessment', name: 'risk assessment', component: RiskAssessment },
      { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound }
    ]
  },
  { path: '/:catchAll(.*)', name: 'NotFound', component: NotFound }
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = sessionStorage.getItem('jwt');

  if (to.name !== 'signin' && !isAuthenticated && to.name !== 'register' && to.name !== 'view-grades') {
    next({ name: 'signin' });
  } else if (to.name === 'signin' && isAuthenticated) {
    next({ name: '/dashboard' }); // Redirect to home if authenticated
  } else { 
    next();
  }
});

console.log('Router setup:', router);

export default router;

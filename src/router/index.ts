import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import EntryDetailView from '../views/EntryDetailView.vue'
import { auth } from '@/firebase/config'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase/config'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/entries/new',
      name: 'entry-new',
      component: () => import('../views/EntryView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/admin/entries/:id/edit',
      name: 'entry-edit',
      component: () => import('../views/EntryView.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/entry/:id',
      name: 'entry-detail',
      component: EntryDetailView
    },
    {
      path: '/category/:id',
      name: 'category',
      component: () => import('../views/CategoryView.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: () => import('../views/NotificationsView.vue')
    },
  ],
})

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
  // Permitir acceso a todas las rutas sin redirecciones automáticas
  // La verificación de permisos se hará en los componentes individuales
  next()
})

// Debug del router
router.onError((error) => {
  console.error('Router error:', error)
})

export default router

<template>
  <div 
    class="dropdown-category"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div 
      class="dropdown-item-container"
      @click="hasChildren ? toggleExpanded() : null"
    >
      <router-link 
        :to="`/category/${category.id}`"
        class="dropdown-item"
        :class="`dropdown-item-level-${level}`"
        @click="$emit('close-dropdown')"
      >
        <span class="category-name">{{ category.name }}</span>
      </router-link>
      <span 
        v-if="hasChildren" 
        class="dropdown-arrow-right"
        :class="{ 'expanded': isExpanded }"
        @click.stop="toggleExpanded"
      >
        {{ isExpanded ? '▼' : '▶' }}
      </span>
    </div>
    
    <!-- SUBMENÚ RECURSIVO - En móvil se expande verticalmente -->
    <div 
      v-show="hasChildren && (isHovered || isExpanded)"
      class="dropdown-submenu"
      :class="`dropdown-submenu-level-${level + 1}`"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <CategoryMenuItem 
        v-for="child in category.children" 
        :key="child.id"
        :category="child"
        :level="level + 1"
        @close-dropdown="$emit('close-dropdown')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Category {
  id: string
  name: string
  children?: Category[]
}

interface Props {
  category: Category
  level: number
}

interface Emits {
  (e: 'close-dropdown'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isHovered = ref(false)
const isExpanded = ref(false)

const hasChildren = computed(() => {
  return props.category.children && props.category.children.length > 0
})

const toggleExpanded = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const handleMouseEnter = () => {
  isHovered.value = true
}

const handleMouseLeave = () => {
  setTimeout(() => {
    isHovered.value = false
  }, 100)
}

</script>

<style scoped>
.dropdown-category {
  position: relative !important;
  border-bottom: 1px solid var(--gray-200);
}

.dropdown-category:last-child {
  border-bottom: none;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  color: var(--gray-700);
  text-decoration: none;
  font-size: 0.875rem;
  transition: var(--transition-fast);
  border-left: 3px solid transparent;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;
}

/* Estilos por nivel dinámicos */
.dropdown-item-level-0 {
  font-weight: 600;
  color: var(--gray-800);
  background: var(--gray-50);
}

.dropdown-item-level-1 {
  font-weight: 500;
  color: var(--gray-600);
  padding-left: 1.5rem;
  position: relative;
}

.dropdown-item-level-1::before {
  content: '';
  position: absolute;
  left: 0.75rem;
  color: var(--gray-400);
}

.dropdown-item-level-2 {
  font-weight: 500;
  color: var(--gray-600);
  padding-left: 2.5rem;
  position: relative;
}

.dropdown-item-level-2::before {
  content: '';
  position: absolute;
  left: 1.75rem;
  color: var(--gray-400);
}

.dropdown-item-level-3 {
  font-weight: 500;
  color: var(--gray-600);
  padding-left: 3.5rem;
  position: relative;
}

.dropdown-item-level-3::before {
  content: '';
  position: absolute;
  left: 2.75rem;
  color: var(--gray-400);
}

.dropdown-item-level-4 {
  font-weight: 500;
  color: var(--gray-600);
  padding-left: 4.5rem;
  position: relative;
}

.dropdown-item-level-4::before {
  content: '';
  position: absolute;
  left: 3.75rem;
  color: var(--gray-400);
}

.dropdown-item-level-5 {
  font-weight: 500;
  color: var(--gray-600);
  padding-left: 5.5rem;
  position: relative;
}

.dropdown-item-level-5::before {
  content: '';
  position: absolute;
  left: 4.75rem;
  color: var(--gray-400);
}

/* Hover effects */
.dropdown-category:hover .dropdown-item {
  background: var(--primary-blue-50);
  color: var(--primary-blue);
  border-left-color: var(--primary-blue);
  transform: translateX(4px);
}

.dropdown-item.router-link-active {
  background: var(--primary-blue-100);
  color: var(--primary-blue);
  border-left-color: var(--primary-blue);
  font-weight: 600;
}

.dropdown-item-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.dropdown-arrow-right {
  font-size: 0.75rem;
  color: var(--gray-400);
  transition: var(--transition-fast);
  margin-left: 0.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.dropdown-arrow-right.expanded {
  transform: rotate(90deg);
}

.dropdown-arrow-right:hover {
  background: var(--gray-100);
  color: var(--primary-blue);
}

.dropdown-category:hover .dropdown-arrow-right {
  color: var(--primary-blue);
  transform: translateX(2px);
}

/* Submenús por nivel */
.dropdown-submenu {
  position: absolute;
  top: 0;
  left: 100%;
  background: linear-gradient(145deg, #ffffff 0%, var(--gray-50) 100%);
  border: 2px solid var(--gray-200);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  min-width: 200px;
  z-index: 1001;
  overflow: visible;
  padding: 0.5rem 0;
  margin-left: 4px;
}


.dropdown-submenu-level-1 {
  z-index: 1001;
}

.dropdown-submenu-level-2 {
  z-index: 1002;
}

.dropdown-submenu-level-3 {
  z-index: 1003;
}

.dropdown-submenu-level-4 {
  z-index: 1004;
}

.dropdown-submenu-level-5 {
  z-index: 1005;
}


.dropdown-submenu-level-6 {
  z-index: 1006;
}

.dropdown-submenu-level-7 {
  z-index: 1007;
}

.dropdown-submenu-level-8 {
  z-index: 1008;
}

.dropdown-submenu-level-9 {
  z-index: 1009;
}

.dropdown-submenu-level-10 {
  z-index: 1010;
}

/* Responsive */
@media (max-width: 768px) {
  .dropdown-submenu {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    max-width: 80vw;
  }
  
  .dropdown-item-level-1,
  .dropdown-item-level-2,
  .dropdown-item-level-3,
  .dropdown-item-level-4,
  .dropdown-item-level-5 {
    padding-left: 1rem;
  }
  
  .dropdown-item-level-1::before,
  .dropdown-item-level-2::before,
  .dropdown-item-level-3::before,
  .dropdown-item-level-4::before,
  .dropdown-item-level-5::before {
    display: none;
  }
  
  .dropdown-submenu {
    margin-left: 0;
  }
}

/* Regla específica para móvil - debe ir al final para mayor prioridad */
@media (max-width: 768px) {
  .dropdown-submenu {
    position: static !important;
    top: auto !important;
    left: auto !important;
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    min-width: auto !important;
    width: auto !important;
    z-index: auto !important;
    padding: 0 !important;
    margin-left: 1rem !important;
    margin-top: 0.25rem !important;
    transform: none !important;
  }
}
</style>

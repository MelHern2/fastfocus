import { ref, computed } from 'vue';
const props = defineProps();
const emit = defineEmits();
const isHovered = ref(false);
const isExpanded = ref(false);
const hasChildren = computed(() => {
    return props.category.children && props.category.children.length > 0;
});
const toggleExpanded = () => {
    if (hasChildren.value) {
        isExpanded.value = !isExpanded.value;
    }
};
const handleMouseEnter = () => {
    isHovered.value = true;
};
const handleMouseLeave = () => {
    setTimeout(() => {
        isHovered.value = false;
    }, 100);
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['dropdown-category']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-1']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-3']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-5']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-category']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-1']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-3']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-5']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-1']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-2']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-3']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-4']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-level-5']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-submenu']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-submenu']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onMouseenter: (__VLS_ctx.handleMouseEnter) },
    ...{ onMouseleave: (__VLS_ctx.handleMouseLeave) },
    ...{ class: "dropdown-category" },
});
// @ts-ignore
[handleMouseEnter, handleMouseLeave,];
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.hasChildren ? __VLS_ctx.toggleExpanded() : null;
            // @ts-ignore
            [hasChildren, toggleExpanded,];
        } },
    ...{ class: "dropdown-item-container" },
});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
RouterLink;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onClick': {} },
    to: (`/category/${__VLS_ctx.category.id}`),
    ...{ class: "dropdown-item" },
    ...{ class: (`dropdown-item-level-${__VLS_ctx.level}`) },
}));
const __VLS_2 = __VLS_1({
    ...{ 'onClick': {} },
    to: (`/category/${__VLS_ctx.category.id}`),
    ...{ class: "dropdown-item" },
    ...{ class: (`dropdown-item-level-${__VLS_ctx.level}`) },
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
const __VLS_6 = ({ click: {} },
    { onClick: (...[$event]) => {
            __VLS_ctx.$emit('close-dropdown');
            // @ts-ignore
            [category, level, $emit,];
        } });
const { default: __VLS_7 } = __VLS_3.slots;
__VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
    ...{ class: "category-name" },
});
(__VLS_ctx.category.name);
// @ts-ignore
[category,];
var __VLS_3;
if (__VLS_ctx.hasChildren) {
    // @ts-ignore
    [hasChildren,];
    __VLS_asFunctionalElement(__VLS_elements.span, __VLS_elements.span)({
        ...{ onClick: (__VLS_ctx.toggleExpanded) },
        ...{ class: "dropdown-arrow-right" },
        ...{ class: ({ 'expanded': __VLS_ctx.isExpanded }) },
    });
    // @ts-ignore
    [toggleExpanded, isExpanded,];
    (__VLS_ctx.isExpanded ? '▼' : '▶');
    // @ts-ignore
    [isExpanded,];
}
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    ...{ onMouseenter: (__VLS_ctx.handleMouseEnter) },
    ...{ onMouseleave: (__VLS_ctx.handleMouseLeave) },
    ...{ class: "dropdown-submenu" },
    ...{ class: (`dropdown-submenu-level-${__VLS_ctx.level + 1}`) },
});
__VLS_asFunctionalDirective(__VLS_directives.vShow)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.hasChildren && (__VLS_ctx.isHovered || __VLS_ctx.isExpanded)) }, null, null);
// @ts-ignore
[handleMouseEnter, handleMouseLeave, hasChildren, level, isExpanded, vShow, isHovered,];
for (const [child] of __VLS_getVForSourceType((__VLS_ctx.category.children))) {
    // @ts-ignore
    [category,];
    const __VLS_8 = {}.CategoryMenuItem;
    /** @type {[typeof __VLS_components.CategoryMenuItem, ]} */ ;
    // @ts-ignore
    CategoryMenuItem;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onCloseDropdown': {} },
        key: (child.id),
        category: (child),
        level: (__VLS_ctx.level + 1),
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onCloseDropdown': {} },
        key: (child.id),
        category: (child),
        level: (__VLS_ctx.level + 1),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    const __VLS_14 = ({ closeDropdown: {} },
        { onCloseDropdown: (...[$event]) => {
                __VLS_ctx.$emit('close-dropdown');
                // @ts-ignore
                [level, $emit,];
            } });
    var __VLS_11;
}
/** @type {__VLS_StyleScopedClasses['dropdown-category']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item-container']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-item']} */ ;
/** @type {__VLS_StyleScopedClasses['category-name']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-arrow-right']} */ ;
/** @type {__VLS_StyleScopedClasses['expanded']} */ ;
/** @type {__VLS_StyleScopedClasses['dropdown-submenu']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        isHovered: isHovered,
        isExpanded: isExpanded,
        hasChildren: hasChildren,
        toggleExpanded: toggleExpanded,
        handleMouseEnter: handleMouseEnter,
        handleMouseLeave: handleMouseLeave,
    }),
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */

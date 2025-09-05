import { RouterView } from 'vue-router';
import NavBar from '@/components/NavBar.vue';
import GlobalLoader from '@/components/GlobalLoader.vue';
import ToastContainer from '@/components/ToastContainer.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_elements;
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_elements.div, __VLS_elements.div)({
    id: "app",
});
/** @type {[typeof GlobalLoader, ]} */ ;
// @ts-ignore
const __VLS_0 = __VLS_asFunctionalComponent(GlobalLoader, new GlobalLoader({}));
const __VLS_1 = __VLS_0({}, ...__VLS_functionalComponentArgsRest(__VLS_0));
/** @type {[typeof NavBar, ]} */ ;
// @ts-ignore
const __VLS_4 = __VLS_asFunctionalComponent(NavBar, new NavBar({}));
const __VLS_5 = __VLS_4({}, ...__VLS_functionalComponentArgsRest(__VLS_4));
__VLS_asFunctionalElement(__VLS_elements.main, __VLS_elements.main)({
    ...{ class: "main-content" },
});
const __VLS_8 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, ]} */ ;
// @ts-ignore
RouterView;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({}));
const __VLS_10 = __VLS_9({}, ...__VLS_functionalComponentArgsRest(__VLS_9));
/** @type {[typeof ToastContainer, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(ToastContainer, new ToastContainer({}));
const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
/** @type {[typeof ConfirmDialog, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(ConfirmDialog, new ConfirmDialog({}));
const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
/** @type {__VLS_StyleScopedClasses['main-content']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup: () => ({
        RouterView: RouterView,
        NavBar: NavBar,
        GlobalLoader: GlobalLoader,
        ToastContainer: ToastContainer,
        ConfirmDialog: ConfirmDialog,
    }),
});
export default (await import('vue')).defineComponent({});
; /* PartiallyEnd: #4569/main.vue */

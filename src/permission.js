import router from './router/router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/util/auth'
import { vaildUtil } from '@/util/yun';
import { setTitle } from '@/util/util';
import { validatenull } from '@/util/validate';
import { asyncRouterMap } from '@/router/router'
NProgress.configure({ showSpinner: false })// NProgress Configuration
function hasPermission(roles, permissionRoles) {
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}
const whiteList = ['/login', '/404', '/401', '/lock']
const lockPage = '/lock'
router.addRoutes(asyncRouterMap); // 动态添加可访问路由表
// 路由全局钩子
// global.beforeEach -> router.beforeEnter -> component.beforeRouteEnter -> global.beforeResolve -> global.afterEach -> ... created -> ... mounted
// component.beforeRouteLevel -> global.beforeEach -> global.beforeResolve -> global.afterEach
router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    // @util/util#resolveUrlPath `/myiframe/urlPath?src=${menu.href}&name=${menu.label}`;
    const value = to.query.src ? to.query.src : to.path;
    const label = to.query.name ? to.query.name : to.name;
    // 设置当前页面的 TAG
    if (whiteList.indexOf(value) == -1) {
        store.commit('ADD_TAG', {
            label: label,
            value: value,
            query: to.query
        });
    }
    if (store.getters.token) { // determine if there has token
        /* has token*/
        if (store.getters.isLock && to.path != lockPage) {  /* 如果已锁屏,并且访问其它页面.则跳转到锁屏路由 */
            next({ path: lockPage })
            NProgress.done();
        } else if (to.path === '/login') {  /* 如果已登陆,访问登陆页,则跳转到首页 */
            next({ path: '/' })
            NProgress.done();
        } else {
            if (store.getters.roles.length === 0) { /* 拉取用户信息 */
                store.dispatch('GetUserInfo').then(res => {
                    const roles = res.roles
                    next({ ...to, replace: true })
                }).catch(() => {
                    store.dispatch('FedLogOut').then(() => { /* 拉取用户信息失败,退出系统 */
                        next({ path: '/login' })
                        NProgress.done();
                    })
                })
            } else {
                next()
            }
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { /* 在白名单中,直接放行 */
            next()
        } else {    /* 访问保护资源,需要登陆 */
            next('/login')
            NProgress.done();
        }
    }
})

// 路由全局钩子
router.afterEach((to, from) => {
    NProgress.done();
    setTimeout(() => {
        const tag = store.getters.tag;
        setTitle(tag.label);
        store.commit('SET_TAG_CURRENT', findMenuParent(tag));
    }, 0);
})

//寻找子菜单的父类
function findMenuParent(tag) {
    let tagCurrent = [];
    const menu = store.getters.menu;
    tagCurrent.push(tag);
    return tagCurrent;
    // //如果是一级菜单直接返回
    // for (let i = 0, j = menu.length; i < j; i++) {
    //     if (menu[i].href == tag.value) {
    //         tagCurrent.push(tag);
    //         return tagCurrent;
    //     }
    // }

    // let currentPathObj = menu.filter(item => {
    //     if (item.children.length == 1) {
    //         return item.children[0].href === tag.value;
    //     } else {
    //         let i = 0;
    //         let childArr = item.children;
    //         let len = childArr.length;
    //         while (i < len) {
    //             if (childArr[i].href === tag.value) {
    //                 return true;
    //                 break;
    //             }
    //             i++;
    //         }
    //         return false;
    //     }
    // })[0];
    // tagCurrent.push({
    //     label: currentPathObj.label,
    //     value: currentPathObj.href
    // });
    // tagCurrent.push(tag);
    // return tagCurrent;

}
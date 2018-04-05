import { baseUrl, khglUrl, dicUrl } from '@/config/env'
import request from '@/router/axios'
import { getToken } from '@/util/auth'
import { userInfo, tableData } from '@/mock/user'
import { menu, menuAll } from '@/mock/menu'

/**
 * 登陆授权
 * @param {string} username 用户明
 * @param {string} password 未加密的密码
 * @param {string} code 验证码
 * @param {string} redomStr 随机码
 * @return String
 */
export const loginByUsername = (username, password, code, redomStr) => {
    return new Promise((resolve, reject) => {
        let grant_type = 'password';
        let scope = 'server';

        request({
            url: baseUrl + '/auth/oauth/token',
            headers: {
              'Authorization': 'Basic cGlnOnBpZw=='
            },
            method: 'post',
            params: { username, password, "randomStr": redomStr, code, grant_type, scope }
        }).then((res) => {
            // 获取token
            resolve({data: res.data.access_token});
        });
        
        // 模拟登陆
        // resolve({ data: new Date().getTime() });
    })
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
    return new Promise((resolve, reject) => {
        request({
            url: baseUrl + '/admin/user/info',
            method: 'get'
        }).then(res => {
            resolve(res.data);
        });
        // resolve({ data: userInfo });
    })
}

/**
 * 获取菜单, 满足菜单格式
 * @param {Number} parentId 序号菜单
 * @return [[menu ...], [menu ...]]
 */
export const getMenu = (parentId) => {
    return new Promise((resolve, reject) => {
        if (!parentId) parentId = 0;
        resolve({ data: menu[parentId] });
    })
}
export const getMenuAll = () => {
    return new Promise((resolve, reject) => {
        resolve({ data: menu[0] });
    })
}

/**
 * 获取用户数据 
 * @param {Number} page 第几页
 * @return [{id, name, usename, type, sex, grade, address, check}, ...]
 */
export const getTableData = (page) => {
    return new Promise((resolve, reject) => {
        resolve({ data: tableData });
    })
}

/**
 * 退出登陆
 */
export const logout = () => {
    return new Promise((resolve, reject) => {
        // 移除服务端凭证
        request({
            url: baseUrl + '/auth/authentication/removeToken',
            method: 'post',
            data: {
                accesstoken: getToken()
            }
        }).then(res => {
            resolve();
        });
    })
}




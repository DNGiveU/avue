import { userTableData, roleTableData } from '@/mock/admin'
import { DIC } from '@/const/dic'

/**
 * 获取用户数据 
 * @param {Number} page 第几页
 * @return [{id, name, username, grade, state, date}, ...]
 */
export const getUserData = (page) => {
    return new Promise((resolve, reject) => {
        resolve({ data: userTableData });
    })
}

/**
 * 获取权限数据 
 * @param {Number} page 第几页
 * @return [{id, name, date, check}, ...]
 */
export const getRoleData = (page) => {
    return new Promise((resolve, reject) => {
        resolve({ data: roleTableData });
    })
}

/**
 * 获取字典类型数据
 * @param {String} type 字典类型
 * @return {key, value} or [{key, value}, ...]
 */
export const getDic = (type) => {
    return new Promise((resolve, reject) => {
        resolve({ data: DIC[type] });
    })
}
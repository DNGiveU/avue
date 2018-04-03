import { validatenull } from './validate'
import { baseUrl } from '@/config/env'


/**
 * 加密处理
 */
export const encryption = (params) => {
    let { data, type, param, key } = params;
    let result = JSON.parse(JSON.stringify(data));
    if (type == 'Base64') {
        param.forEach(ele => {
            result[ele] = btoa(result[ele]);
        })
    } else if (type == 'Aes') {
        param.forEach(ele => {
            result[ele] = CryptoJS.AES.encrypt(result[ele], key).toString();
        })

    }
    return result;
};

/**
 * 设置浏览器头部标题
 */
export const setTitle = function (title) {
    title = title ? `${title}——Avue 通用管理 系统快速开发框架` : 'Avue 通用管理 系统快速开发框架';
    window.document.title = title;
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
    if (fullscreenEnable()) {
        exitFullScreen();
    } else {
        reqFullScreen();
    }
}
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
    function listen() {
        callback()
    }
    document.addEventListener("fullscreenchange", function (e) {
        listen();
    });
    document.addEventListener("mozfullscreenchange", function (e) {
        listen();
    });
    document.addEventListener("webkitfullscreenchange", function (e) {
        listen();
    });
    document.addEventListener("msfullscreenchange", function (e) {
        listen();
    });
}
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
    var isFullscreen = document.fullscreenEnabled ||
        window.fullScreen ||
        document.mozFullscreenEnabled ||
        document.webkitIsFullScreen;
    return isFullscreen;
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
    }
}
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
    if (document.documentElement.requestFullScreen) {
        document.exitFullScreen();
    } else if (document.documentElement.webkitRequestFullScreen) {
        document.webkitCancelFullScreen();
    } else if (document.documentElement.mozRequestFullScreen) {
        document.mozCancelFullScreen();
    }
}
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
    for (let i = 0; i < menu.length; i++) {
        if (menu[i].children.length != 0) {
            for (let j = 0; j < menu[i].children.length; j++) {
                if (menu[i].children[j].id == id) {
                    return menu[i];
                } else {
                    if (menu[i].children[j].children.length != 0) {
                        return findParent(menu[i].children[j].children, id);
                    }
                }
            }
        }
    };
}

/**
 * 总体路由处理器
 */
export const resolveUrlPath = (url, name) => {

    let reqUrl = url;
    if (url.indexOf("http") != -1 || url.indexOf("https") != -1) {
        reqUrl = `/myiframe/urlPath?src=${reqUrl}&name=${name}`;
    } else {
        reqUrl = `${reqUrl}`;
    }
    return reqUrl;
}
/**
 * 总体路由设置器
 */
export const setUrlPath = ($route) => {
    let value = "";
    if ($route.query.src) {
        value = $route.query.src;
        if (value.indexOf(baseUrl) != -1) {
            const port = value
                .substr(value.lastIndexOf(":"))
                .replace(value.substr(value.lastIndexOf("/")), "");
            const path = value.replace(baseUrl + port, "");
            value = "#" + path + port;
        }
    } else {
        value = $route.path;
    }
    return value;
}
/**
 * 动态插入css
 */

export const loadStyle = url => {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(link);
}
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic, value) => {
    let result = '';
    if (validatenull(dic)) return value;
    if (typeof (value) == 'string' || typeof (value) == 'number') {
        let index = 0;
        index = findArray(dic, value);
        if (index != -1) {
            result = dic[index].label;
        } else {
            result = value;
        }
    } else if (value instanceof Array) {
        result = [];
        let index = 0;
        value.forEach(ele => {
            index = findArray(dic, ele);
            if (index != -1) {
                result.push(dic[index].label);
            } else {
                result.push(value);
            }
        });
        result = result.toString();
    }
    return result;
}
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic, value) => {
    for (let i = 0; i < dic.length; i++) {
        if (dic[i].value == value) {
            return i;
            break;
        }
    }
    return -1;
}
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
    let random = '';
    random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, len ? len : 4);
    if (date) random = random + Date.now();
    return random;
}



"use strict";
/**
 * 本模块负责封装`XMLHttpRequest`及其跨域版本
 */
(function () {
    class Xhr {
        /**
         * `XMLHttpRequest`的`Promise`封装
         * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
         * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外
         */
        static xhr(details) {
            if (details.hasOwnProperty("async") && Boolean(details.async) === false) {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url, false);
                details.responseType && (xhr.responseType = details.responseType);
                details.credentials && (xhr.withCredentials = true);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.timeout && (xhr.timeout = details.timeout);
                xhr.send(details.data);
                return xhr.response;
            }
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(details.method || 'GET', details.url);
                details.responseType && (xhr.responseType = details.responseType);
                details.headers && (Object.entries(details.headers).forEach(d => xhr.setRequestHeader(d[0], d[1])));
                details.credentials && (xhr.withCredentials = true);
                details.timeout && (xhr.timeout = details.timeout);
                xhr.onabort = details.onabort || ((ev) => reject(ev));
                xhr.onerror = details.onerror || ((ev) => reject(ev));
                details.onloadstart && (xhr.onloadstart = details.onloadstart);
                details.onprogress && (xhr.onprogress = details.onprogress);
                details.onreadystatechange && (xhr.onreadystatechange = details.onreadystatechange);
                xhr.ontimeout = details.ontimeout || ((ev) => reject(ev));
                xhr.onload = details.onload || (() => resolve(xhr.response));
                xhr.send(details.data);
            });
        }
        /**
         * `GM_xmlhttpRequest`的`Promise`封装，用于跨域`XMLHttpRequest`请求
         * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
         * @returns `Promise`托管的请求结果或者报错信息
         */
        static GM(details) {
            return new Promise((resolve, reject) => {
                details.method = details.method || 'GET';
                details.onload = details.onload || ((xhr) => resolve(xhr.response));
                details.onerror = details.onerror || ((xhr) => reject(xhr.response));
                GM.xmlHttpRequest(details);
            });
        }
    }
    const xhr = (details) => Xhr.xhr(details);
    xhr.GM = (details) => Xhr.GM(details);
    API.xhr = xhr;
})();

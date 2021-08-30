GM.xmlHttpRequest = GM_xmlhttpRequest;
GM.getResourceText = GM_getResourceText;
GM.getResourceURL = GM_getResourceURL;
GM.getValue = GM_getValue;
GM.setValue = GM_setValue;
GM.deleteValue = GM_deleteValue;
const CONFIG = {};
const config = new Proxy(CONFIG, {
    set: (_target, p, value) => {
        CONFIG[p] = value;
        GM.setValue("config", CONFIG);
        return true;
    },
    get: (_target, p) => CONFIG[p]
});
Object.entries(GM.getValue("config", {})).forEach(k => Reflect.set(config, k[0], k[1]));
const SETTING = [];
const LOADING = [];
function modifyConfig(obj) {
    Reflect.has(obj, "value") && !Reflect.has(config, Reflect.get(obj, "key")) && Reflect.set(config, Reflect.get(obj, "key"), Reflect.get(obj, "value"));
    Reflect.has(obj, "list") && Reflect.get(obj, "list").forEach(d => modifyConfig(d));
    Reflect.has(obj, "depends") && Reflect.get(config, Reflect.get(obj, "key")) && LOADING.push(Reflect.get(obj, "key"));
}
function registerSetting(obj) {
    SETTING.push(obj);
    modifyConfig(obj);
}
const MENU = {};
function registerMenu(obj) {
    Reflect.set(MENU, Reflect.get(obj, "key"), obj);
}
class Xhr {
    /**
     * `XMLHttpRequest`的`Promise`封装
     * @param details 以对象形式传递的参数，注意`onload`回调会覆盖Promise结果
     * @returns `Promise`托管的请求结果或者报错信息，`async = false` 时除外，直接返回结果
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
class Format {
    /**
     * 格式化时间
     * @param time 时间戳
     * @param type 是否包含年月日
     * @returns 时:分:秒 | 年-月-日 时:分:秒
     */
    static timeFormat(time = new Date().getTime(), type) {
        let date = new Date(time), Y = date.getFullYear() + '-', M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-', D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ', h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':', m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':', s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return type ? Y + M + D + h + m + s : h + m + s;
    }
    /**
     * 格式化字节
     * @param size 字节/B
     * @returns n B | K | M | G
     */
    static sizeFormat(size = 0) {
        let unit = ["B", "K", "M", "G"], i = unit.length - 1, dex = 1024 ** i, vor = 1000 ** i;
        while (dex > 1) {
            if (size >= vor) {
                size = Number((size / dex).toFixed(2));
                break;
            }
            dex = dex / 1024;
            vor = vor / 1000;
            i--;
        }
        return size ? size + unit[i] : "N/A";
    }
    /**
     * 格式化进位
     * @param num 实数
     * @returns n 万 | 亿
     */
    static unitFormat(num = 0) {
        num = 1 * num || 0;
        let unit = ["", "万", "亿"], i = unit.length - 1, dex = 10000 ** i;
        while (dex > 1) {
            if (num >= dex) {
                num = Number((num / dex).toFixed(1));
                break;
            }
            dex = dex / 10000;
            i--;
        }
        return num + unit[i];
    }
    /**
     * 冒泡排序
     * @param arr 待排序数组
     * @returns 排序结果
     */
    static bubbleSort(arr) {
        let temp;
        for (let i = 0; i < arr.length - 1; i++) {
            let bool = true;
            for (let j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    bool = false;
                }
            }
            if (bool)
                break;
        }
        return arr;
    }
    /**
     * 随机截取指定大小子数组
     * @param arr 母数组
     * @param num 子数组大小
     * @returns 子数组
     */
    static randomArray(arr, num) {
        let out = [];
        num = num || 1;
        num = num < arr.length ? num : arr.length;
        while (out.length < num) {
            var temp = (Math.random() * arr.length) >> 0;
            out.push(arr.splice(temp, 1)[0]);
        }
        return out;
    }
    /**
     * search参数对象拼合回URL
     * @param url URL主体，可含search参数
     * @param obj search参数对象
     * @returns 拼合的URL
     */
    static objUrl(url, obj) {
        let data = this.urlObj(url);
        obj = typeof obj === "object" ? obj : {};
        data = Object.assign(data, obj);
        let arr = [], i = 0;
        for (let key in data) {
            if (data[key] !== undefined && data[key] !== null) {
                arr[i] = key + "=" + data[key];
                i++;
            }
        }
        if (url)
            url = url + "?" + arr.join("&");
        else
            url = arr.join("&");
        if (url.charAt(url.length - 1) == "?")
            url = url.split("?")[0];
        return url;
    }
    /**
     * 提取URL search参数对象
     * @param url 原URL
     * @returns search参数对象
     */
    static urlObj(url = "") {
        let arr = url.split('?')[1] ? url.split('?')[1].split('&') : [];
        return arr.reduce((o, d) => {
            if (d.includes("#"))
                d = d.split("#")[0];
            if (d)
                o[d.split('=')[0]] = d.split('=')[1] || "";
            return o;
        }, {});
    }
}
class Debug {
    static log(...data) { console.log(`%c[${Format.timeFormat()}]`, "color: blue;", ...data); }
    static info(...data) { console.info(`%c[${Format.timeFormat()}]`, "color: green;", ...data); }
    static debug(...data) { console.debug(`[${Format.timeFormat()}]`, ...data); }
    static warn(...data) { console.warn(`[${Format.timeFormat()}]`, ...data); }
    static error(...data) { console.error(`[${Format.timeFormat()}]`, ...data); }
}
const debug = (...data) => Debug.log(...data);
debug.log = (...data) => Debug.log(...data);
debug.info = (...data) => Debug.info(...data);
debug.debug = (...data) => Debug.debug(...data);
debug.warn = (...data) => Debug.warn(...data);
debug.error = (...data) => Debug.error(...data);
class Toast {
    /**
     * 通知节点，初始化专用
     */
    static container;
    /**
     * 通知样式
     */
    static style;
    /**
     * 判定`body`是否存在
     */
    static check;
    /**
     * 通知节点，呈现时
     */
    static box;
    /**
     * 未呈现通知计数
     */
    static count = 0;
    /**
     * 动画呈现帧数
     */
    static sence = 60;
    static init() {
        this.container = document.createElement("div");
        this.style = document.createElement("link");
        this.container.setAttribute("id", "toast-container");
        this.container.setAttribute("class", "toast-top-right");
        this.style.setAttribute("rel", "stylesheet");
        this.style.setAttribute("id", "toastr-style");
        this.style.setAttribute("href", "https://cdn.bootcdn.net/ajax/libs/toastr.js/latest/toastr.min.css");
    }
    static show(type, ...msg) {
        if (!config.toastcheck)
            return;
        if (!document.body) {
            if (this.check)
                return;
            return setTimeout(() => { this.check = true; this.show(type, ...msg); });
        }
        document.querySelector("#toastr-style") || document.head.appendChild(this.style);
        document.querySelector("#toast-container") || document.body.appendChild(this.container);
        this.box = document.querySelector("#toast-container") || this.container;
        let item = document.createElement("div");
        item.setAttribute("class", "toast toast-" + type);
        item.setAttribute("aria-live", "assertive");
        item.setAttribute("style", "visibility: hidden;position: absolute");
        setTimeout(() => {
            if (this.count > 0)
                this.count--;
            item = this.box.insertBefore(item, this.box.firstChild);
            item.appendChild(this.msg(...msg));
            this.come(item);
            setTimeout(() => this.quit(item), (Number(config.toasttimeout) || 4) * 1000);
        }, this.count * (Number(config.toaststep) || 250));
        this.count++;
    }
    static come(item, i = 0) {
        let height = item.clientHeight;
        item.setAttribute("style", "display: none;");
        let timer = setInterval(() => {
            i++;
            item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
            if (i === this.sence) {
                clearInterval(timer);
                item.removeAttribute("style");
            }
        });
    }
    static quit(item, i = this.sence) {
        let height = item.clientHeight;
        let timer = setInterval(() => {
            i--;
            item.setAttribute("style", "padding-top: " + i / 4 + "px;padding-bottom: " + i / 4 + "px;height: " + i / 60 * height + "px;");
            if (i === 0) {
                clearInterval(timer);
                item.remove();
                if (!this.box.firstChild)
                    this.box.remove();
            }
        });
    }
    static msg(...msg) {
        let div = document.createElement("div");
        div.setAttribute("class", "toast-message");
        div.innerHTML = msg.reduce((s, d, i) => {
            s = s + (i ? "<br />" : "") + String(d);
            return s;
        }, "");
        return div;
    }
}
Toast.init();
const toast = (...msg) => { debug.debug(...msg); Toast.show("info", ...msg); };
toast.info = (...msg) => { debug.debug(...msg); Toast.show("info", ...msg); };
toast.success = (...msg) => { debug.log(...msg); Toast.show("success", ...msg); };
toast.warning = (...msg) => { debug.warn(...msg); Toast.show("warning", ...msg); };
toast.error = (...msg) => { debug.error(...msg); Toast.show("error", ...msg); };
registerSetting({
    type: "sort",
    key: "toast",
    label: "浮动通知",
    sub: '<a href="https://github.com/CodeSeven/toastr">toastr</a>',
    svg: '<svg viewBox="0 0 16 16"><path d="M8 16a2 2 0 001.985-1.75c.017-.137-.097-.25-.235-.25h-3.5c-.138 0-.252.113-.235.25A2 2 0 008 16z"></path><path fill-rule="evenodd" d="M8 1.5A3.5 3.5 0 004.5 5v2.947c0 .346-.102.683-.294.97l-1.703 2.556a.018.018 0 00-.003.01l.001.006c0 .002.002.004.004.006a.017.017 0 00.006.004l.007.001h10.964l.007-.001a.016.016 0 00.006-.004.016.016 0 00.004-.006l.001-.007a.017.017 0 00-.003-.01l-1.703-2.554a1.75 1.75 0 01-.294-.97V5A3.5 3.5 0 008 1.5zM3 5a5 5 0 0110 0v2.947c0 .05.015.098.042.139l1.703 2.555A1.518 1.518 0 0113.482 13H2.518a1.518 1.518 0 01-1.263-2.36l1.703-2.554A.25.25 0 003 7.947V5z"></path></svg>',
    sort: "common",
    list: [{
            type: "switch",
            key: "toastcheck",
            label: "通知开关",
            sort: "common",
            value: true,
        }, {
            type: "input",
            key: "toasttimeout",
            label: "通知开关：/s",
            sort: "common",
            value: "4",
            input: { type: "number", min: 1, max: 30 },
            pattern: /^\d+$/
        }, {
            type: "input",
            key: "toaststep",
            label: "通知延时：/ms",
            sort: "common",
            value: "250",
            input: { type: "number", min: 100, max: 1000 },
            pattern: /^\d+$/
        }]
});
class API {
    static modules = GM.getValue("modules", {});
    static inModules = [];
    static resource = GM.getValue("resource", {});
    static toModules = [];
    static updating = false;
    static Virsion = GM.info.script.version;
    static API;
    static Name = GM.info.script.name;
    static apply = GM.getValue("apply", {});
    Name = API.Name;
    Virsion = API.Virsion;
    Handler = [GM.info.scriptHandler, GM.info.version].join(" ");
    registerSetting = registerSetting;
    registerMenu = registerMenu;
    runWhile = API.runWhile;
    importModule = API.importModule;
    timeFormat = (time, type) => Format.timeFormat(time, type);
    sizeFormat = (size) => Format.sizeFormat(size);
    unitFormat = (num) => Format.unitFormat(num);
    bubbleSort = (arr) => Format.bubbleSort(arr);
    randomArray = (arr, num) => Format.randomArray(arr, num);
    objUrl = (url, obj) => Format.objUrl(url, obj);
    urlObj = (url) => Format.urlObj(url);
    trace = (e, label = "", toastr = false) => { toastr ? toast.error(label, ...(Array.isArray(e) ? e : [e])) : Debug.error(label, ...(Array.isArray(e) ? e : [e])); };
    bofqiMessage(msg, time = 3, callback, replace = true) {
        let node = document.querySelector(".bilibili-player-video-toast-bottom");
        if (!node) {
            if (msg) {
                if (Array.isArray(msg))
                    return Debug.log(...msg);
                return Debug.log(msg);
            }
            return;
        }
        if (!msg)
            node.childNodes.forEach(d => d.remove());
        const ele = document.createElement("div");
        ele.setAttribute("class", "bilibili-player-video-toast-item-text");
        msg = Array.isArray(msg) ? msg : [msg];
        if (!msg[0])
            return;
        replace && node.childNodes.forEach(d => d.remove());
        ele.innerHTML = msg.reduce((s, d, i) => {
            if (d) {
                switch (i) {
                    case 0:
                        s += `<span class="video-float-hint-text">${d}</span>`;
                        break;
                    case 1:
                        s += `<span class="video-float-hint-btn hint-red;">${d}</span>`;
                        break;
                    case 2:
                        s += `<span class="video-float-hint-btn">${d}</span>`;
                        break;
                }
            }
            return s;
        }, '');
        node.appendChild(ele);
        callback && (ele.style.cursor = "pointer") && (ele.onclick = () => callback());
        (time !== 0) && setTimeout(() => ele.remove(), time * 100);
    }
    addElement(tag, attribute, parrent, innerHTML, top, replaced) {
        let element = document.createElement(tag);
        attribute && (Object.entries(attribute).forEach(d => element.setAttribute(d[0], d[1])));
        parrent = parrent || document.body;
        innerHTML && (element.innerHTML = innerHTML);
        replaced ? replaced.replaceWith(element) : top ? parrent.insertBefore(element, parrent.firstChild) : parrent.appendChild(element);
        return element;
    }
    async addCss(txt, id, parrent) {
        if (!parrent && !document.head) {
            await new Promise(r => this.runWhile(() => document.body, r));
        }
        parrent = parrent || document.head;
        const style = document.createElement("style");
        style.setAttribute("type", "text/css");
        id && !parrent.querySelector(`#${id}`) && style.setAttribute("id", id);
        style.appendChild(document.createTextNode(txt));
        parrent.appendChild(style);
    }
    static runWhile(check, callback, delay = 100, stop = 180) {
        let timer = setInterval(() => {
            if (check()) {
                clearInterval(timer);
                callback();
            }
        }, delay);
        stop && setTimeout(() => clearInterval(timer), stop * 1000);
    }
    async alert(text, title = API.Name) {
        return new Promise((r) => {
            const root = this.addElement("div");
            const div = root.attachShadow({ mode: "closed" });
            const table = this.addElement("div", { class: "table" }, div, `
            <div class="title">${title}</div>
            <div class="text">${text}</div>
            <div class="act">
                <div class="button">确认</div>
                <div class="button">取消</div>
                </div>
            `);
            this.addCss('.table {display: flex;flex-direction: column;box-sizing: border-box;top: 50%;background: #FFFFFF;box-shadow: 0 3px 12px 0 rgb(0 0 0 / 20%);border-radius: 10px;width: 300px;height: auto;padding: 18px;position: fixed;left: 50%;transform: translateX(-50%) translateY(-50%);z-index: 1024;}.title {line-height: 22px;margin-left: 2px;margin-bottom: 10px;font-size: 14px;}.text {margin-bottom: 3px;height: 40px;margin-left: 2px;}.act {line-height: 154%;align-items: center;border-radius: 4px;box-sizing: border-box;cursor: pointer;display: inline-flex;flex-shrink: 0;font-weight: 500;height: 32px;justify-content: center;min-width: 5.14em;outline-width: 0;overflow: hidden;padding: 8px 16px;position: relative;user-select: none;border: none;color: #fff;justify-content: space-around;}.button, .action{line-height: 154%;align-items: center;border-radius: 4px;box-sizing: border-box;cursor: pointer;display: inline-flex;flex-shrink: 0;font-weight: 500;height: 32px;justify-content: center;min-width: 5.14em;outline-width: 0;overflow: hidden;padding: 8px 16px;position: relative;user-select: none;}.action {border: none;background-color: rgb(26,115,232);color: #fff;}.button {background-color: #fff;color: rgb(26,115,232);border: 1px solid rgba(0,0,0,6%);}.action:hover{background-color: rgb(72,115,232);}.button:hover{background-color: rgba(26,115,232,6%);}.action:active{box-shadow: 0 0 1px 1px rgba(72,115,232,80%);}.button:active{box-shadow: 0 0 1px 1px rgba(0,0,0,10%);}.button[disabled],.xaction[disabled]{pointer-events: none;background-color: rgba(19, 1, 1, 0.1);border: 1px solid rgba(0,0,0,.1);color: white;}', '', div);
            table.querySelectorAll(".button").forEach((d, i) => {
                i ? (d.onclick = () => { root.remove(), r(false); }) : (d.onclick = () => (root.remove(), r(true)));
            });
        });
    }
    getModule(name) {
        return Reflect.get(API.modules, name);
    }
    static importModule(name, args = {}, force = false) {
        if (!name)
            return Object.keys(API.modules);
        if (API.inModules.includes(name) && !force)
            return;
        if (Reflect.has(API.modules, name)) {
            API.inModules.push(name);
            new Function("API", "GM", "debug", "toast", "xhr", "config", "importModule", ...Object.keys(args), Reflect.get(API.modules, name))(API.API, GM, debug, toast, xhr, config, API.importModule, ...Object.keys(args).reduce((s, d) => {
                s.push(args[d]);
                return s;
            }, []));
        }
        else {
            let modules = Reflect.ownKeys(API.resource).reduce((s, d) => {
                let str = d.split("/");
                Reflect.set(s, str[str.length - 1], d);
                return s;
            }, {});
            if (Reflect.has(modules, name)) {
                API.downloadModule(name, Reflect.get(modules, name));
                toast.warning(`正在添加模块${Reflect.get(modules, name)}！请稍候~`);
            }
            else {
                API.toModules.push(name);
                !API.updating && API.updateModule();
            }
        }
    }
    static async firstInit() {
        ["rewrite.js", "ui.js", "setting.js"].forEach(d => this.toModules.push(d));
        await this.updateModule(`脚本首次运行初始化中~`, `感谢您使用 ${this.Name}！当前版本：${this.Virsion}`);
        toast.warning(`正在载入默认设置项~`);
        this.importModule("setting.js");
        LOADING.forEach(d => this.downloadModule(d));
        Reflect.has(API.modules, "rewrite.js") && toast.success(`初始化成功，刷新页面即可生效~`);
    }
    static async updateModule(...msg) {
        try {
            msg[0] && toast.warning(...msg);
            this.updating = true;
            let resource = await xhr.GM({
                url: 'https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@ts/resource.json',
                responseType: 'json'
            });
            let keys = Object.keys(resource);
            let list = keys.reduce((s, d) => {
                let str = d.split("/");
                Reflect.get(resource, d) != Reflect.get(this.resource, d) && (d.endsWith(".js") ?
                    Reflect.has(API.modules, str[str.length - 1]) && s.push([str[str.length - 1], d]) :
                    s.push([str[str.length - 1], d]));
                return s;
            }, []);
            GM.setValue("resource", this.resource = resource);
            this.toModules.forEach(d => {
                keys.find(b => b.includes(d)) && (list.push([d, keys.find(b => b.includes(d))]), toast.warning(`正在添加模块${d}！请稍候~`));
            });
            this.toModules = [];
            await Promise.all(list.reduce((s, d) => {
                s.push(this.downloadModule(d[0], d[1]));
                return s;
            }, []));
            this.updating = false;
            toast.success(`脚本及其模块已更新至最新版~`);
        }
        catch (e) {
            this.updating = false;
            toast.error(`检查更新出错！`, e);
        }
    }
    static async downloadModule(name, url) {
        try {
            if (!url) {
                url = Object.keys(this.resource).find(d => d.includes("name"));
            }
            let temp = url.endsWith(".js") ? url.replace(".js", ".min.js") : url;
            let module = await xhr.GM({
                url: `https://cdn.jsdelivr.net/gh/MotooriKashin/Bilibili-Old@${Reflect.get(this.resource, url)}/${temp}`
            });
            name.endsWith(".json") ? (GM.setValue(name.replace(".json", ""), JSON.parse(module))) : Reflect.set(API.modules, name, module);
            GM.setValue("modules", API.modules);
        }
        catch (e) {
            toast.error(`更新模块${name}失败，请检查网络！`);
        }
    }
    static init() {
        this.importModule("rewrite.js");
        window.self === window.top && this.runWhile(() => document.body, () => this.importModule("ui.js", { MENU }));
    }
    constructor() {
        API.API = new Proxy(this, {
            get: (target, p) => {
                return Reflect.get(window, p) || Reflect.get(this, p) || (Reflect.has(API.apply, p) ? (this.importModule(Reflect.get(API.apply, p), {}, true),
                    Reflect.get(this, p)) : new Error(`对象API上不存在方法${String(p)}，请检查源代码！`));
            },
            set: (_target, p, value) => {
                !Reflect.has(window, p) && Reflect.set(this, p, value);
                return true;
            }
        });
        Reflect.has(API.modules, "rewrite.js") ? API.init() : this.runWhile(() => document.body, () => this.alert(`即将下载脚本运行所需基本数据，请允许脚本访问网络权限！<strong>推荐选择“默认允许全部域名”</strong>`).then(d => { d && API.firstInit(); }));
    }
}
new API();

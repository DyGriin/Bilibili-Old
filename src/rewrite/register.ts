/**
 * 本模块是负责集中注册来自`rewrite.js`的相关设置项及设置菜单类别  
 * 由于`rewrite.js`中要注册的内容过多，故集中在一个模块中以方便处理  
 * 注册菜单及设置其他可以在任意模块中，怎么方便怎么来
 */
(function () {
    // 注册菜单
    [
        {
            key: "rewrite",
            name: "重写",
            svg: `<svg viewBox="0 0 24 24"><g><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"></path></g></svg>`
        },
        {
            key: "restore",
            name: "修复",
            svg: `<svg viewBox="0 0 16 16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>`
        }, {
            key: "style",
            name: "样式",
            svg: `<svg viewBox="0 0 24 24"><g><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"></path></g></svg>`
        }, {
            key: "danmaku",
            name: "弹幕",
            svg: `<svg viewBox="0 0 22 22"><path d="M16.5 8c1.289 0 2.49.375 3.5 1.022V6a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2h7.022A6.5 6.5 0 0116.5 8zM7 13H5a1 1 0 010-2h2a1 1 0 010 2zm2-4H5a1 1 0 010-2h4a1 1 0 010 2z"></path><path d="M20.587 13.696l-.787-.131a3.503 3.503 0 00-.593-1.051l.301-.804a.46.46 0 00-.21-.56l-1.005-.581a.52.52 0 00-.656.113l-.499.607a3.53 3.53 0 00-1.276 0l-.499-.607a.52.52 0 00-.656-.113l-1.005.581a.46.46 0 00-.21.56l.301.804c-.254.31-.456.665-.593 1.051l-.787.131a.48.48 0 00-.413.465v1.209a.48.48 0 00.413.465l.811.135c.144.382.353.733.614 1.038l-.292.78a.46.46 0 00.21.56l1.005.581a.52.52 0 00.656-.113l.515-.626a3.549 3.549 0 001.136 0l.515.626a.52.52 0 00.656.113l1.005-.581a.46.46 0 00.21-.56l-.292-.78c.261-.305.47-.656.614-1.038l.811-.135A.48.48 0 0021 15.37v-1.209a.48.48 0 00-.413-.465zM16.5 16.057a1.29 1.29 0 11.002-2.582 1.29 1.29 0 01-.002 2.582z"></path></svg>`
        }
    ].forEach((d: Menuitem) => API.addMenu(d));
    // 注册设置项
    API.addSetting({
        key: "av",
        sort: "rewrite",
        label: "av/BV",
        type: "switch",
        value: true,
        float: '重写以恢复旧版av视频播放页。'
    })
    API.addSetting({
        key: "lostVideo",
        sort: "restore",
        label: "失效视频信息",
        sub: `封面和标题`,
        type: "switch",
        value: false,
        float: '使用第三方数据修复收藏、频道等处的失效视频信息。（以红色删除线标记）</br>访问失效视频链接时将尝试重建av页面。</br>※ 依赖第三方数据库且未必有效，<strong>请谨慎考虑是否开启！</strong>'
    })
    API.addSetting({
        key: "oldReply",
        sort: "style",
        label: "旧版评论样式",
        sub: `先时间后热度`,
        type: "switch",
        value: false,
        float: '使用旧版评论样式，优先按时间排序。</br>此版本不会再维护！'
    })
    API.addSetting({
        key: "upList",
        sort: "style",
        label: "UP主列表",
        sub: "展示视频合作者",
        type: "switch",
        value: false
    })
    API.addSetting({
        key: "commandDm",
        sort: "danmaku",
        label: "互动弹幕",
        sub: "投票弹窗等",
        type: "switch",
        value: false,
        float: `启用后，可以使用新版播放器新增的 弹幕投票弹窗 和 关联视频跳转按钮 两项功能。</br>其他类型的互动弹幕如引导关注、三连按钮等目前还没有在脚本中实现，正在逐步开发中。</br>脚本实现的互动弹幕外观上与新播放器有较大差别，如果有建议或者遇上bug，欢迎反馈。</br>※需要同时开启新版proto弹幕。`
    })
    API.addSetting({
        key: "liveDm",
        sort: "danmaku",
        label: "实时弹幕",
        type: "switch",
        value: true,
        float: `hook WebSocket以修复实时弹幕`
    })
})();
declare namespace config {
    /**
     * 重写：av/BV
     */
    let av: boolean;
    /**
     * 修复：失效视频信息
     */
    let lostVideo: boolean;
    /**
     * 样式：旧版评论
     */
    let oldReply: boolean;
    /**
     * 样式：UP主列表
     */
    let upList: boolean;
    /**
     * 弹幕：实时弹幕
     */
    let liveDm: boolean;
}
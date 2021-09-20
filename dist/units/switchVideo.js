/**
 * 本模块负责执行切P调用监听
 */
(function () {
    try {
        const switchlist = [];
        /**
         * 注册切P回调
         * @param callback 切P时的回调函数
         */
        function switchVideo(callback) {
            if (typeof callback === "function")
                switchlist.push(callback);
        }
        API.switchVideo = (callback) => switchVideo(callback);
        // if (/bilibili-player-video-btn-start/.test(node.className)) {
        //     switchlist.forEach(d => d());
        // }
        API.observerAddedNodes((node) => {
            if (/bilibili-player-video-btn-start/.test(node.className)) {
                switchlist.forEach(d => d());
            }
        });
    }
    catch (e) {
        API.trace(e, "switchVideo.js", true);
    }
})();

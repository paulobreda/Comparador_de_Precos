/*
* Event listener form DOM ready
*/
function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

/*
* Returns iOS version
*/
function checkVersion() {
    var agent = window.navigator.userAgent,
    start = agent.indexOf("OS ");

    if ((agent.indexOf("iPhone") > -1 || agent.indexOf("iPad") > -1 ) && start > -1 ) {
        return window.Number(agent.substr( start + 3, 3 ).replace("_", "."));
    }

    return 0;
}

/*
* Populate and show message to update/change browser if is outdated on DOM ready
*/
addLoadEvent(function(){
    // IE version check
    var isIEOlderThan11 = /*@cc_on!@*/false;
    var isIE11 = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
    var isIE = isIE11 || isIEOlderThan11;

    // iOS version check
    var iOSVersion = checkVersion();
    var isIOSOlderThan11 = iOSVersion != 0 && iOSVersion < 11;

    if (isIE || isIOSOlderThan11) {
        var msgContainer = document.getElementById("outdated-browser-message");
        if (!msgContainer) { return; }
        msgContainer.innerHTML = msgContainer.getAttribute("data-msg");
        msgContainer.className -= "d-none";
    }
});

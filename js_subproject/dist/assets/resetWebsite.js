var inactivityTime = function () {
    var t;
    window.onload = resetTimer;
    // DOM Events
    document.onload = resetTimer;
    document.onmousemove = resetTimer
    document.onmousedown = resetTimer // touchscreen presses
    document.ontouchstart = resetTimer
    document.onclick = resetTimer     // touchpad clicks
    document.onscroll = resetTimer    // scrolling with arrow keys
    document.onkeypress = resetTimer

    function resetTimer () {
        clearTimeout(t);
        t = setTimeout(function () {
            window.location.replace('/')
        }, 120000)
        // 1000 milisec = 1 sec, so this is 3 minutes
    }
};
inactivityTime()

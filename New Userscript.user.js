// ==UserScript==
// @name         Time Twitch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
    window.onload = function () {
        if (document.querySelector('[data-a-target="player-seekbar-duration"]')) {
            let MyElement = document.createElement("div");
            MyElement.style = "font-size: 13px; display: flex; height: 100%; align-items: center; justify-content: flex-end;";
            MyElement.innerHTML = `<div id="myTime" style="background-color: #00000079; padding: 5px; font-size: 17px; margin: 0px; border-radius: 5px;">00:00:00</div>`;

            document.querySelector('[data-a-target="player-overlay-click-handler"]').appendChild(MyElement);

            let Duration = document.querySelector('[data-a-target="player-seekbar-duration"]').innerText;
            let TimeDuration = new Date("1970-01-01T" + Duration).getTime();
            setInterval(function() {
                let CurrentTime = new Date("1970-01-01T" + document.querySelector('[data-a-target="player-seekbar-current-time"]').innerText).getTime();
                let dis = TimeDuration - CurrentTime;

                let hours   = Math.floor((dis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((dis % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((dis % (1000 * 60)) / 1000);

                document.getElementById("myTime").innerText = " -"+hours+":"+minutes+":"+seconds+" / "+ Duration+" ";

                if (document.querySelector('[data-a-target="player-controls"]').getAttribute("data-a-visible") == "true"){
                    document.getElementById("myTime").style.display="flex";
                }else{
                    document.getElementById("myTime").style.display="none";
                }
            }, 300);
        }
    }
})();

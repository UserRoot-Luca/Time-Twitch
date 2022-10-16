// ==UserScript==
// @name         Time Twitch
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function() {
    window.onload = function () {
        if (document.querySelector('[data-a-target="player-seekbar-duration"]')) {
            let MyElement = document.createElement("div");
            MyElement.style = "font-size: 13px; display: flex; height: 100%; align-items: center; justify-content: flex-end;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";
            MyElement.innerHTML = `<div id="myTime" style="background-color: #00000079; padding: 5px; font-size: 17px; margin: 0px; border-radius: 5px;">00:00:00</div>`;

            document.querySelector('[data-a-target="player-overlay-click-handler"]').appendChild(MyElement);

            let Duration = document.querySelector('[data-a-target="player-seekbar-duration"]').innerText;
            let TimeDuration = new Date("1970-01-01T" + Duration).getTime();
            let TimeString = "";
            setInterval(function() {
                let CurrentTime = new Date("1970-01-01T" + document.querySelector('[data-a-target="player-seekbar-current-time"]').innerText).getTime();
                let dis = TimeDuration - CurrentTime;

                if (document.querySelector(".hEHNVv")) {
                    let multiplier = parseFloat(document.querySelector(".hEHNVv").innerHTML.slice(0, -1));
                    if (multiplier >= 1) { dis /= multiplier; } 
                }
                
                let hours   = Math.floor((dis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = Math.floor((dis % (1000 * 60 * 60)) / (1000 * 60));
                let seconds = Math.floor((dis % (1000 * 60)) / 1000);

                if (hours   < 10 ) {hours   = "0" + hours   }
                if (minutes < 10 ) {minutes = "0" + minutes }
                if (seconds < 10 ) {seconds = "0" + seconds }

                let currentTimeString = " -"+hours+":"+minutes+":"+seconds+" / "+ Duration+" ";
                
                if (TimeString != currentTimeString) {
                    TimeString = currentTimeString
                    document.getElementById("myTime").innerText = currentTimeString;
                }

                if (document.querySelector('[data-a-target="player-controls"]').getAttribute("data-a-visible") == "true"){
                    document.getElementById("myTime").style.display="flex";
                }else{
                    document.getElementById("myTime").style.display="none";
                }
            }, 300);
        }
    }
})();

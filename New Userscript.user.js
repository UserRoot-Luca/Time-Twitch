"use strict";
// ==UserScript==
// @name         Time Twitch
// @namespace    http://tampermonkey.net/
// @version      5.3
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    const TimeFormats = (inTime) => {
        let h = Math.floor((inTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let m = Math.floor((inTime % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((inTime % (1000 * 60)) / 1000);
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (s < 10) {
            s = "0" + s;
        }
        return {
            hours: String(h),
            minutes: String(m),
            seconds: String(s)
        };
    };
    const DisMultiplier = (Dis) => {
        let el = document.evaluate("//*[@id=\"channel-player\"]/div/div[2]/div[1]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (el) {
            let Multiplier = parseFloat((el.textContent || el.innerHTML).slice(0, -1));
            if (Multiplier >= 1) {
                return Dis / Multiplier;
            }
        }
        return Dis;
    };
    let TimeOut = 0;
    const CheckElemete = setInterval(() => {
        if (TimeOut == 600) {
            clearInterval(CheckElemete);
        }
        let Duration = document.querySelector('[data-a-target="player-seekbar-duration"]');
        if (Duration != null) {
            let TimeDuration = new Date("1970-01-01T" + (Duration.textContent || Duration.innerHTML)).getTime();
            document.querySelector('[data-a-target="player-seekbar-current-time"]').addEventListener("DOMSubtreeModified", (e) => {
                let E_MyTime = document.getElementById("myTime");
                if (E_MyTime == null) {
                    let E_Time = document.createElement("div");
                    E_Time.setAttribute('style', `font-size: 13px;display: flex;height: 100%;align-items: center;justify-content: flex-end;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;`);
                    E_Time.innerHTML = `<div id="myTime" style="background-color: #00000060; padding: 3px 2px; font-size: 16px; margin: 0px; border-radius: 5px;">00:00:00</div>`;
                    document.querySelector('[data-a-target="player-overlay-click-handler"]').appendChild(E_Time);
                }
                let CurrentTime = new Date("1970-01-01T" + (e.target.textContent || e.target.innerHTML)).getTime();
                let Time = TimeFormats(DisMultiplier(TimeDuration - CurrentTime));
                if (E_MyTime != null) {
                    E_MyTime.textContent = " ( -" + Time.hours + ":" + Time.minutes + ":" + Time.seconds + " / " + (Duration.textContent || Duration.innerHTML) + " )";
                    if (document.querySelector('[data-a-target="player-controls"]').getAttribute("data-a-visible") == "true") {
                        E_MyTime.style.display = "flex";
                    }
                    else {
                        E_MyTime.style.display = "none";
                    }
                }
            });
            clearInterval(CheckElemete);
        }
        TimeOut++;
    }, 300);
})();

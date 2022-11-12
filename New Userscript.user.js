// ==UserScript==
// @name         Time Twitch
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  ###
// @author       UserRoot-Luca
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// @run-at       document-end
// ==/UserScript==
(function () {
    window.onload = function () {
        if (document.querySelector('[data-a-target="player-seekbar-duration"]')) {
            var TimeFormats_1 = function (inTime) {
                var h = Math.floor((inTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var m = Math.floor((inTime % (1000 * 60 * 60)) / (1000 * 60));
                var s = Math.floor((inTime % (1000 * 60)) / 1000);
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
            var DisMultiplier_1 = function (Dis) {
                if (document.querySelector(".hEHNVv")) {
                    var Multiplier = parseFloat(document.querySelector(".hEHNVv").innerHTML.slice(0, -1));
                    if (Multiplier >= 1) {
                        return Dis / Multiplier;
                    }
                }
                return Dis;
            };
            var E_Time = document.createElement("div");
            E_Time.setAttribute('style', "\n                font-size: 13px; \n                display: flex; \n                height: 100%; \n                align-items: center; \n                justify-content: flex-end;\n                -webkit-touch-callout: none;\n                -webkit-user-select: none;\n                -khtml-user-select: none;\n                -moz-user-select: none;\n                -ms-user-select: none;\n                user-select: none;\n            ");
            E_Time.innerHTML = "\n                <div id=\"myTime\" style=\"background-color: #00000060; padding: 3px 2px; font-size: 16px; margin: 0px; border-radius: 5px;\">\n                    00:00:00\n                </div>\n            ";
            document.querySelector('[data-a-target="player-overlay-click-handler"]').appendChild(E_Time);
            var Main_Duration_1 = document.querySelector('[data-a-target="player-seekbar-duration"]').innerText;
            var Main_TimeDuration_1 = new Date("1970-01-01T" + Main_Duration_1).getTime();
            var Main_TimeString_1 = "";
            var Bar_TimeString_1 = "";
            setInterval(function () {
                var Main_E_MyTime = document.getElementById("myTime");
                var Main_CurrentTime = new Date("1970-01-01T" + document.querySelector('[data-a-target="player-seekbar-current-time"]').innerText).getTime();
                var Main_Dis = DisMultiplier_1(Main_TimeDuration_1 - Main_CurrentTime);
                var Main_Time = TimeFormats_1(Main_Dis);
                if (document.querySelector(".ibgvRA") != null) {
                    var Bar_E_TimeBar = document.querySelector("#TimeBar");
                    if (!Bar_E_TimeBar) {
                        var E_TimeBar = document.createElement("p");
                        E_TimeBar.id = "TimeBar";
                        E_TimeBar.setAttribute('style', "\n                            margin-left: 3px;\n                        ");
                        E_TimeBar.innerHTML = "( -00:00:00 )";
                        document.querySelector(".ibgvRA").appendChild(E_TimeBar);
                    }
                    var Bar_TimeDuration_1 = 0;
                    document.querySelector(".ibgvRA").childNodes.forEach(function (e) {
                        if (e.className == "CoreText-sc-cpl358-0 Azerv") {
                            Bar_TimeDuration_1 = new Date("1970-01-01T" + e.innerHTML).getTime();
                        }
                    });
                    var Bar_Dis = DisMultiplier_1(Bar_TimeDuration_1 - Main_CurrentTime);
                    if (Bar_Dis > 0) {
                        var Bar_Time = TimeFormats_1(Bar_Dis);
                        var Bar_CurrentTimeString = "( -".concat(Bar_Time.hours, ":").concat(Bar_Time.minutes, ":").concat(Bar_Time.seconds, " )");
                        if (Bar_TimeString_1 != Bar_CurrentTimeString) {
                            Bar_TimeString_1 = Bar_CurrentTimeString;
                            Bar_E_TimeBar.innerHTML = Bar_CurrentTimeString;
                        }
                    }
                    else
                        Bar_E_TimeBar.innerHTML = "( -00:00:00 )";
                }
                var Main_CurrentTimeString = " -" + Main_Time.hours + ":" + Main_Time.minutes + ":" + Main_Time.seconds + " / " + Main_Duration_1 + " ";
                if (Main_TimeString_1 != Main_CurrentTimeString) {
                    Main_TimeString_1 = Main_CurrentTimeString;
                    Main_E_MyTime.innerText = Main_CurrentTimeString;
                }
                if (document.querySelector('[data-a-target="player-controls"]').getAttribute("data-a-visible") == "true") {
                    Main_E_MyTime.style.display = "flex";
                }
                else {
                    Main_E_MyTime.style.display = "none";
                }
            }, 300);
        }
    };
})();

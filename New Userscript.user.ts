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
(function() {
    window.onload = () => {
        if (document.querySelector('[data-a-target="player-seekbar-duration"]')) {
            const TimeFormats = (inTime: number): {hours: string, minutes: string, seconds: string} => {
                let h:number | string = Math.floor((inTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let m:number | string = Math.floor((inTime % (1000 * 60 * 60)) / (1000 * 60));
                let s:number | string = Math.floor((inTime % (1000 * 60)) / 1000);

                if (h < 10 ) { h = "0" + h; }
                if (m < 10 ) { m = "0" + m; }
                if (s < 10 ) { s = "0" + s; }

                return {
                    hours: String(h),
                    minutes: String(m),
                    seconds: String(s)
                }
            }
            const DisMultiplier = (Dis: number):number => {
                if (document.querySelector(".hEHNVv")) {
                    let Multiplier:number = parseFloat(document.querySelector(".hEHNVv")!.innerHTML.slice(0, -1));
                    if (Multiplier >= 1) { return Dis / Multiplier; }
                }
                return Dis;
            }

            let E_Time:HTMLDivElement = document.createElement("div");
            E_Time.setAttribute('style',  `
                font-size: 13px; 
                display: flex; 
                height: 100%; 
                align-items: center; 
                justify-content: flex-end;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            `);
            E_Time.innerHTML = `
                <div id="myTime" style="background-color: #00000060; padding: 3px 2px; font-size: 16px; margin: 0px; border-radius: 5px;">
                    00:00:00
                </div>
            `;
            document.querySelector('[data-a-target="player-overlay-click-handler"]')!.appendChild(E_Time);
            
            let Main_Duration = document.querySelector<HTMLElement>('[data-a-target="player-seekbar-duration"]')!.innerText;
            let Main_TimeDuration = new Date("1970-01-01T" + Main_Duration).getTime();
            let Main_TimeString = "";
            let Bar_TimeString = "";

            setInterval(() => {
                let Main_E_MyTime = document.getElementById("myTime");
                let Main_CurrentTime = new Date("1970-01-01T" + document.querySelector<HTMLElement>('[data-a-target="player-seekbar-current-time"]')!.innerText).getTime();
                let Main_Dis = DisMultiplier(Main_TimeDuration - Main_CurrentTime) ;
                let Main_Time = TimeFormats(Main_Dis);

                if (document.querySelector(".ibgvRA") != null) {
                    let Bar_E_TimeBar = document.querySelector("#TimeBar");
                    if (!Bar_E_TimeBar) {
                        let E_TimeBar = document.createElement("p");
                        E_TimeBar.id = "TimeBar";
                        E_TimeBar.setAttribute('style', `
                            margin-left: 3px;
                        `);
                        E_TimeBar.innerHTML = "( -00:00:00 )";
                        document.querySelector(".ibgvRA")!.appendChild(E_TimeBar);      
                    }
                    let Bar_TimeDuration = 0;
                    document.querySelector(".ibgvRA")!.childNodes.forEach((e:any) => {
                        if (e.className == "CoreText-sc-cpl358-0 Azerv") { Bar_TimeDuration = new Date("1970-01-01T" + e.innerHTML).getTime(); }
                    })
                    let Bar_Dis = DisMultiplier(Bar_TimeDuration - Main_CurrentTime);

                    if (Bar_Dis > 0) {
                        let Bar_Time = TimeFormats(Bar_Dis);
                        let Bar_CurrentTimeString  = `( -${Bar_Time.hours}:${Bar_Time.minutes}:${Bar_Time.seconds} )`;
                        if (Bar_TimeString != Bar_CurrentTimeString) {
                            Bar_TimeString = Bar_CurrentTimeString;
                            Bar_E_TimeBar!.innerHTML = Bar_CurrentTimeString;
                        }
                    } else Bar_E_TimeBar!.innerHTML = "( -00:00:00 )";
                }

                let Main_CurrentTimeString = " -"+Main_Time.hours+":"+Main_Time.minutes+":"+Main_Time.seconds+" / "+ Main_Duration+" ";
                
                if (Main_TimeString != Main_CurrentTimeString) {
                    Main_TimeString = Main_CurrentTimeString;
                    Main_E_MyTime!.innerText = Main_CurrentTimeString;
                }

                if (document.querySelector('[data-a-target="player-controls"]')!.getAttribute("data-a-visible") == "true"){
                    Main_E_MyTime!.style.display="flex";
                } else {
                    Main_E_MyTime!.style.display="none";
                }
            }, 300);
        }
    }
})();
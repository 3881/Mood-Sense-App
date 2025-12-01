const activityList = ["locatie", "staat", "activiteit", "geluid", "beweging", "gebeurtenis"];

window.addEventListener("load" , () => {
    $('.ui.accordion').accordion();
    $('.dropdown').dropdown();

    let buttons = document.querySelectorAll(".ui.button[data-item]");
    buttons.forEach(element => {
        element.addEventListener("click" , change);
    });

    // let slider = document.getElementById("com");
    // slider.addEventListener("change", changeRange);

    let recButton = document.getElementById("recordbutton");
    recButton.addEventListener("click", record);
});

// function changeRange(event) {
//     let btn = event.currentTarget;
//     const comcode = ['P-00-XX-99', 'P-00-XX-98', 'P-00-XX-97', 'P-00-XX-96'];
//     const colors = ['green', 'yellow', 'orange', 'red'];
//     btn.style.background = colors[btn.value];
//     httpGetAsync(`/post?button=${comcode[btn.value]}`);
// }

function change(event) {
    btn = event.currentTarget;
    for (let i = 0; i < activityList.length; i++) {
        if (btn.parentElement.id == activityList[i]) {
            for (let j = 0; j < btn.parentElement.children.length; j++) {
                if (btn.parentElement.children[j] == btn) {
                    if (btn.classList.contains("active")) {
                        btn.classList.remove("active", "green");
                        httpGetAsync(`/post?button=${btn.getAttribute("data-item")}&action=0&type=${activityList[i]}`);
                    } else {
                        btn.classList.add("active", "green");
                        httpGetAsync(`/post?button=${btn.getAttribute("data-item")}&action=1&type=${activityList[i]}`);
                    }
                }
            }
        }
    }
    if(btn.classList.contains("toggle")){
        
        if(btn.classList.contains("basic")){
            let toggleBtns = document.getElementsByClassName("toggle");
            for(let tb = 0; tb < toggleBtns.length; tb++){
                toggleBtns[tb].classList.add("basic");
            }
            btn.classList.remove("basic");
            httpGetAsync(`/post?button=${btn.getAttribute("data-item")}&action=2&type=com`);
        } else {
            btn.classList.add("basic");
        }
    }
}

function httpGetAsync(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            console.log(xmlHttp.responseText);
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.send(null);
}

// ---- AUDIO RECORDING ----
function sendData(blob) {
    const url = `/recording`; // protocol-agnostic
    const oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);
    oReq.onload = function () {
        console.log("Upload complete:", oReq.status);
    };
    oReq.send(blob);
}

let mediaRecorder;
// let audioUrl;

function startRecord() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Audio recording requires HTTPS or localhost.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];
            mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                console.log("Recorded audio size:", audioBlob.size);
                sendData(audioBlob);
                rec_icon.classList.remove("stop");
                rec_icon.classList.add("circle");
            };
            mediaRecorder.start();
            rec_icon.classList.remove("circle");
            rec_icon.classList.add("stop");

        })
        .catch(err => console.error("Microphone error:", err));
}

function record(event) {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    } 
    else {
        startRecord();
    }
}
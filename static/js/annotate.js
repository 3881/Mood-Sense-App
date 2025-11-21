const activityList = ["actie", "activiteit", "geluid", "beweging", "gebeurtenis", "locatie"];

window.addEventListener("load" , () => {
    $('.ui.accordion').accordion();
});

function changeColor(btn) {
    console.log(btn.value);
    btn.classList.add("green");
}

function changeRange(btn) {
    const comcode = ['P-00-XX-99', 'P-00-XX-98', 'P-00-XX-97', 'P-00-XX-96'];
    const colors = ['green', 'yellow', 'orange', 'red'];
    btn.style.background = colors[btn.value];
    httpGetAsync(`/post?button=${comcode[btn.value]}`);
}


function change(btn) {
    if (!btn.value) btn.value = 0;
    for (let i = 0; i < activityList.length; i++) {
    if (btn.parentElement.id == activityList[i]) {
        for (let j = 0; j < btn.parentElement.children.length; j++) {
        if (btn.parentElement.children[j] == btn) {
            if (btn.value == 0) {
            btn.classList.add("active", "green");
            btn.value = 1;
            } else {
            btn.classList.remove("active", "green");
            btn.value = 0;
            }
        }
        }
    }
    }
    httpGetAsync(`/post?button=${btn.id}`);
}

function httpGetAsync(url) {
    console.log("Requesting:", url);
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        console.log(xmlHttp.responseText);
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
let audioUrl;

function startRecord(button) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Audio recording requires HTTPS or localhost.");
    return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];
        mediaRecorder.ondataavailable = event => audioChunks.push(event.data);
        mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        console.log("Recorded audio size:", audioBlob.size);
        sendData(audioBlob);
        };
        mediaRecorder.start();
    })
    .catch(err => console.error("Microphone error:", err));
}

function record(button) {
    if (button.style.backgroundColor == 'green') {
    button.style.backgroundColor = 'red';
    startRecord(button);
    } else {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }
    button.style.backgroundColor = 'green';
    }
}
    function changeColor(btn) {
      console.log(btn.value);
      btn.classList.add("green");
    }

    function changeRange(btn) {

      let pers = ['0%', '33.3333%', '66.6667%', '100%'];
      let colors = ['green', 'yellow', 'orange', 'red'];
      let comcode = ['P-00-XX-99', 'P-00-XX-98', 'P-00-XX-97', 'P-00-XX-96'];
      let val = btn.value;

      btn.style.background = colors[btn.value];
      console.log(btn.value);
      httpGetAsync(`{{hostname}}post?button=${comcode[btn.value]}`);
    }

    let activityList = ["actie", "activiteit", "geluid", "beweging", "gebeurtenis", "locatie"];

    function change(btn) {

      if (!btn.value) {
        btn.value = 0;
      }
      for (let i = 0; i < activityList.length; i++) {
        if (btn.parentElement.id == activityList[i]) {
          console.log(btn.parentElement.children);
          for (let j = 0; j < btn.parentElement.children.length; j++) {
            if (btn.parentElement.children[j] == btn) {
              if (btn.value == 0) {
                btn.classList.add("active");
                btn.classList.add("green");
                btn.value = 1;
              }
              else {
                btn.classList.remove("active");
                btn.classList.remove("green");
                btn.value = 0;
              }
            }
            //else {
              //btn.parentElement.children[j].classList.remove("active");
              //btn.parentElement.children[j].classList.remove("green");
              //if (btn.parentElement.children[j].value == 1) {
              //  btn.parentElement.children[j].value = 0;
              //}
            //}
          }
        }
      }
      httpGetAsync(`{{hostname}}post?button=${btn.id}`);
    }

    function httpGetAsync(url) {

      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
          console.log(xmlHttp.responseText);
      }
      xmlHttp.open("GET", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
  
    function sendData(blob) {



      var oReq = new XMLHttpRequest();
      var url = `{{hostname}}recording`
      oReq.open("POST", url, true);
      oReq.onload = function (oEvent) {
        // Uploaded.
      };
      oReq.send(blob);

    }

var mediaRecorder;
var audioUrl;


function startRecord(button){
  navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.start();

    const audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
      audioChunks.push(event.data);
    });
    
    mediaRecorder.addEventListener("stop", () => {
      const audioBlob = new Blob(audioChunks);
      audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      sendData(audioBlob);
      //audio.play();
    });

    //setTimeout(() => {
      //mediaRecorder.stop();
    //}, 3000);
  });
}

    function record(button){
      if(button.style.backgroundColor == 'green'){
        button.style.backgroundColor = 'red';
        startRecord(button);
        
      }else{
        mediaRecorder.stop();
        button.style.backgroundColor = 'green';
      }
      
    }



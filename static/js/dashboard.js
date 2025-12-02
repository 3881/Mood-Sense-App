window.addEventListener("load", ()=> {
    ip.addEventListener("change", (event)=>{
      GetAnnotations(event.currentTarget.value);
    });
    GetGroups();
});

function GetGroups() {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            let list_data = JSON.parse(xmlHttp.responseText);
            for(let i = 0; i < list_data.length; i++){
                let option = document.createElement("option");
                option.innerHTML = list_data[i][1] + " - " + list_data[i][2];
                option.value = list_data[i][0];
                ip.appendChild(option);
            }
            GetAnnotations(ip.value);
        }
    };
    xmlHttp.open("GET", "/groups", true);
    xmlHttp.send(null);
}

function GetAnnotations(id){
    const fields = ['id', 'ip', 'time', 'code', 'action', 'type'];
    const actions = ['off','on','switch'];
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = () => {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            while(annotation_list.firstChild){
                annotation_list.removeChild(annotation_list.lastChild);
            }
            let annotation_data = JSON.parse(xmlHttp.responseText);
            for(let i = 0; i < annotation_data.length; i++){
                let annotation = document.createElement("tr");
                for(let f = 0; f < fields.length; f++){
                    let cell = document.createElement("td");
                    cell.setAttribute("data-label", fields[f]);
                    switch(fields[f]){
                        case "action":
                            cell.innerHTML = actions[annotation_data[i][f]];
                            break;
                        default:
                            cell.innerHTML = annotation_data[i][f];
                    }
                    annotation.appendChild(cell);
                }
                annotation_list.appendChild(annotation);
            }
        }
    };
    xmlHttp.open("GET", "/annotations?id=" + id, true);
    xmlHttp.send(null);
}
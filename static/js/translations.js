window.addEventListener("load",  event =>{
    let lan = document.getElementById("languages");
    for(let c = 0; c < lan.childElementCount; c++){
        let child = lan.children[c];
        if(child.getAttribute("data-language") != null){
            child.addEventListener("click", (event) => {
                SetLanguage(child.getAttribute("data-language"));
            });
        }
    }
});

function SetLanguage(language){
    let elements = document.getElementsByTagName("*");
    for(let e = 0; e < elements.length; e++){
        let element = elements[e];
        if(element.getAttribute("data-language-" + language) != null ){
            element.textContent = element.getAttribute("data-language-" + language);
            console.log("set: " + element.getAttribute("data-language"));
        }
    }
}
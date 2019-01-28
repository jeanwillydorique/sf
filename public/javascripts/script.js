

// document.querySelector('.formulaireCon').addEventListener('submit', function(evt){

//     evt.preventDefault();


//     let form = evt.target; 
//     let method = evt.target.method;
//     let val = [];

//     form.querySelectorAll('[name]').forEach(function(el){
//         val.push(el.value);
//         //val[el.getAttribute('name')] = el.value
//         // [el.getAttribute('name')]
//     });

//     console.log(val)
//     //debugger;

//     makeRequest('', method , val, function(res){
//         let body = document.querySelector('body');
//         let span = document.createElement("span");
//         span.innerHTML = res.response;
//         body.replaceWith(span.firstElementChild)
//         alert("Vous etes connecté");
//         //window.location.replace("./users/homepage")
//         //window.location.href = "./users/homepage";
//     })
// })

// Read One Post 

let overlay = document.querySelectorAll(".overlay");

overlay.forEach(element => {
    element.addEventListener('click', (el) => {
        let id = el.target.dataset["id"];
        let val = {};
        makeRequest(id , "POST" , val , " ", function(element,re){
            //console.log(re.response[0])
            let postSpan = document.querySelector(".postSpan");
            let postFullLeft = document.querySelector(".postFullLeft");
            let postFullRight = document.querySelector(".postFullRight");
            let postFullAvatarCard = document.createElement("DIV");
            let postFullAvatarCardIMG = document.createElement("DIV");
            let postFullAvatarCardH3 = document.createElement("P");

            postSpan.classList.add("flex");

            /* creéation des élements à injecter dans le DOM */
            postFullLeft.style.backgroundImage = "url('" + re.response["0"].Img + "')"


            postFullAvatarCardIMG.style.backgroundImage = "url('" + re.response["1"].Avatar + "')";
            postFullAvatarCardIMG.classList.add("postFullAvatarCardIMG");
            postFullAvatarCardH3.innerHTML = re.response["1"].Username ;

            postFullAvatarCard.appendChild(postFullAvatarCardIMG);
            postFullAvatarCard.appendChild(postFullAvatarCardH3);

            /* append child */ 


            postFullRight.appendChild(postFullAvatarCard)
            
            //debugger;
        })
    })
});

let closedButton = document.querySelectorAll(".closedButton");

closedButton.forEach(element => {
    element.addEventListener('click', (el) => {
        debugger
        let parent = el.target.closest(".postSpan");
        let enfant = parent.children;
        enfant[0].innerHTML = "";
        enfant[1].innerHTML = "";
        parent.classList.remove("flex");
    });
});


// Nouveaux commentaire Insert to Comment collection with Post ID

let comment = document.querySelectorAll(".fa-comments");

comment.forEach(element => {
    element.addEventListener('click', (el) =>{
        let cible = el.target;
        let data = el.target.closest(".input-group").firstChild.value;
        let id = el.target.closest(".post").dataset["id"];

        makeRequest(" ", "POST" , {"Content": data, "ID" : id} ,cible, function(cible, re){    
           
        })

    })
});


// Nouveux follower insert Id in followers 

// Like same thing 

let like = document.querySelectorAll(".fa-heart");

like.forEach(element => {
    element.addEventListener('click', (el) => {

        let cible = el.target;
        let id = el.target.closest(".post").dataset["id"];
        let previousNumber = el.target.nextElementSibling.innerText;
        let newNumber = parseInt(previousNumber, 10) + 1;

        makeRequest(id , "PUT" , {"Like": newNumber} ,cible, function(cible, re){

            cible.nextElementSibling.innerHTML = re.newNumber.Like;
            //debugger;
        })
    })
});


// functions MakeRequest


function makeRequest(ID, METHOD, DATA, Element, callback){ //DATA) {

    var httpRequest = false;

    httpRequest = new XMLHttpRequest();


    if (!httpRequest) {
        alert('Abandon :( Impossible de créer une instance XMLHTTP');
        return false;
    }
    httpRequest.onreadystatechange = function() { alertContents(httpRequest, Element, callback); };
    httpRequest.open(METHOD, '/api/' + ID + '');
    httpRequest.setRequestHeader('Content-type', 'application/json');
    //httpRequest.send(DATA);
    httpRequest.send(JSON.stringify(DATA));//( data ? JSON.stringify(DATA) : null ); verifie si la variable est null à lire si data existe envoie JSON... sinon envoie null écriture ternère  
};

function alertContents(httpRequest, Element, callback) {

    if (httpRequest.readyState == XMLHttpRequest.DONE) {
        if (httpRequest.status == 200) {
            //alert("element supprimé");
            //console.log(httpRequest.response)
            //debugger
            callback(Element,JSON.parse(httpRequest.response))
        } else {
            alert('Un problème est survenu avec la requête.');
        };
    };

};

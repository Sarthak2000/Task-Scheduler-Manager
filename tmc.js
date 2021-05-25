let ColorCode = {
    "blue": "#778beb",
    "yellow": "#f5cd79",
    "green": "#32ff7e",
    "black": "#3d3d3d"
}
let allColors = document.querySelectorAll(".color");
let para = document.querySelector(".ticket-content")
let opentab = document.querySelector(".open-plus");
let ticket = document.querySelector(".ticket-content");
let closetab = document.querySelector(".close-cross");
let activemodalfilter = "blue";
for (let i = 0; i < allColors.length; i++) {
    allColors[i].addEventListener("click", function (event) {
        let clickedcolor = event.target.classList[1];

        if (event.target.classList.contains("active-class")) {
            event.target.classList.remove("active-class");
            para.style.background = "#d2d2d3";
            //display all tickets
            ticket.innerHTML = "";
            let alltickets = JSON.parse(localStorage.getItem("alltickets"));
            for (let i = 0; i < alltickets.length; i++) {
                appendtoUI(alltickets[i]);
            }
            return;
        }

        if (document.querySelector(".active-class")) {
            //remove prev classs tickets
            document.querySelector(".active-class").classList.remove("active-class");
        }
        //upload my color tickets
        ticket.innerHTML = "";
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        let filteredarr = alltickets.filter(obj => {
            return obj.T_filter == clickedcolor;
        })
        console.log(filteredarr);
        for (let i = 0; i < filteredarr.length; i++) {
            appendtoUI(filteredarr[i]);
        }
        event.target.classList.add("active-class");
        para.style.background = ColorCode[clickedcolor];
    })
}

opentab.addEventListener("click", function (e) {

    //1. Add modal on +
    if (document.querySelector(".modal")) {
        return;
    }
    let modaldiv = document.createElement("div");
    //<div></div>
    modaldiv.classList.add("modal");
    modaldiv.innerHTML = `<div class="modal-text" contenteditable="true" spellcheck="false" data-typed="false">Enter your Text here !!</div>
    <div class="modal-filter-options">
        <div class="modal-filter blue active-class"></div>
        <div class="modal-filter yellow"></div>
        <div class="modal-filter green"></div>
        <div class="modal-filter black"></div>
    </div>`;

    //2.remove Enter your text
    let textclick = modaldiv.querySelector(".modal-text");
    // // if click then remove
    textclick.addEventListener("click", function (e) {
        if (e.target.getAttribute("data-typed") == "false") {
            e.target.textContent = "";
            e.target.setAttribute("data-typed", "true");
        }
    })
    // // if a keypress then also remove
    textclick.addEventListener("keypress", function (e) {
        if (e.key == "Enter") {
            let text = e.target.textContent;
            appendModal(text);

        }
        if (e.target.getAttribute("data-typed") == "false") {
            e.target.textContent = "";
            e.target.setAttribute("data-typed", "true");
        }
    })

    // //3. Change the active class therfore update activemodalfilter
    let modalfilters = modaldiv.querySelector(".modal-filter-options");
    modalfilters.addEventListener("click", function (e) {
        // already on active class
        if (e.target.classList.contains("active-class") || e.target.classList.contains("modal-filter-options")) {
            return;
        }
        // new active class
        // // remove current active
        let itemtoremove = document.querySelector(".modal-filter.active-class");
        itemtoremove.classList.remove("active-class");
        // // add active class to clicked element
        e.target.classList.add("active-class");
        activemodalfilter = e.target.classList[1];

    })
    ticket.append(modaldiv);
})

// ADD TICKET TO UI WHEN ENTER IS PRESSED
function appendModal(text) {
    if (text.length == 0) {
        alert("Please Enter A Note!");
        return;
    }
    let ID = uid();
    let ticketdiv = document.createElement("div");
    ticketdiv.classList.add("ticket");

    ticketdiv.innerHTML =
        `<div id=${ID} class="ticket-filter ${activemodalfilter}"></div>
            <div class="ticket-body">
                <div class="ticket-id">
                    #${ID}
                    <div>
                    <i class="fas fa-minus-circle" id=${ID}></i>
                    </div>
                </div>
                <div class="ticket-text">
                ${text}
                </div>
            </div>`;

    ticketdiv.querySelector(".ticket-filter").addEventListener("click", function (e) {
        console.log(e);
        let arr = ["blue", "yellow", "green", "black"];
        let curclass = e.target.classList[1];
        let idx = arr.indexOf(curclass);
        idx = (idx + 1) % 4;
        e.target.classList.remove(curclass);
        e.target.classList.add(arr[idx]);

        // whenever filter is toggled update it in local strg
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        for (let i = 0; i < alltickets.length; i++) {
            if (alltickets[i].T_ID == e.target.id) {
                alltickets[i].T_filter = arr[idx];
                break;
            }
        }
        localStorage.setItem("alltickets", JSON.stringify(alltickets));
    })
    let trash=ticketdiv.querySelector(".ticket-id>div");
    trash.addEventListener("click",(e)=>{
        let id=e.target.id;
        //UI
        ticketdiv.remove();   
        // DB
        let alltickets = JSON.parse(localStorage.getItem("alltickets"));
        let arr=alltickets.filter((obj)=>{
            return obj.T_ID!=id;
        })
        localStorage.setItem("alltickets", JSON.stringify(arr)); 
    })
    ticket.append(ticketdiv);
    closemodal();
    // add it to local storage
    let obj = { "T_ID": ID, "T_Text": text, "T_filter": activemodalfilter };
    let curstrg = JSON.parse(localStorage.getItem("alltickets"));
    curstrg.push(obj);
    localStorage.setItem("alltickets", JSON.stringify(curstrg));
}

closetab.addEventListener("click", closemodal)
function closemodal(e) {
    if (document.querySelector(".modal")) {
        document.querySelector(".modal").remove();
    }
}

document.querySelector(".close-cross").addEventListener("click",(e)=>{
    ticket.innerHTML="";
    localStorage.setItem("alltickets",JSON.stringify([]));
})

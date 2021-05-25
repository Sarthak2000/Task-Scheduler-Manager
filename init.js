//local storage is handled here !!!

function INITusingLocal() {
    let alltickets = localStorage.getItem("alltickets");
    if (alltickets) {
        //append it to UI
        alltickets = JSON.parse(localStorage.getItem("alltickets"));
        for (let i = 0; i < alltickets.length; i++) {
            appendtoUI(alltickets[i]);
        }
    } else {
        //initialise an empty array
        localStorage.setItem("alltickets", JSON.stringify([]));
    }
}
INITusingLocal();

function appendtoUI(TicketObj) { //clones a ticket from local storage
    // extract information from local
    // create
    let ticketdiv = document.createElement("div");
    ticketdiv.classList.add("ticket");

    ticketdiv.innerHTML =
        `<div id="${TicketObj.T_ID}"class="ticket-filter ${TicketObj.T_filter}"></div>
             <div class="ticket-body">
                <div class="ticket-id">
                #${TicketObj.T_ID}
                <div>
                <i class="fas fa-minus-circle" id=${TicketObj.T_ID}></i>
                </div>
                </div>
                <div class="ticket-text">
                ${TicketObj.T_Text}
                </div>
            </div>`;

    // append to UI
    document.querySelector(".ticket-content").append(ticketdiv);

    // when refreshed all my listners on these tickets wd go as i am explicity showing them on UI
    //therefore add listners again 
    ticketdiv.querySelector(".ticket-filter").addEventListener("click",function(e){
        let arr=["blue","yellow","green","black"];
        let curclass=e.target.classList[1];
        let idx=arr.indexOf(curclass);
        idx=(idx+1)%4;
        e.target.classList.remove(curclass);
        e.target.classList.add(arr[idx]);
        
        // whenever filter is toggled update it in local strg
        let alltickets=JSON.parse(localStorage.getItem("alltickets"));
        for(let i=0;i<alltickets.length;i++){
            if(alltickets[i].T_ID==e.target.id){
                alltickets[i].T_filter=arr[idx];
                break;
            }
        }
        localStorage.setItem("alltickets",JSON.stringify(alltickets));
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
}


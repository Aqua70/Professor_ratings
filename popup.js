let messageExists = false
let currentMessage = undefined


const createMessage = (response) =>{
    messageExists = true
    currentMessage = document.createElement("p")
    document.body.appendChild(currentMessage)
    currentMessage.textContent = response.message
    if (response.success === 2){
        currentMessage.className = "success"
    }
    else if (response.success === 1){
        currentMessage.className = "notification"
    }
    else{
        currentMessage.className = "error"
    }
}

const triggerDisplay = () =>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {display : true}, (response) => {
            if (chrome.runtime.lastError){
                response = {success : 0, message : "An error has occured"}
            }
            if (messageExists)
                document.body.removeChild(currentMessage)

            createMessage(response)
            
        });
    });
}




const button = document.getElementById("button")

button.addEventListener('click', triggerDisplay)


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


const download = () =>{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const inputElement = document.getElementById("name-input")
        chrome.tabs.sendMessage(tabs[0].id, {download : true, name : inputElement.value}, (response) => {
            if (chrome.runtime.lastError){
                response = {success : 0, message : "Go to a BBC video and wait until the BBC video has loaded"}
            }
            if (messageExists)
                document.body.removeChild(currentMessage)

            createMessage(response)
            
        });
    });
}




const button = document.getElementById("button")

button.addEventListener('click', download)


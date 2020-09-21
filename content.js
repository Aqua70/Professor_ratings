
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  const element = document.getElementById("playback-video-playback-video_html5_api")
  if (!element){
      sendResponse({success: 0, message : "Go to a BBC video and wait until the BBC video has loaded"})
      return false;
  }
  if (!request.download){
      sendResponse({success: 0, message : "Invalid request format"});
      return false;
  }

  if (!request.name || request.name === ""){
      sendResponse({success : 0, message : "Please enter a file name"})
      return false;
  }


  const src = element.getAttribute("src")

  
  download(src, request.name)
  sendResponse({success: 2, message : "Downloading..."})
  return true;

  
});

chrome.runtime.sendMessage({jsonData : "GET"}, function(data){
  var jsonDataTest = data.json;
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var json = JSON.parse(jsonDataTest.substring(5, jsonDataTest.length - 1))['response']['docs'];
  var url = null;
  var previous = null;
  var observer = new MutationObserver(function mutationFound(mutations, observer) {
    url =  window.location.href;
    if (/https:\/\/acorn.utoronto.ca\/sws\/#\/courses\//.test(url) && url != previous) {
      previous = url
      acornProffesorRatings(json)
    }
    else if (/https:\/\/timetable.iit.artsci.utoronto.ca/.test(url)){
      previous = url
      timetableProffesorRatings(json)
    }

  });
  observer.observe(document, {
    subtree: true,
    attributes: true
    //...
  });
});


function timetableProffesorRatings(teacherJSON){
  var profs = document.querySelectorAll(".colInst")
  profs.forEach((profElement) =>{
    profElement = profElement.childNodes[1].childNodes[1]
    if (!profElement){
      return
    }
    var profName = profElement.innerText
    var firstNameFirstLetter = profName.substring(profName.indexOf(', ') + 2, profName.length - 1)
    var lastName = profName.substring(0, profName.indexOf(', ')).replace(/ /, "-")
    teacherJSON.forEach((teacher) =>{
      console.log(teacher['teacherfirstname_t'], teacher['teacherlastname_t'], teacher['teacherfirstname_t'].startsWith(firstNameFirstLetter), teacher['teacherlastname_t'] === lastName);
      if (teacher['teacherfirstname_t'].startsWith(firstNameFirstLetter) && teacher['teacherlastname_t'] === lastName){
        console.log(teacher['averageratingscore_rf']);
      }
    })
    console.log(firstNameFirstLetter, lastName);
  })
}


function acornProffesorRatings(teacherJSON){
  setTimeout(()=>{
    createRatingColoumn();
    var profs = document.querySelectorAll(".instructorDetails");
    for (var i = 0; i < profs.length; i++){
      var prof = profs[i];
      if (prof.tagName == "DIV"){

        var name = prof.innerText;
        if (name == "TBA"){
          continue;
        }
        var first_name = name.substring(0, name.indexOf(' '));
        var last_name = name.substring(name.indexOf(' ') + 1).replace(/ /, "-");
        var prof_object = null;
        var rating = "N/A";
        for (var j = 0; j < teacherJSON.length; j++){
          if (teacherJSON[j]['teacherfirstname_t'] == first_name && (teacherJSON[j]['teacherlastname_t'] == last_name || teacherJSON[j]['teacherlastname_t'] == last_name)){
            prof_object = teacherJSON[j];
            rating = prof_object['averageratingscore_rf'] !== undefined ? prof_object['averageratingscore_rf'] : "N/A";
            break;
          }
        }
        if (rating != "N/A"){
          createRatingBox(prof.parentNode.parentNode.parentNode.parentNode, `${rating.toFixed(1)}/5.0`);
        }
        else{
          createRatingBox(prof.parentNode.parentNode, "N/A");
        }

      }
    }
  }, 500);
}



function createRatingBox(parent, text){
  var rating_box = document.createElement('td');
  rating_box.innerText = text;
  rating_box.className = "instructor";
  parent.appendChild(rating_box);
}

function createRatingColoumn(){
  var courseBox = document.querySelectorAll(".courseBox");
  //TODO: make coloumn "extension" to add info about the extension's results.
}


const getRating = function(firstName, lastName){

};

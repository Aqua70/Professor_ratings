chrome.runtime.sendMessage({jsonData : "GET"}, function(data){
  var jsonDataTest = data.json;
  // MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var json = JSON.parse(jsonDataTest.substring(5, jsonDataTest.length - 1))['response']['docs'];
  var previous = null;
  // var observer = new MutationObserver(function mutationFound(mutations, observer) {
  //   url =  window.location.href;
  //   if (/https:\/\/acorn.utoronto.ca\/sws\/#\/courses\//.test(url) && url != previous) {
  //     previous = url
  //     acornProffesorRatings(json)
  //   }
  //   else if (/https:\/\/timetable.iit.artsci.utoronto.ca/.test(url)){
  //     previous = url
  //     timetableProffesorRatings(json)
  //   }

  // });
  // observer.observe(document, {
  //   subtree: true,
  //   attributes: true
  //   //...
  // });
  chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  
    var url =  window.location.href;
    if (/https:\/\/acorn.utoronto.ca\/sws\/#\/courses\//.test(url) && url != previous) {
      previous = url
      acornProffesorRatings(json)
    }
    else if (/https:\/\/timetable.iit.artsci.utoronto.ca/.test(url)){
      previous = url
      timetableProffesorRatings(json)
    }
    sendResponse({success: 2, message : "DONE..."})
    return true;
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
      if (teacher['teacherfirstname_t'].startsWith(firstNameFirstLetter) && teacher['teacherlastname_t'] === lastName){
        
      }
    })
    console.log(firstNameFirstLetter, lastName);
  })
}


function acornProffesorRatings(teacherJSON){
    var profs = document.querySelectorAll(".instructorDetails");
    createRatingColoumnsAcorn();
    for (var i = 0; i < profs.length; i++){
      var prof = profs[i];
      if (prof.tagName == "DIV"){

        var name = prof.innerText;

        var firstName = name.substring(0, name.indexOf(' '));
        var lastName= name.substring(name.indexOf(' ') + 1).replace(/ /, "-");
        var prof_object = getProfObject(teacherJSON, firstName, lastName);
        var rating = prof_object.rating;

        var ratingNode = prof.parentNode.parentNode
        if (rating != "N/A"){
          createRatingBox(ratingNode, `${rating.toFixed(1)}/5.0`);
        }
        else{
          createRatingBox(ratingNode, "\tN/A");
        }

      }
    }
}

function createRatingBox(parent, text){
  var rating_box = document.createElement('td');
  rating_box.innerText = text;
  rating_box.className = "instructor";
  parent.insertBefore(rating_box, parent.childNodes[9]);
}

function createRatingColoumnsAcorn(){
  var tables = document.querySelectorAll(".header")
  tables.forEach((table) =>{
    var tr = table.childNodes[1]
    var coloumn = document.createElement('th')
    coloumn.scope = "col"
    coloumn.class = 'rating'
    coloumn.className = "instructorDetails"
    coloumn.textContent = "Rating"
    console.log(tr.childNodes);
    tr.insertBefore(coloumn, tr.childNodes[8])
  })

}

const getProfObject = function(teacherJSON, firstName, lastName){
  for (var j = 0; j < teacherJSON.length; j++){
    if (teacherJSON[j]['teacherfirstname_t'] == firstName && teacherJSON[j]['teacherlastname_t'] == lastName){
      prof_object = teacherJSON[j];
      if (prof_object['averageratingscore_rf'] === undefined){
        return {rating : "N/A"}
      }
      return {rating : prof_object['averageratingscore_rf']};
    }
  }
  return {rating : "N/A"}
};

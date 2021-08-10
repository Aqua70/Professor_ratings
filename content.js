chrome.runtime.sendMessage({jsonData : "GET"}, function(data){
  var jsonDataTest = data.json;

  var json = JSON.parse(jsonDataTest.substring(5, jsonDataTest.length - 1))['response']['docs'];
  var previous = null;
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
    sendResponse({success: 2, message : "Ratings have been inserted"})
    return true;
  });
});


function timetableProffesorRatings(teacherJSON){
  var profs = document.querySelectorAll(".colInst") 
  createRatingColoumnsTimetable();
  profs.forEach((profElement) =>{
    if (!profElement.childNodes[1].childNodes[1]){
      createRatingBoxTimetable(profElement.parentNode, "\tN/A");
      return
    }
    profElement = profElement.childNodes[1].childNodes[1]
    var profName = profElement.innerText
    var firstNameFirstLetter = profName.substring(profName.indexOf(', ') + 2, profName.length - 1)
    var lastName = profName.substring(0, profName.indexOf(', ')).replace(/ /, "-")
    const prof_object = getProfObject(teacherJSON, firstNameFirstLetter, lastName)
    const rating = prof_object.rating;
    var ratingNode = profElement.parentNode.parentNode.parentNode
    
    if (rating != "N/A"){
      createRatingBoxTimetable(ratingNode, `${rating.toFixed(1)}/5.0`);
    }
    else{
      createRatingBoxTimetable(ratingNode, "\tN/A");
    }

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
        var lastName= name.substring(name.lastIndexOf(' ') + 1).replace(/ /, "-");
        var prof_object = getProfObject(teacherJSON, firstName, lastName);
        var rating = prof_object.rating;

        var ratingNode = prof.parentNode.parentNode
        if (rating != "N/A"){
          createRatingBoxAcorn(ratingNode, `${rating.toFixed(1)}/5.0`);
        }
        else{
          createRatingBoxAcorn(ratingNode, "\tN/A");
        }

      }
    }
}

function createRatingBoxAcorn(parent, text){
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
    tr.insertBefore(coloumn, tr.childNodes[8])
  })

}

function createRatingBoxTimetable(parent, text){
  var rating_box = document.createElement('td');
  rating_box.innerText = text;
  rating_box.className = "colAvail";
  parent.insertBefore(rating_box, parent.childNodes[9]);
}

function createRatingColoumnsTimetable(){
  var tables = document.querySelectorAll(".perMeeting")
  tables.forEach((table) =>{
    // console.log(table.childNodes[1].childNodes[1].className)
    // if(table.childNodes[1].childNodes[1].className === "w100 secTut"){
    //   return
    // }
    var tr = table.childNodes[1].childNodes[1].childNodes[2].childNodes[1]
    var coloumn = document.createElement('th')
    coloumn.scope = "col"
    coloumn.class = 'rating'
    coloumn.className = "headerSect colSectionAva"
    coloumn.textContent = "Rating"
    tr.insertBefore(coloumn, tr.childNodes[8])
  })

}


const getProfObject = function(teacherJSON, firstName, lastName){
  for (var j = 0; j < teacherJSON.length; j++){
    if (teacherJSON[j]['teacherfirstname_t'].startsWith(firstName) && teacherJSON[j]['teacherlastname_t'] == lastName){
      prof_object = teacherJSON[j];
      if (prof_object['averageratingscore_rf'] === undefined){
        return {rating : "N/A"}
      }
      return {rating : prof_object['averageratingscore_rf']};
    }
  }
  return {rating : "N/A"}
};

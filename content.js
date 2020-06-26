
// const data = chrome.runtime.getURL("profData.json");

chrome.runtime.sendMessage({jsonData : "GET"}, function(data){
  var jsonDataTest = data.json;
  MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  var json = JSON.parse(jsonDataTest.substring(5, jsonDataTest.length - 1))['response']['docs'];
  var url = null;
  var previous = null;
  var observer = new MutationObserver(mutationFound);
  observer.observe(document, {
    subtree: true,
    attributes: true
    //...
  });
});

function mutationFound(mutations, observer) {
  url =  window.location.href;
  if (/https:\/\/acorn.utoronto.ca\/sws\/#\/courses\//.test(url) && url != previous) {
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
          var last_name = name.substring(name.indexOf(' ') + 1);
          var prof_object = null;
          var rating = "N/A";
          for (var j = 0; j < json.length; j++){
            if (json[j]['teacherfirstname_t'] == first_name && json[j]['teacherlastname_t'] == last_name){
              prof_object = json[j];
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
    previous = url;
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

// fetch(data).then((response) => response.json()).then((json) =>{
//   MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//   json = json['response']['docs'];
//   var url = null;
//   var previous = null;
//   var observer = new MutationObserver(function(mutations, observer) {
//     url =  window.location.href;
//     if (/https:\/\/acorn.utoronto.ca\/sws\/#\/courses\//.test(url) && url != previous) {
//       setTimeout(()=>{
//         createRatingColoumn();
//         var profs = document.querySelectorAll(".instructorDetails");
//         for (var i = 0; i < profs.length; i++){
//           var prof = profs[i];
//           if (prof.tagName == "DIV"){
//             var name = prof.innerText;
//             if (name == "TBA"){
//               continue;
//             }
//             var first_name = name.substring(0, name.indexOf(' '));
//             var last_name = name.substring(name.indexOf(' ') + 1);
//             var prof_object = null;
//             var rating = "N/A";
//             for (var j = 0; j < json.length; j++){
//               if (json[j]['teacherfirstname_t'] == first_name && json[j]['teacherlastname_t'] == last_name){
//                 prof_object = json[j];
//                 rating = prof_object['averageratingscore_rf'] !== undefined ? prof_object['averageratingscore_rf'] : "N/A";
//                 break;
//               }
//             }
//             if (rating != "N/A"){
//               createRatingBox(prof.parentNode.parentNode.parentNode.parentNode, `${rating.toFixed(1)}/5.0`);
//             }
//             else{
//               createRatingBox(prof.parentNode.parentNode, "N/A");
//             }
//
//             }
//           }
//         }, 500);
//       }
//       previous = url;
//   });
//   observer.observe(document, {
//     subtree: true,
//     attributes: true
//     //...
//   });
// });

const getRating = function(){

};

function callback() {
    if(xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            result = xhr.responseText;
            chrome.runtime.onMessage.addListener(
              function(request, sender, sendResponse) {
                console.log(sender.tab ?
                            "from a content script:" + sender.tab.url :
                            "from the extension");
                if (request.jsonData == "GET"){
                  sendResponse({json: result});
                }
            });
        }
    }
};



var xhr = new XMLHttpRequest();
xhr.open("GET", "https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=4000&wt=json&json.wrf=noCB&callback=noCB&q=*%3A*+AND+schoolid_s%3A1484&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=20&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s&fq=", true);
xhr.onreadystatechange = callback;
xhr.send();

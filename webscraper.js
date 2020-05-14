function plus(s){
    ans = ""
    for (var i = 0; i < s.length; i++){
        if (s[i] == ' '){
            ans += '+'
        }
        else{
            ans += s[i]
        }
    }
    return ans
}

function get_professors(callback){
  request("https://www.ratemyprofessors.com/search.jsp?queryoption=TEACHER&queryBy=schoolDetails&schoolID=1484&schoolName=University+of+Toronto+-+St.+George+Campus&dept=select", (error, response, html) =>{
      if (!error && response.statusCode == 200){
        const $ = cheerio.load(html);
        const clicker = $(".content")[1];
        while (True){
          clicker.click();
        }
        console.log(clicker);
        request("https://www.ratemyprofessors.com/search.jsp?queryoption=HEADER&queryBy=teacherName&schoolName=University+of+Toronto+-+St.+George+Campus&schoolID=1484&query=" + plus(prof_name), (error, response, html) =>{
            if (!error && response.statusCode == 200){
                const $ = cheerio.load(html);
                const link = $("a")[46].attribs.href;
                if (!link.includes("/ShowRatings")){
                    callback(null);
                    return;
                }
                request("https://www.ratemyprofessors.com" + link, (error, response, html) =>{
                    if (!error && response.statusCode == 200){
                        const $ = cheerio.load(html);
                        rating = $(".RatingValue__Numerator-qw8sqy-2").text();
                        callback(rating);
                    }
                    else
                    {
                        callback(null);
                        return;
                    }
                });
            }
            else{
                callback(null);
                return;
            }});
      }
      else{
        callback(null);
      }
  });

}

get_professor(() => {});

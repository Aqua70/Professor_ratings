import requests
from bs4 import BeautifulSoup
import json


def getData():
    with requests.Session() as s:
        soup = BeautifulSoup(s.get("https://solr-aws-elb-production.ratemyprofessors.com//solr/rmp/select/?solrformat=true&rows=4000&wt=json&json.wrf=noCB&callback=noCB&q=*%3A*+AND+schoolid_s%3A1484&defType=edismax&qf=teacherfirstname_t%5E2000+teacherlastname_t%5E2000+teacherfullname_t%5E2000+autosuggest&bf=pow(total_number_of_ratings_i%2C2.1)&sort=total_number_of_ratings_i+desc&siteName=rmp&rows=20&start=0&fl=pk_id+teacherfirstname_t+teacherlastname_t+total_number_of_ratings_i+averageratingscore_rf+schoolid_s&fq=").content, "html.parser")
        json_data = json.dumps(soup.text)
        json_object = json.loads(json_data)
        file = open("profData.json", "w")
        file.write(json_object)
        file.close()

def readData(prof_first, prof_last):
    data = json.load(open("profData.json"))
    teachers_info = data['response']["docs"]
    for teacher_info in teachers_info:
        if teacher_info['teacherfirstname_t'] == prof_first and teacher_info['teacherlastname_t'] == prof_last:
            print(teacher_info)
            break   

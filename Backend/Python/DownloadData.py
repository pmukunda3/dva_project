# -*- coding: utf-8 -*-
from __future__ import print_function
import errno
import spacy
# from spacy import displacy
from spacy.lang.en.stop_words import STOP_WORDS
from collections import Counter
import en_core_web_sm
nlp = en_core_web_sm.load(disable=['parser', 'tagger', 'textcat'])
import pprint
pp = pprint.PrettyPrinter(depth=6)

import codecs
import os
import urllib, json


# start_year = 1978
# end_year = 2017
start_year = 2018
end_year = 2018

start_month = 5
end_month = 9

for year in range(start_year,end_year+1):
    for month in range(start_month,end_month+1):
        filename = "D:\\Gatech\\DVA\\News\\Data\\Input\\{}_{}.tsv".format(year,month)
        url = "http://api.nytimes.com/svc/archive/v1/{}/{}.json?api-key=7ca882d86b844dfe852cb55040cbb0a7".format(year,month)
        response = urllib.urlopen(url)
        data = json.loads(response.read().encode('utf-8'))
        print("\n")
        print("year - {}, month - {}".format(year,month))
        print("\n")

        if not os.path.exists(os.path.dirname(filename)):
            try:
                os.makedirs(os.path.dirname(filename))
            except OSError as exc: # Guard against race condition
                if exc.errno != errno.EEXIST:
                    raise
        if "response" not in data or data['response'] == None:
            print(filename)
            break
        with codecs.open(filename, "w", "utf-8") as newsfile:
            i = 0
            for article in data['response']['docs']:
                if '_id' in article and article['_id'] != None:
                    id = article['_id']
                else:
                    id = ""

                if "pub_date" in article and article['pub_date'] != None:
                    pub_date = article['pub_date']
                else:
                    pub_date = ""

                if 'headline' in article and article['headline'] != None:
                    if 'main' in article['headline'] and article['headline']['main'] != None:
                        headline = article['headline']['main']
                    else:
                        headline = unicode("", "utf-8")
                else:
                    headline = unicode("", "utf-8")


                if 'snippet' in article and article['snippet'] != None:
                    snippet = article['snippet']
                else:
                    snippet = unicode("", "utf-8")

                if 'multimedia' in article and len(article['multimedia']) != 0:
                    if 'url' in article['multimedia'][0]:
                        image = "https://www.nytimes.com/" + article['multimedia'][0]['url']
                    else:
                        image = ""
                else:
                    image = ""

                if 'web_url' in article and article['web_url'] != None:
                    web_url = article['web_url']
                else:
                    web_url = ""





                if 'keywords' in article and article['keywords'] != None:
                    keywords = list(map(lambda x: x['value'],article['keywords']))
                else:
                    keywords = ""

            #     if "saudi" in snippet.lower():
            #         print(id + " ---- " +snippet)
            #         doc = nlp(snippet)
            #         pp.pprint([(X.text, X.label_) for X in doc.ents])
            #         print(keywords)
            #         print('-'*10)

                word_list = []
                doc = nlp(snippet)
                [word_list.append(X.text) for X in doc.ents]
                doc = nlp(headline)
                [word_list.append(X.text) for X in doc.ents]
            #     [word_list.append(x.lower()) for x in keywords]

                for word in word_list:
                    clean_headline = headline.replace(word,word.replace(" ","~"))
                    clean_snippet = snippet.replace(word,word.replace(" ","~"))

                grouped_keywords = list(map(lambda x: x.replace(" ","~"),keywords))

                doc_keywords = ""
                doc_keywords += clean_headline
                doc_keywords += " "
                doc_keywords += clean_snippet
                doc_keywords += " "
                doc_keywords += " ".join(grouped_keywords)
                doc_keywords = doc_keywords.replace(",","")
                doc_keywords = doc_keywords.replace(";","")
                doc_keywords = doc_keywords.replace(":","")
                doc_keywords = doc_keywords.replace(".","")
                doc_keywords = doc_keywords.replace('"',"")
                doc_keywords = doc_keywords.replace("-","")
                doc_keywords = doc_keywords.replace("(","")
                doc_keywords = doc_keywords.replace(")","")
                doc_keywords = doc_keywords.replace("'s".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("”".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("“".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("'".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("?","")
                doc_keywords = doc_keywords.replace("’s".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("’ll".decode('utf-8'),"")
                doc_keywords = doc_keywords.replace("’".decode('utf-8'),"")

                STOP_WORDS.add("dont")
                STOP_WORDS.add("and")
            #     STOP_WORDS.add("your")
            #     STOP_WORDS.add("how")
            #     STOP_WORDS.add("which")
            #     STOP_WORDS.add("what")
            #     STOP_WORDS.add("when")
            #     STOP_WORDS.add("where")
            #     STOP_WORDS.add("why")


                cleaned_keywords_list = []
                for word in doc_keywords.split(" "):
                    if word.lower() not in STOP_WORDS:
                        cleaned_keywords_list.append(word.lower())


                cleaned_keywords = " ".join(cleaned_keywords_list)
                if headline != "":
                    newsfile.write((id
                          +"\t"+
                          pub_date
                          +"\t"+
                          "'"+headline+"'"
                          +"\t"+
                          "'"+snippet+"'"
                          +"\t"+
                          web_url
                          +"\t"+
                          image
                          +"\t"+
                          cleaned_keywords).replace("\n"," "))
                    newsfile.write("\n")

                if i%1000 == 0:
                    print("{}-{}-processed articles = ".format(year,month) + str(i))
                i+=1
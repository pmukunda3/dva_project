from glob import glob
import unicodecsv
import time
from collections import Counter
import json
import redis


def process_file(filenames,keyword_set):
    monthly_details = {}
    for file in filenames:
        print file
        with open(file) as csv_file:
            csv_reader = unicodecsv.reader(csv_file, delimiter='\t')
            csv_reader.next()
            for row in csv_reader:
                token = row[7]
                if token in keyword_set:
                    if token not in monthly_details:
                        monthly_details[token] = {}
                    monthly_details[token][row[0]] = {
                        "id" : row[0],
                        "date" : row[1],
                        "headlines" : row[2],
                        "snippet" : row[3],
                        "web_url" : row[4],
                        "image_url" : row[5],
                    }
    return monthly_details





if __name__ == "__main__":
    dir_path = "D:\Gatech\DVA\News\Data\Output\\"
    folders = glob(dir_path+'*/')
    months = set(map(lambda x: x.split("\\")[-2].split("_")[0],folders))

    year_file_list = map(lambda x: (x,glob(dir_path+x+"*"+"\\*.csv")),months)

    redis_host = "127.0.0.1"
    redis_port = 6379
    redis_password = ""
    db = 2
    r = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True,db=db)

    for filelist in year_file_list:
        year = filelist[0]
        redis_key = "counts_year:"+year
        print redis_key
        keywords = json.loads(r.get(redis_key))
        keyword_set = set()
        [keyword_set.add(x["keyword"].replace(" ","~").lower()) for x in keywords]
        monthly_details = process_file(filelist[1],keyword_set)
        print("Processed Year : {}".format(filelist[0]))
        print("Saving Year : {} to Redis".format(filelist[0]))
        for keyword in keyword_set:
            redis_key = "get_ids:"+year+":"+keyword
            values = list(monthly_details[keyword].values())
            r.set(redis_key,json.dumps(values))

    print "Finished Processing files"
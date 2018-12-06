from glob import glob
import unicodecsv
import time
from collections import Counter
import json
import redis



def save_keywords(folder_path):
    cnt = 20
    year_keyword_list = {}
    final_list = {}
    paths = glob(folder_path+'*/')
    start = time.time()
    for path in paths:
        year_month = path.split("\\")[-2]
        year = year_month.split("_")[0]

        files = glob(path+'*.csv')

        for file in files:
            print file
            with open(file) as csv_file:
                csv_reader = unicodecsv.reader(csv_file, delimiter='\t')
                csv_reader.next()
                for row in csv_reader:
                    if year not in year_keyword_list:
                        year_keyword_list[year] = []
                    # if row[12] != "" and int(row[12]) > 30:
                    if row[12] != "" and int(row[12]) > 10 or "~" in row[7]:
                        year_keyword_list[year].append(row[7])
        print time.time()-start
    for key in year_keyword_list.keys():
        final_list[key] = []
        values = Counter(year_keyword_list[key]).most_common(cnt)
        for value in values:
            final_list[key].append({'keyword': " ".join(list(map(lambda x: x.capitalize(), value[0].split("~")))), 'count': value[1]})

    redis_host = "127.0.0.1"
    redis_port = 6379
    redis_password = ""
    db = 2

    r = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True,db=db)

    for key in final_list.keys():
        r.set("counts_year:"+key,json.dumps(final_list[key]))

    print "Finished Processing files"












if __name__ == "__main__":
    folder_path = "D:\\Gatech\\DVA\\News\\Data\\Output\\"
    save_keywords(folder_path)
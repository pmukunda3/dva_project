import pandas as pd
from collections import defaultdict
import glob
import redis
import json
fnames = glob.glob("D:/Gatech/DVA/News/Data/Output/2016_1/*.csv")
for fname in fnames:
    print fname
ans = defaultdict(dict)
for val in fnames:
    df = pd.read_csv(val,sep='\t')
    for i in range(0,df.shape[0]):
        if df.iloc[i,:]['token'] in ans[df.iloc[i,:]['date'][0:4]].keys():
            ans[df.iloc[i,:]['date'][0:4]][df.iloc[i,:]['token']] = ans[df.iloc[i,:]['date'][0:4]][df.iloc[i,:]['token']] + 1
        else:
            if '~' in str(df.iloc[i,:]['token']):
                ans[df.iloc[i, :]['date'][0:4]][df.iloc[i, :]['token']] = 1

n = 10
years = ans.keys()
ans1 = defaultdict(list)
for val1 in years:
    for i in range(0,n):
        maxc = -1
        for val in ans[val1].keys():
            if ans[val1][val] > maxc:
                curr_keyword = val
                maxc = ans[val1][val]
        ans1[val1].append({'keyword':" ".join(list(map(lambda x: x.capitalize(), curr_keyword.split("~")))), 'count':maxc})
        ans[val1][curr_keyword] = -2

'''for val in ans1.keys():
    print("Trending topics for year {}".format(val))
    for i in range(0,len(ans1[val])):
        print(ans1[val][i])'''

redis_host = "136.59.239.39"
redis_port = 8099
redis_password = "DVA_NEWS_PASSWORD@@1"

r = redis.StrictRedis(host=redis_host, port=redis_port, password=redis_password, decode_responses=True)

for val in ans1.keys():
    r.set(str("counts_year:"+val),json.dumps(ans1[val]))

values = r.get("2016")
print(values)


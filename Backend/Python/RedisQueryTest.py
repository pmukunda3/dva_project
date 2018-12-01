import redis
import pprint
import json

r = redis.StrictRedis(
    host='136.59.239.39',
    port=8099,
    password='DVA_NEWS_PASSWORD@@1',
    db=5,
    decode_responses=True)

keys = ["counts_month:1969:6", "counts_month:1969:4", "counts_month:1969:7"]
data = r.mget(keys)
final_result = zip(keys, data)
for item in final_result:
    if item[1] is not None:
        key = item[0]
        result = json.loads(item[1])
        print(key)
        print("-" * 30)
        for key_value in result:
            print key_value["keyword"] + " -- " + str(key_value["count"])
        print("*" * 30)

key = "counts_month:2016:8"
data = r.get(key)
print(json.loads(data))
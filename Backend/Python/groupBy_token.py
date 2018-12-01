import unicodecsv as csv
import sys
pwd = sys.path[0]
import os
import pandas as pd
import json
import redis
from glob import glob



def process_file(folder_name,year,month):
	# dir = "Test"
	# dir_path = pwd + '..\\Data\\' + dir
	dir_path = folder_name
	files = os.listdir(dir_path)


	df_in = pd.DataFrame(columns = ['id','token','date','headline','snippet','web_url','image_url'])

	files = filter(lambda x: ".crc" not in x and ".csv" in x, files)
	n = len(files)
	i = 1

	print "*"*30
	for filename in files:
		file_path = dir_path + '/' + filename
		with open(file_path,'rb') as file:
			print("Loading file %d of %d into DataFrame"%(i,n))
			i += 1
			temp = pd.read_csv(file,sep='\t')
			df_in = pd.concat([df_in,temp])

	print("Selecting 'token'")
	df_left = df_in['token']
	print("Applying transform")
	temp_str = df_left.tolist()
	temp_str = list(map(lambda x: "%s:%s:%s"%(year,month,x),temp_str))
	df_left = pd.DataFrame(temp_str).rename(columns={0:'key'})

	print("Selecting rest of fields")
	df_right = pd.DataFrame(df_in[['id','date','headline','snippet','web_url','image_url']])
	print("Converting rows to dicts")
	temp_dict = df_right.to_dict(orient='records')
	print("Converting dicts to json strings")
	temp_str = list(map(lambda x: json.dumps(x),temp_dict))
	print("Combining json strings into new DataFrame")
	df_right = pd.DataFrame(temp_str).rename(columns={0:'value'})
	print("Performing join")
	df_temp = df_left.join(df_right)
	print("Performing groupby")
	groupBy = df_temp.groupby('key')['value']
	print("Performing apply list")
	df_out = groupBy.apply(list).reset_index()


	# r = redis.StrictRedis(
		# host='localhost',
		# port=6379,
		# password='',
		# decode_responses=True)

	r = redis.StrictRedis(
		host='136.59.239.39',
		port=8099,
		password='DVA_NEWS_PASSWORD@@1',
		decode_responses=True)

	print("Uploading to redis server")
	for row in df_out.itertuples():
		# pass
		r.set("get_ids:"+row[1],json.dumps(row[2]))


if __name__ == "__main__":
	dir_path = "D:\Gatech\DVA\News\Data\Output\\"
	folders = glob(dir_path+'*/')
	months = map(lambda x: (x.split("\\")[-2],x),folders)

	for month in months:
		process_file(month[1],month[0].split("_")[0],month[0].split("_")[1])





#
# value = r.get("get_ids:2016:10:trump")
# print(value)
# filename2 = "groupBy_output.tsv"
# file_path = dir_path + '/' + filename2


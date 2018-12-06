DESCRIPTION:
This package contains scripts to fetch the dataset, code to process the data, scripts for uploading the data to a Redis database instance, and code for setting up the web server and rendering the interactive visualization.
1. Fetching the dataset:
The New York Times dataset contains over 100 years of news articles and can be accessed by using the Archive API of New York Times (https://developer.nytimes.com/archive_api.json).  The python script sends one HTTP request for each month to fetch the data. The response is a list of all NYTimes articles for the requested month (only headline, abstract, lead paragraph, date, keywords and pictures, no internal content) in JSON format. There is no pagination and so all articles for a month are returned in a single request. The request limit is 2,000 requests per day, so the entire data available on the API can be fetched in two days. The size of the full data is 16.6 GB.Data is available from 09/1851 to present, however data for the months of 09/1978 and 10/1978 are missing.
2. Processing the dataset
The downloaded data is cleaned by removing articles with missing values, punctuations, and stop-words. Named Entity recognition is performed using Spacy library to group entities with multiple words together. The processed data is finally stored as a TSV file. The TSV file is then used by the Spark script to calculate TF-IDF values for the keywords. Once the computation is done, the output is saved to disk as a TSV file.
3. Uploading processed data to database
The output produced by the TF-IDF algorithm is used by the data aggregation python scripts to load the key-word counts and related topics to the Redis DB.
4. Interactive visualization
The backend of the web application uses hapi.js framework and Node.js, and the front-end uses D3.js, jQuery and Bootstrap CSS framework for creating the user interface. The backend connects to the Redis database instance to fetch the trending topics and related news for a given time period and exposes this data as a web service used by the frontend.


INSTALLATION:
1. To get New York Times API key:
	a. Go to https://developer.nytimes.com/
	b. Click "Get NYT API Key"
	c. Follow the instructions to create an "Archive API" key for New York Times
    d. Replace the ‘{api-key}’ in DownloadData.py with the obtained api key.
2. To use Archive API:
	a. Send the following HTTP request:
		http://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key={your-api-key}
	b. If status is OK the response will be a list of all NYTimes articles for that month (only headline, abstract, lead paragraph, date, keywords and pictures, no internal content). It will be in JSON format. There is no pagination so all articles will be returned in one request.
	c. The request limit is 2,000 requests per day, so the entire data can be fetched in two days.
	d. The size of the full data is 16.6 GB. 
	e. NYTimes Archive API has data from 09/1851 to present. However data for the months of 09/1978 and 10/1978 are missing.
3. Installing Redis
    For windows users, redis binaries are available in `redis-2.4.5-win32-win64` folder. For linux users, the installation instructions are available on Redis Website - https://redis.io/topics/quickstart
4. Starting Redis Server
    Start redis server by running `redis-server` command. By default, redis will be listening on port `6379` and loopback address `127.0.0.1`
5. Python Dependencies
    The following python packages are used in this project and are required.
    a. spacy                     2.0.16
    b. urllib3                   1.23
    c. redis                     3.2.100
    d. unicodecsv            0.14.1
6. Spark Script requirements
    * Install Hadoop and Apache Spark
    * Intellij Idea with Scala plugin or SBT
    * Intellij Idea installation steps are available at https://www.jetbrains.com/help/idea/install-and-set-up-product.html
    * SBT installation instruction is available at https://www.scala-sbt.org/1.x/docs/index.html
7. Script execution order
    a. Execute DownloadData.py inside python folder
    b. Open and run the Intellij Idea project inside Backend folder or run `sbt compile` and `sbt run` to run the scala application
    c. Execute CalculateKeyWordCount.py
    d. Execute CalculateKeyWordCountForYear.py
    e. Execute AggregateArticleDetails.py
    f. Execute AggregateArticleDetailsForYear.py
8. For setting up the web server, install Node.js version 11 or higher
9. Go to the code root directory containing package.json file. Run 'npm install' to install the dependencies for the web application


EXECUTION:
1. Start the web server by running 'node app.js'. The web server should now be running on port 3000.
2. Go to http://localhost:3000 on any browser, preferably Chrome.
3. The following steps describe how to use the application:
    - Select the date range for viewing the trending topics and then click update.
    - Press the start button to view trending topics for the selected date range in the canvas.
    - To pause the visualization, press the pause button
    - To view related news regard a topic, click on the topic bubble and related news for that topic will be displayed in a modal. Clicking on the close button closes the modal.
    - To continue the visualization, press the start button.

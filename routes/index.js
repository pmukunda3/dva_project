module.exports = server => {
  // server.route({
  //   method: 'GET',
  //   path: '/public/{filepath*}',
  //   config: {
  //     handler: {
  //       directory: {
  //         path: 'public/lib/',
  //         listing: false,
  //         index: false
  //       }
  //     }
  //   }
  // });
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true,
        index: true,
      }
    }
  });
  require('./api')(server);

  server.route({
    method: 'GET',
    path: '/health',
    config: {
      handler: (request, h) => {
        return 'OK';
      }
    }
  });

  // set credentials via environment variables
  const PORT = 8099;
  const HOST = '136.59.239.39';
  const PASSWORD = 'DVA_NEWS_PASSWORD@@1';

  server.route({
    method: 'GET',
    path: '/topics/{year}/{month?}',
    config: {
      handler: (request, h) => {

        const redis = require('redis');
        const {promisify} = require('util');

        let client = redis.createClient({
            port: PORT,
            host: HOST,
            password: PASSWORD
        });
        const getAsync = promisify(client.get).bind(client);
        client.select(2);

        let year = encodeURIComponent(request.params.year);
        let month = encodeURIComponent(request.params.month);
        console.log('YEAR:', year, 'MONTH:', month);
        let keyword = 'counts_year:' + year;
        if(month != null){
          keyword = 'counts_month:' + year + ':' + month;
        }

        return getAsync(keyword).then(function(res){
          console.log('Keyword:', keyword);
          let topics = JSON.parse(res);
          topics = topics!=null ? topics.slice(0, 10) : topics;
          console.log('Zipped Response from Redis:', topics);
          return topics;
        });

      }
    }
  });

    server.route({
    method: 'GET',
    path: '/articles/{topic}/{year}/{month?}',
    config: {
      handler: (request, h) => {

        const redis = require('redis');
        const {promisify} = require('util');

        // set credentials via environment variables
        let client = redis.createClient({
            port: PORT,
            host: HOST,
            password: PASSWORD
        });
        const getAsync = promisify(client.get).bind(client);
        client.select(2);

        let topic = encodeURIComponent(request.params.topic);
        let year = encodeURIComponent(request.params.year);
        let month = encodeURIComponent(request.params.month);
        let keyword = 'get_ids:' + year + ':' + topic;
        if(month != null){
          keyword = 'get_ids:' + year + ':' + month + ':' + topic;
        }

        return getAsync(keyword).then(function(res){
          console.log('Keyword:', keyword);
          console.log('Response from Redis:', res);
          let data = JSON.parse(res);
          let articles = [];
          for(let i=0, counter=0; data != null & counter<10 & i < data.length; i++){
            if(data[i]['image_url']) {
              articles.push(data[i]);
              counter++;
            }
          }
          // articles = (articles != null ? articles.slice(0, 10) : articles);
          console.log('Zipped Response from Redis:', articles);
          return articles;
        });

      }
    }
  });

  // server.route({
  //   method: ['GET', 'POST'],
  //   path: '/{path*}',
  //   config: {
  //     handler: {
  //       file: 'public/index.html'
  //     }
  //   }
  // });
};

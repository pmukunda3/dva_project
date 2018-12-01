# Built by LucyBot. www.lucybot.com
uri = URI("https://api.nytimes.com/svc/archive/v1/2016/1.json")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = true
uri.query = URI.encode_www_form({
  "api-key" => "78283a15dd5c44be9e6a7a3b846280cd"
})
request = Net::HTTP::Get.new(uri.request_uri)
@result = JSON.parse(http.request(request).body)
puts @result.inspect
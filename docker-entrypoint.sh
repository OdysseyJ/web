
dockerize -wait tcp://mysql:3306 -timeout 20s

echo "Start server"
node app.js
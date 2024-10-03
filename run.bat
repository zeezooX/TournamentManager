@echo off
cd client
echo Installing client dependencies...
call npm install

cd ../server
echo Installing server dependencies...
call npm install

cd ..
echo Starting client and server concurrently...
start cmd /k "cd server && npm start"
start cmd /k "cd client && npm start"
# Local-Video-Party-Client

Node version - 12.8.1  
NPM version - 6.14.8  
To install node <https://phoenixnap.com/kb/update-node-js-version>

## Steps to run client on local machine

-npm i
-cd client
-npm start

## Port Details

| Port Type      | Client    | Server    |
|:--------------:|:---------:|:---------:|
| **Production** | 80        | 1793      |
| **UAT**        | 3002      | 5002      |
| **SIT**        | 3001      | 5001      |
| **Dev**        | 3000      | 5000      |

## Test cases

- Data between two rooms is not shared
- Selected file is video file
- Video is streamed or selected video is played
- Selected videos must have same size

## CHANGELOG

0.1 Basic application without UI, without SSL certificate
0.2 Added leave room functionality
0.3 Added SSL certificate and domain name
0.4 chat function added
0.5 video streaming working
0.6 multiple peer streaming support added, ready button removed

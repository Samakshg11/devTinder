# DevTinder APIs

## authRouter:
POST /Signup
POST /logoin
POST /logout

## profileRouter:
GET /profile/View
PATCH /profile/edit
PATCH /profile/password

## connectionRequestRouter:
POST /request/status/:userId

POST /request/review/:stauts/:requestId


## userRouter:
GET /user/Connections
GET /user/requests
GET /user/feed -gets u profile of other users


## status:ignore,intrested,accepted or rejected
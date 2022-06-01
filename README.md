# Instructions

<hr>

### Install 
* Run `make install` to build containers and install dependencies. 

#### If makefile is not available
* copy  `docker-compose.override.yml.dist` as `docker-compose.override.yml`
* copy `.env.dist` as `.env`
* (Optional) edit `docker-compose.override.yml` according to your needs
* Run `docker-compose build`
* Run `docker-compose run --rm node yarn install`

<hr>

## Start the application
Run `docker-compose up` The application will be running on `http://172.37.0.3:3000`

<hr>
<hr>

# Endpoints

### Create User
`[POST] /user` 

Auth: none

Expected Body: 
```
{
    "username": string,
    "password": string
}
```

Response ok:
```
201 Created
```
<hr>

### Get User
`[GET] /user/:userId` 

Auth: none 

Just for testing purpose

Response:
```
{
    "id": integer,
    "username": string,
    "wallet": {
        "id": integer,
        "hard_currency": integer,
        "soft_currency": integer
    },
    "clubs": [
        {
            "id": integer,
            "club_name": string
        }
    ]
}
```
<hr>

### Add currency to user's wallet
`[POST] /user/:userId/addCurrency` 

Auth: none. 

It adds currency to user's wallet. If hard_currency is > 100 or soft_currency > 1000 it will default them to 100 and 1000

Expected Body:
```
{
    "hard_currency": integer,
    "soft_currency": integer
}
```

Response:
```
{
    "id": number,
    "hard_currency": integer,
    "soft_currency": integer
}
```
<hr>

### LOGIN
`[POST] /user/login`

Auth: none.

It will return a token as uuid to use for future requests

Expected Body:
```
{
    "username": string,
    "password": string
}
```

Response:
```
{
    "uuid": uuid-token
}
```
<hr>

### CREATE CLUB
`[POST] /club`

Auth: uuid token in body

It will create a club managed by the user who creates it. It allows same names for different clubs. As default the creators joins as a member.

Expected Body:
```
{
     "uuid": uuid-token,
     "name": string

}
```

Response:
```
{
    "clubId": integer
}
```
<hr>


### JOIN CLUB
`[POST] /club/join/:clubId`

Auth: uuid token in body

It will add the user making the request to the club's members. It will remove 100 from the user's wallet. 
If the club is full or the user does not have enough money to pay it will return an error

Expected Body:
```
{
     "uuid": uuid-token,
}
```

Response:
```
{
    "clubId": integer
}
```
<hr>


### GET CLUBS
`[GET] /club`

Auth: none

It will return existing clubs with their manager

Response:
```
[
    {
        "id": integer,
        "club_name": string,
        "manager": {
            "id": integer,
            "username": string
        }
    }
]
```
<hr>


### GET CLUB
`[GET] /club/:clubId`

Auth: none

It will return a club's detail

Response:
```
{
    "id": integer,
    "club_name": string,
    "manager": {
        "id": integer,
        "username": "string
    },
    "users": [
        {
            "id": integer,
            "username": string
        }
    ]
}
```
<hr>


### POST MESSAGE IN THE CLUB
`[POST] /messages`

Auth: uuid token in body

Posts a message in the club. Only a member can post the message. Message max length is 65535 chars

Expected Body:
```
{
     "uuid": uuid-token,
     "clubId": integer,
     "message": string
}
```

Response ok:
```
201 Created
```
<hr>


### GET CLUB'S MESSAGES
`[GET] /club/:clubId/messages`

Auth: None

Posts a message in the club. Only a member can post the message. Message max length is 65535 chars


Response:
```
{
    "id": integer,
    "club_name": string,
    "messages": [
        {
            "id": integer,
            "message": string,
            "created_at": DateTime,
            "user": {
                "id": integer,
                "username": string
            }
        }
    ]
}
```
<hr>


### CREATE DONATION REQUEST
`[POST] /club/:clubId/donationRequest`

Auth: uuid token in body

Creates a donation request to club

Expected Body:
```
{
    "uuid": uuid-token,
    "amount": integer
}
```

Response ok:
```
{
    "id": integer
}
```
<hr>


### DONATE
`[POST] /funding/:donationRequestId`

Auth: uuid token in body

Donates money to request. When donations_amount >= requested_amount the funds are automatically transferred to the asker

Expected Body:
```
{
    "uuid": uuid-token,
    "amount": integer
}
```

Response ok:
```
201 Created
```
<hr>







//todo
add auth in open endpoints

# AASF-Website-Backend

<img alt="GitHub issues" src="https://img.shields.io/github/issues/aasf-iiitm/aasf-website-backend"> <img alt="GitHub Hacktoberfest combined status" src="https://img.shields.io/github/hacktoberfest/2020/aasf-iiitm/aasf-website-backend"> ![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square) [![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
</br>

**NOTE: THIS REPOSITORY IS OPEN ONLY TO THE STUDENTS OF IIITM GWALIOR, INDIA.**

Newly built backend for AASF Website(revamped). Yet to be released.

## Core Functions

- Admin-Only Functions:

  - Manage events.
  - Add points for contest winners and goodie questions.
  - Get QR Code to mark attendance for a particular event.
  - Send report emails.
  - Add and edit user details.

- Events:

  - Fetch events.
  - Mark attendance for an event.

- Users:
  - Login.
  - Fetch his/her details.
  - Fetch Leaderboard.
  - Change password and profile picture.

## Get Started

Get started developing...

- You will need a .env file in the root folder for the system to run successfully. An example for the .env file has been written in .env.example. Modify the environment variables as you need and required before starting. Set NODE_ENV to `development` while running it in development mode.
- User has to be an admin for performing any admin-only functions. Admins can only be created directly from the database and not via any API.
- To make yourself an admin, add a user document in the users' collection in the database named `AASF-DEV`(We use MongoDB for our database, so you can either use Mongo Shell or MongoDB Compass if you're running an instance locally, or use the MongoDB Atlas interface if you wish to use the cloud). 
- Schema for the user document can be found [here](https://github.com/AASF-IIITM/aasf-website-backend/blob/master/server/models/user.js). Password field has to be hashed by bcrypt(10 rounds). You may use this hash as your password: $2b$10$W8hAgYAEOdzCKQr8oJWvF.tuqBK3OK2PLbmWeiKAbM6CZ9ycYEsPC. This hash is for the password "aasf_iiitm".
- Once you have created an admin user, start the server by following the below commands.

```shell
# install deps
npm install

# run in development mode
npm run dev
```

- Once the server is up and running, you can open it in localhost:3000 to view the documentation. The first route in the documentation is the login route. Login using the id and password that you just set(roll parameter is the primary key you set in the database document). You must receive a token if everything goes well.
- Create a folder named `users` under the public folder.
- For uploading new users, you will have to use Postman since uploading a CSV file is not yet supported in Swagger UI. The route for uploading new users is /admin/users/upload. Make you sure pass the JWT token in the Authorization header as `bearer {token}`. Upload a [Sample CSV](https://docs.google.com/spreadsheets/d/1cCKq79B3jO3mMGYP6KVn42CKrc5BIbkDTCLX4RMi2JI/edit?usp=sharing) to add new users to the database. The file has to be uploaded in the form-data body with the field name as `users`.
- You can add sample events in the similar manner. Refer to `routes.js` files in the server folder for the main routes and `routes.js` files in sub-folders to find sub-routes. [Sample CSV](https://docs.google.com/spreadsheets/d/1wGRoW9a7JXwEQ15D7IyqykiEiypAoN5SroYmrxGy7W0/edit?usp=sharing) for events. Modify the dates of the events as needed.
- Once there are admin(s), users and events in the database, you're all set to roll. Go through the code and try to understand the code flow. On a high level, the flow goes like:- 
  - An API is hit from the client-side.
  - The main route is matched with a route in the `routes.js` folder in the server folder.
  - A `router` is selected based on the route given, and the request is passed on to a `controller`.
  - The controller receives the request and delegates the operations to be performed to `services`. 
  - The services perform the operations and return to the controller, which then sends the response to the client.
  - Overall, the control sequence is `client request -> server/routes.js -> server/api/controllers/{some controller}/router.js -> server/api/controllers/{some controller}/controller.js -> server/api/services/{some service} -> server/api/controllers/{some controller}/controller.js -> client response`.
- In case you have any doubts, feel free to post it on the [AASF Developers' Circle Facebook Group](https://www.facebook.com/groups/DevsCircle) or send an email to aasf.iiitmg@gmail.com with the subject `[AASF-WEBSITE-BACKEND] Query`.

## Install Dependencies

Install all package dependencies (one time operation)

```shell
npm install
```

## Run It

#### Run in _development_ mode:

Runs the application is development mode. Should not be used in production

```shell
npm run dev
```

#### Run in _production_ mode:

Compiles the application and starts it in production production mode.

```shell
npm run compile
npm start
```

## Test It

Run the Mocha unit tests

```shell
npm test
```

## Try It

- Open http://localhost:3000 on your browser to view the documentation and to invoke the APIs.

## Debug It

#### Debug the server:

```
npm run dev:debug
```

#### Debug Tests

```
npm run test:debug
```

## Lint It

View prettier linter output

```
npm run lint
```

Fix all prettier linter errors

```
npm run lint
```

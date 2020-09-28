# AASF-Website-Backend

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

```shell
# install deps
npm install

# run in development mode
npm run dev

# run tests
npm run test
```

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

#### Debug with VSCode

Add these [contents](https://github.com/cdimascio/generator-express-no-stress/blob/next/assets/.vscode/launch.json) to your `.vscode/launch.json` file

## Lint It

View prettier linter output

```
npm run lint
```

Fix all prettier linter errors

```
npm run lint
```

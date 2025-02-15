# ABBON-expense-app

Expense Tracker API on Nodejs with express-typescript, MySQL database and ORM sequelize.
Secure api with api-key and authorization user with access token and refresh token

> This project is test for backend dev to apply job for ABBON CORPORATION.

## How to start this project

1. **git clone** this project.
2. open command line at root folder.
3. **npm i** to install all package.
4. install global package **nodemon**. (Optional, you can install in this package instead but need to change package script)
5. create **.env** file. (env variable listing at **.env.example**)
6. install database you want to use (prefer **MySQL**) and create schema.
7. **npm run start** to start the project.

### example command

```
git clone <>
cd ABBON-expense-app
npm i
npm i -g nodemon
npm run start
```

## API documentation

Postman collection and environment available in this project.

## ENV detail

> ENV is string but I will provide detail just like what type I expected it to be.

```
PORT= // number: port for this app.
SHOW_LOGGING= // boolean: show consoleLog() in dev console.

DB_TYPE= // mysql | postgres | sqlite | mariadb | mssql: database type. (prefer mysql)
DB_NAME= // string: schema name.
DB_USERNAME= // string: database username.
DB_PASSWORD= // string: database password.
DB_HOST= // string: database IP.
DB_PORT= // number: port for database.
DB_SYNC_MODE= // boolean: sequelize function, if === true database will drop & create every time app has start.
DB_LOGGING= // boolean: sequelize function, if === true database query will be log in dev console.

API_KEY= // string: random string for secure api.

SALT_VALUE= // number: salt for bcrypt hashed password.

ACCESS_TOKEN_SECRET_KEY= // string: random string for secure token jwt sign.
ACCESS_TOKEN_EXPIRATION= // ms.StringValue: expire for token jwt.
REFRESH_TOKEN_SECRET_KEY= // string: random string for secure token jwt sign.
REFRESH_TOKEN_EXPIRATION= // ms.StringValue: expire for token jwt.

CORS_ORIGIN= // string: cors option.
CORS_METHODS= // string: cors option.
CORS_HEADERS= // string: cors option.
CORS_CREDENTIALS= // boolean: cors option.
```

### ENV CORS example

> Not test with front end code yet.

```
CORS_ORIGIN=*
CORS_METHODS=GET,POST,PUT,PATCH,DELETE,OPTIONS
CORS_HEADERS=*
CORS_CREDENTIALS=true
```

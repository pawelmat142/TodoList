# TodoList 

## Overview 

TodoList is a simple and lightweight To-Do List application, designed for both web and mobile platforms. It allows users to add, mark as completed, and delete tasks in an intuitive and user-friendly interface.

### Project web prototype runs [here](http://130.162.34.50:8002/).

### About mobile app: [./mobile](./mobile/README.md)

<br>

## Tech Stack

#### Angular - more details in [./frontend](./frontend/README.md)

#### Node.js - more details in [./backend](./backend/README.md)

#### MongoDB

<br>

## Start web app locally

- create project directory, get inside with terminal and run:
```
git clone https://github.com/pawelmat142/TodoList.git ./
```
- In terminal one open `./backend` and run:

```
npm install
node todo.js
```
- now open  `http://localhost:8002/` to view already built and hosted app
- or open terminal two, go to `./frontend` and run:
```
npm install
ng serve
```
- and open `http://localhost:4200/` in your browser

<br>

### Security

The app is not secured, and the `.env` files are public. This is intentional as the applications are developed for educational and portfolio purposes. This approach helps with maintaining and presenting the projects with minimal configuration required.


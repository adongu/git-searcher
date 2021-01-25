# Getting Started with this App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn`

Ensure you have latest yarn installed https://classic.yarnpkg.com/en/docs/install

```
$ yarn
```

### `yarn start`

```
$ yarn start
```

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Running app with Docker

build image

```
$ docker build -t git-searcher .
```

Run container

```
$ docker run -it -p 3000 git-searcher
```

### Running the server

Ensure you have docker installed https://docs.docker.com/get-docker/

```
$ docker run -p 8080:8080 gcr.io/hiring-278615/reposerver
```

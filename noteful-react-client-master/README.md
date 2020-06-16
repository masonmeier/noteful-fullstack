# noteful-react-client

![Noteful screenshot](https://github.com/asktami/noteful-react-client/blob/master/noteful.png 'Noteful')

[View Live](https://noteful-react-client.asktami.now.sh/)

## Description

Works with [https://github.com/asktami/noteful-api](https://github.com/asktami/noteful-api).

There are 3 routes: the main route, the dynamic folder route and a dynamic note route.

- Each route should have a header, main section, and a sidebar section

- Every route will have the same header section, the app's title should be a link to the main route

- The main route: - Should be displayed when the path is / - The main section will display all of the available notes - - Each note should show it's name and modified date - The sidebar will display a list of folders with none selected

- The dynamic folder route: - Should be displayed when the path is /folder/<with-a-folder-id-here> - The folder-id will reference an id of one of the folders in state - The main section should display only the notes that are "in" the selected folder - The sidebar should display the folder list with the selected folder highlighted

- The dynamic note route: - Should be displayed when the path is /notes/<with-a-note-id-here> - The note-id will reference an id of one of the notes in state - The main section should display the currently selected notes name, modified date and content - The sidebar should display the folder of the currently selected note as well as a "back" button

- Use the React Context API instead of prop drilling

- Implement fetch requests to two endpoints when the application mounts: /folders and /notes. Store the response from these requests using a setState inside the main App component

- The API calls can be made to either a **local json server** or a **PostgreSQL database**

- Implement the delete button for each note in the list in the main route and folder route

- Implement the delete button on the note page, if the delete is successful, redirect to the / path

- Implement "add-folder" and "add-note" controlled component forms

- Implement "edit-folder" and "edit-note" controlled component forms

- A folder is a _parent_ record to _child_ note records

## Hosted on

- Zeit

## Setup

1. See [https://github.com/asktami/noteful-api](https://github.com/asktami/noteful-api) for instructions on installing the backend API

2. Clone this repo

3. In Terminal, change to the directory on your computer that contains this repo

4. Install dependencies: `npm install`
5. Environment:

   - Prepare the environment file: `cp example.env .env`
   - Replace values in `.env` with your custom values
   - Replace the value for `REACT_APP_API_KEY` with the same API token value you use in your backend API

6. Start the app in a web browser: `npm start`

### To use a Noteful JSON server

1. To get your local copy of the Noteful JSON API, clone this project into your local projects folder:

```
      git clone https://github.com/tomatau/noteful-json-server
      cd ./noteful-json-server
      npm install
      npm start

      Use db BACKUP.json, from this repo, as the datasource (renamed as db.json, replacing the existing db.json).

      Ctrl-c to close the server
```

2. Change the backend API endpoints in `./src/config.js`

You can see documentation for the JSON server once its started by visiting http://localhost:9090.
You can see all of the data currently stored in the server by visiting http://localhost:9090/db.

More info is at [https://github.com/typicode/json-server](https://github.com/typicode/json-server) - a fake REST API for the database.

---

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

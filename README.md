## File structure

#### `frontend` - Holds the client application

- #### `public` - Holds all of our static files
- #### `src`
  - #### `Assets` - Holds assets such as images, docs, and fonts
  - #### `components and other folders` - Holds all of the different components that will make up our views
  - #### `App.js` - renders all of our browser routes and different views
  - #### `index.js` - renders the react app by rendering App.js
- #### `package.json` - Defines npm behaviors and packages for the client

#### `backend` - Holds the server application

- #### `config` - Holds our configuration files
- #### `controller` - Holds all of the callback functions that each route will call
- #### `db` - Database
- #### `middleware and utils` - Holds some key functions
- #### `model` - Holds all of our data models
- #### `App.js` - renders all of our browser routes and different views
- #### `package.json` - Defines npm behaviors like the scripts defined in the next section of the README
- #### `server.js` - Defines npm behaviors and packages for the client

#### `.gitignore` - Tells git which files to ignore

#### `README` - This file!

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the server app

### `npm start`

Run client, server app

### `npm run build`

Builds the client app for production to the `build` folder.

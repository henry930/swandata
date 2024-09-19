# Backend and Database 
This project we are using Firebase as the backend cloud service. https://firebase.google.com/
The database I am using Realtime Database, which is noSQL with API. Easily to deploy and scale up. https://firebase.google.com/docs/database?hl=zh-tw 
The console is using my personal account, please send request to henry930@gmail.com for admin access.
The database schema is as below:

trader:
  - trader_id:string  // Unique ID
  - trader_name: string // Name of trader
  - credit: number  // How much they earn. Can be updated by resolving bets

markets: // What Type of bettings
  - market_id: string // Unique ID
  - market_name: string // Name of Market

sports:
  - sport_id
  - sport_name
  - description

events: // Combling individual-fixtures and participant fixtures, it's the game of those bettings on. 
  - event_id
  - event_name
  - event_time
  - participants //(including matching game, first one is home, second is away.)
  - result //This is the JSON of all results. A component will help operators input all information of the result, so as to help resolving bettings.
  - sport_id //Which sport of the game
  - status //Whether the result came yet.

mo
    



# Getting Started with Swandata Operation App
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:
### `npm install`
Before start project, please run this command to install all required modules.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

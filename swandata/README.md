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

model:
  - selection_id //Unique ID
  - event_id //Refer to which game
  - fixture_id //Refer to past table of fixture. No longer used
  - market_id // Refer to which bet market it betting
  - selection // Home/Away/Draw/Over/Under the parameter of the bettings
  - value // Score, Number of card/ goal/ corners, depend on which market it betting.

bets:
  - bet_id // Unique ID
  - bet_time
  - event_id //Which game it bets
  - market_id // Which market it bets
  - price // How much it bets
  - selection // The parameter of the model
  - selection_id // Which model selected
  - stake_size //How many bets on
  - status // Whether payout come
  - trader_id // Who bets on
  - value // Also parameter of the model 
  
# Framework and Functionalities
We are using React Material Table for the whole development. https://www.material-react-table.com/
The powerful and highly customizable framework help on.
1. realtime connect to cloud database through API
2. user friendly table-like UI for the operator.
3. Allow customized components for cell rendering and cell editing. 
4. Customized button for bulk action on multiple selected/ conditonal row

All functionalities developed:
- Resolve bets by traders, and auto update their credit.
- Game result fill up component. A user friendly form to fill up all necessary information for bets resolving.
- Resolve bets by specific selected events
- Update bets by specific selected events (mostly the result updated)
- DateTime component created.
- AutoComplete component built for operator easily found and matched trader/ events/ sport/ market/ model
- Selection component for updating different status.
- UUID for new record's ID generation
- Green color of "Update Result" button means result updated.

Features to do: 
- Infinite scroll
- Row color for different status to notify operators. For example, green row of bets record, mean Payout come, please resolve.
- Auto scheduler for bets resolving. like daily
- bets resolving by results updated trigger. Bets resolve can be triggered once results have been updated.
- Error validation. like, required fields mssing, incorrect value format etc.
- Result updated by connect to other API or data grabbing.

# Bugs and Error Alert, To Do and Limitation
- Table.tsx is too long, should be divided it into more files so as to read easily
- Error validation is missing for most of the components
- *API key or other secure information should be deal with other measures, instead of store in the code!!
- Data structure and bets resolve calculation may be wrong, as I don't have any betting experience before.
- development, staging and production envirnoment, especially database need to be setup.
- Betting resolving tasks should be executed in backend instead of frontend.
- Unit test hasn't done.



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

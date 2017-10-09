

- Git Init
	- `git init`

- Create React Native App
	- Install globally (if needed) 
		- `npm install -g create-react-native-app`
	- Crete 
		- `create-react-native-app told-software-app`
	- Verify with Expo App on phone
		- `cd told-software-app`
		- `yarn start`
		- Open in Expo App (local wifi phone)
- (NOT WORKING) Install React Native Web 
	- Install 
		- `yarn add react react-dom react-native-web`
	- Install Webpack
		- `yarn add webpack webpack-dev-server --dev` 
	- Create web/webpack.config.js 
		- React Native for Web Getting Started
		- https://github.com/necolas/react-native-web/blob/22eebea63347ece6fb3dc96abfe2e599e1e789ad/docs/guides/getting-started.md
	- Create web entry index.web.js
		- https://github.com/necolas/react-native-web/blob/22eebea63347ece6fb3dc96abfe2e599e1e789ad/docs/guides/getting-started.md
		- Edit to point to ./App
	- Run for Development
		- Add command to package.js:
		- "startweb": "./node_modules/.bin/webpack-dev-server -d --config web/webpack.config.js --inline --hot --colors",
		- yarn run startweb 
	- Build for Production
		- Add command to package.js:
		- "buildweb": "./node_modules/.bin/webpack -p --config web/webpack.config.js",
		- yarn run buildweb


- Setup Firebase Hosting Deployment
	- Install Firabase CLI (If Needed)
		- `npm install -g firebase-tools`
	- Init Firebase
		- `firebase init`
		- Follow prompts
			- Select Hosting
			- Public Folder: "deploy"
			- Single Page App: (Y)es
	- Setup Firebase Firestore
		- `firebase init firestore`
	- Deploy Firebase
		- `firebase deploy`
	- Verify Deployment
		- Open Url in CLI in Browser

- Add Firebase Web SDK (Used by React Native if using Expo)
	- Install NPM
		- `yarn add firebase`
	- Use

```
import * as firebase from 'firebase';`
const app = firebase.initializeApp({ /*Get from Firebase Console*/ });

```


---

- Add React Navigation
	- `yarn add react-navigation`


---

- Convert to Typescript Code


---

- (Optional - Requires Expo Eject, Use Firebase Web for simplicity) Install React Native Firebase (Invertase)
	- `yarn add react-native-firebase`
	- 



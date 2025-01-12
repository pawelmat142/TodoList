# TodoList - IONIC mobile app

## Overview
This project is a mobile version of my ToDoList app.

### The motivation behind creating this app was to:

- <strong>Learn the Ionic Framework:</strong> Gain hands-on experience with Ionic and Capacitor to create mobile applications.

- <strong>Implement Offline Mode:</strong> Build offline capabilities using local storage for a better user experience when there is no internet connection.

- <strong>Integrate a Custom Backend:</strong> Use the same backend and API as my Angular version of the To-Do List app to maintain consistency across platforms.

- <strong>HTML & CSS:</strong> Strengthen my foundational web development skills, focusing on crafting responsive and user-friendly interfaces 

</br>

### Installation

#### Android

download and install `.apk` file from [here](https://drive.google.com/drive/folders/1AibwuSnwfnpOvNxE5Dh12a_nChQZtTem?hl=pl)

#### iOS 

This project does not include a generated `.ipa` file for iOS because Apple requires a paid Developer Account to create and distribute `.ipa` files. As this is a personal portfolio project, I have chosen not to pay for this service. However, the project can still be run locally on iOS devices using Xcode with a free Apple ID. To run app on an iOS device using Xcode, follow these steps:

- create project directory, open it with console and run: 
```
git clone https://github.com/pawelmat142/TodoList.git ./
cd mobile
npm install
ionic build
npx cap add ios
npx cap sync ios
```
- plug in iOS device to your Mac using a USB cable,
- on your iOS device, go to <strong>Settings > General > Device Management,</strong> and trust your developer profile,
- in Xcode, choose your connected device from the target device dropdown,
- click the Run button in Xcode to build and install the app.
    
<br>


## Setup locally as web app

To run the app in browser locally, follow these steps:

- create project directory, open it with console and run: 
```
https://github.com/pawelmat142/TodoList.git ./
cd mobile
npm install
npm start
```

open your browser and go to `localhost:4200`

<br>

## Technologies
Project is created with:
* Ionic v6,
* Capacitor v3.6
* Ionic Storage
* Angular 13 

<br>

### Security

Security
The app is not secured, and the .env files are public. This is intentional as the applications are developed for educational and portfolio purposes. This approach helps with maintaining and presenting the projects with minimal configuration required.
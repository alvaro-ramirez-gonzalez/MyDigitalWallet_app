export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyAhMvK5ZI3qxgs1WdjRBqh6Kmzz-YMEbhk',
    authDomain: 'mydigitalwallet-2b331.firebaseapp.com',
    projectId: 'mydigitalwallet-2b331',
    storageBucket: 'mydigitalwallet-2b331.firebasestorage.app',
    messagingSenderId: '574202598990',
  
    appId: (window.location.href.includes('localhost') || !window.location.href.includes('android_asset')) 
           ? '1:574202598990:web:ae6c750c9a2dab9dcd551f'    
           : '1:574202598990:android:632a4684ea434253cd551f' 
  }
};
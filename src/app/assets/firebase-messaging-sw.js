/*
Give the service worker access to Firebase Messaging.
Note that you can only use Firebase Messaging here, other Firebase libraries are not available in the service worker.
*/
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.0/firebase-messaging.js');

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/

addBackgroundServiceWorker = () => {
    const url = new URL(self.location);
    if (!url)
        throw 'Url is invalid';

    let urlSearchParams = url.searchParams;
    if (!urlSearchParams)
        throw 'Param is not defined';

    const messagingSenderId = urlSearchParams.get('messagingSenderId');
    if (!messagingSenderId) {
        console.log('No messagingSenderId is passed to service worker.');
        return;
    }

    firebase.initializeApp({
        'messagingSenderId': messagingSenderId
    });

    const messaging = firebase.messaging();
    messaging.setBackgroundMessageHandler((payload) => {
        console.log('[firebase-messaging-sw.js] Received background message ', payload);
        // Customize notifications here
        const notificationTitle = 'Background Message Title';
        const notificationOptions = {
            body: 'Background Message body.',
            icon: 'aspira-weapon-with-soldier-icon.png'
        };

        return self.registration.showNotification(notificationTitle,
            notificationOptions);
    });
};

// Add background-service worker.
addBackgroundServiceWorker();

var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BIfuei3JQWQBJlbvxWx-UbcaigjeplsDPpd3lDDOlIR3j8sNFd_vbr-w1sQtykQur8VlCuHhhwUuMZgnpSDHLi8",
   "privateKey": "PXy9bgfkYAUnpyYvoKgtVQn_egaAJIh0VvKfqruSxlI"
};
 
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/ewPG-8IcAG0:APA91bHViQq-La0AlckfTBU64lStU8DvVc9_RuxMNUyu94qoi30rbpAqrJHPSYElft1yajsbOjY-_y-Y1vfK9p284ZEwYLsK8TJNCs0M7PYsRGYXUqneksrra_J2sshPvqGdULjO2B4B",
   "keys": {
       "p256dh": "BP40LasoN8FCaJtb5cEeZPeGOCIl0VoO8wI48jtsLIRlzKayiIMLBrm/uHYQypNnWlHWn8qOfGJD5BtN47ZfP6w=",
       "auth": "HXogxVIo0cbILT/34mC5EA=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '21502049687',
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);
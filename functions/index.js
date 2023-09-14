const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotification = functions.firestore
    .document("messages/{messageId}")
    .onCreate(async (snapshot, context) => {
      const senderUid = snapshot.data().senderUid;
      const recipientUid = snapshot.data().recipientUid;

      try {
        // Use Promise.all to fetch both sender and recipient user data
        const [senderUser, recipientUser] = await Promise.all([
          admin.auth().getUser(senderUid),
          admin.auth().getUser(recipientUid),
        ]);

        const senderDisplayName = senderUser.displayName;
        const recipientDeviceToken = recipientUser.customClaims.deviceToken;

        const payload = {
          notification: {
            title: "New Message",
            body: `${senderDisplayName} sent you a new message.`,
          },
        };

        const options = {
          priority: "high",
          timeToLive: 60 * 60 * 24, // 24 hours
        };


        const messaging = admin.messaging();
        await messaging.send(recipientDeviceToken, payload, options);
        console.log("Notification sent successfully");
      } catch (error) {
        console.error("Error sending notification:", error);
      }
    });

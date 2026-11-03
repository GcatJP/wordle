const { onValueCreated } = require("firebase-functions/v2/database");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendPush = onValueCreated(
  {
    ref: "/notify/{id}",
    region: "asia-southeast1",
    instance: "wordle-d7fab-default-rtdb",
  },
  async (event) => {
    const n = event.data.val();
    const root = event.data.ref.root;
    try {
      if (!n || !n.to) return;
      const tokenSnap = await root.child("pushTokens/" + n.to).get();
      const token = tokenSnap.val();
      if (!token) return;
      try {
        await admin.messaging().send({
          token: token,
          data: { title: String(n.title || ""), body: String(n.body || "") },
          webpush: { headers: { Urgency: "high", TTL: "3600" } },
        });
      } catch (err) {
        if (
          err.code === "messaging/registration-token-not-registered" ||
          err.code === "messaging/invalid-registration-token"
        ) {
          await root.child("pushTokens/" + n.to).remove();
        } else {
          console.error("send failed", err);
        }
      }
    } finally {
      await event.data.ref.remove();
    }
  }
);
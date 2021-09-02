const functions = require("firebase-functions");
const admin = require("firebase-admin");
// const cors = require('cors')({ origin: true });

admin.initializeApp();



// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });


exports.addToCart = functions.https.onCall(async(data, context) => {
    // cors(data, context, async() => {
    // your function body here - use the provided req and res from cors
    const userId = context.auth.uid;
    const productId = data.productId;
    const quantity = data.quantity;


    const productInCart = await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").doc(productId).get();
    const product = await admin.firestore()
        .collection("Products")
        .doc(productId)
        .get();

    if (product.exists) {

        if (productInCart.exists) {
            const count = productInCart.get("quantity");
            await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").doc(productId).update({
                "quantity": quantity + count,
            });
        } else {
            await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").doc(productId).set({
                "quantity": quantity,
            });


            return "done";
        }
    } else {
        return "error";
    }

    // })

});
exports.removeFromCart = functions.https.onCall(async(data, context) => {
    // cors(data, context, async() => {
    // your function body here - use the provided req and res from cors
    const userId = context.auth.uid;
    const productId = data.productId;
    const productInCart = await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").doc(productId).get();
    if (productInCart.exists) {
        await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").doc(productId).delete();
    } else {
        return "Already removed";
    }
    // })
});
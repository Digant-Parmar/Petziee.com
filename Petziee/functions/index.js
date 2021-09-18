const functions = require("firebase-functions");
const admin = require("firebase-admin");
// var request = require('request');
const cors = require('cors')({ origin: true });

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



exports.createOrder = functions.https.onCall(async(data, context) => {
    console.log("data: ", data);
    // context.set('Access-Control-Allow-Origin', '*');
    // cors(data, context, () => {
    var instance = new Razorpay({ key_id: 'rzp_test_EQavvp4sNxxG6W', key_secret: 'NyrBxjP43twshRqwKZgG5sMu' });

    var options = {
        amount: data.amount, // amount in the smallest currency unit
        currency: "INR",
        receipt: data.receiptId,
    };
    instance.orders.create(options, function(err, order) {
        if (err) return new Error;

        console.log(order);
        return JSON.stringify(order);;
    });

    // });
});
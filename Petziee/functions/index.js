const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require('razorpay');
const crypto = require("crypto");

// var request = require('request');
// const cors = require('cors')({ origin: true });

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
        return "removed";

    } else {
        return "Already removed";
    }

    // })
});



exports.razorpay = functions.https.onCall(async(data, context) => {
    // console.log("data: ", data);


    // // context.set('Access-Control-Allow-Origin', '*');
    // // cors(data, context, () => {



    var instance = new Razorpay({ key_id: 'rzp_test_EQavvp4sNxxG6W', key_secret: 'NyrBxjP43twshRqwKZgG5sMu' });

    var x;
    var totalPrice = 0;
    const userId = context.auth.uid;

    var ref = admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc();


    if (data.isCart) {
        // console.log("is if", userId);
        return await admin.firestore().collection("CustomerInfo").doc(userId).collection("cart").get().then(async(qs) => {
            for (element of qs.docs) {
                console.log(element.id);
                await admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(ref.id).collection("products").doc(element.id).set(element.data());
                await admin.firestore().collection("Products").doc(element.id).get().then((value) => {
                    var op = value.data().originalPrice;
                    var discount = op * value.data().salePerc / 100;
                    var finalPrice = (op - discount) * element.data().quantity;
                    totalPrice = totalPrice + finalPrice;
                });
            };
            console.log("Total Amount", totalPrice);


            var options = {
                amount: totalPrice, // amount in the smallest currency unit
                currency: "INR",
                receipt: ref.id,
            };
            var temp = instance.orders;
            await temp.create(options, function(err, order) {
                console.log(JSON.stringify(order));
                // console.log("returning to the function");
                // console.log(order);

                admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(ref.id).set({
                    "orderId": order.id,
                    "amount": totalPrice,
                    "status": "created",
                    "created_at": order.created_at,
                });
                x = (JSON.stringify(order));
            });
            return x;

        });


    } else {

        return Error;
    }


    // });


    // var json = JSON.stringify({
    //     "amount": 50000,
    //     "currency": "INR",
    //     "receipt": "order_rcptid_11"
    // });
    // console.log(json);
    // var options = {
    //     'method': 'POST',
    //     'url': 'https://api.razorpay.com/v1/orders',
    //     'headers': {
    //         'content-type': 'application/json',
    //         'Authorization': 'Basic cnpwX3Rlc3RfRVFhdnZwNHNOeHhHNlc6TnlyQnhqUDQzdHdzaFJxd0taZ0c1c011'
    //     },
    //     body: json

    // };
    // return request(options, function(error, response) {
    //     if (error) throw new Error(error);
    //     console.log(response.body);
    //     return response.body;
    // });


});


exports.confirmPayment = functions.https.onCall(async(data, context) => {
    const userId = context.auth.uid;

    const text = data.razorpay_order_id + "|" + data.razorpay_payment_id;
    var signature = crypto
        .createHmac("sha256", "NyrBxjP43twshRqwKZgG5sMu")
        .update(text)
        .digest("hex");

    if (signature === data.razorpay_signature) {
        admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(data.id).update({
            "status": "Paid",
        });

        console.log("PAYMENT SUCCESSFULL");
        return true;
    } else {
        admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(data.id).update({
            "status": "Failed",
        });
        return false;
    }

});
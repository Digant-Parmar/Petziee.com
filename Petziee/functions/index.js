const functions = require("firebase-functions");
const admin = require("firebase-admin");
const Razorpay = require('razorpay');
const crypto = require("crypto");


// var request = require('request');
// const cors = require('cors')({ origin: true });

// const cors = require('cors')({ origin: true });

let Promise = require('promise');
const request = require('request');
const algoliasearch = require('algoliasearch');

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


function EmptyCart(userId) {
    deleteCollection(admin.firestore(), "/CustomerInfo/" + userId + "/cart", 10);
}

async function deleteCollection(db, collectionPath, batchSize) {
    const collectionRef = db.collection(collectionPath);
    const query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, resolve).catch(reject);
    });
}

async function deleteQueryBatch(db, query, resolve) {
    const snapshot = await query.get();

    const batchSize = snapshot.size;
    if (batchSize === 0) {
        // When there are no documents left, we are done
        resolve();
        return;
    }

    // Delete documents in a batch
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();

    // Recurse on the next process tick, to avoid
    // exploding the stack.
    process.nextTick(() => {
        deleteQueryBatch(db, query, resolve);
    });
}



exports.razorpay = functions.https.onCall(async(data, context) => {
    // console.log("data: ", data);


    // // context.set('Access-Control-Allow-Origin', '*');
    // // cors(data, context, () => {



    var instance = new Razorpay({ key_id: 'rzp_live_zNDp8kSiWigyQ5', key_secret: '8vuYp1R9DGjreC5zSWPXT5ZU' });

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
                amount: totalPrice * 100, // amount in the smallest currency unit
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
                    "amount": totalPrice * 100,
                    "status": "created",
                    "created_at": order.created_at,
                });
                x = (JSON.stringify(order));
            });
            return x;

        });


    } else {


        await admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(ref.id).collection("products").doc(data.productId).set({
            "quantity": data.quantity
        });
        await admin.firestore().collection("Products").doc(data.productId).get().then((value) => {
            var op = value.data().originalPrice;
            var discount = op * value.data().salePerc / 100;
            var finalPrice = (op - discount) * data.quantity;
            totalPrice = totalPrice + finalPrice;
        });

        console.log("Total Amount", totalPrice);


        var options = {
            amount: totalPrice * 100, // amount in the smallest currency unit
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
                "amount": totalPrice * 100,
                "status": "created",
                "created_at": order.created_at,
            });
            x = (JSON.stringify(order));
        });
        return x;
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
        .createHmac("sha256", "8vuYp1R9DGjreC5zSWPXT5ZUs")
        .update(text)
        .digest("hex");

    if (signature === data.razorpay_signature) {
        admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(data.id).update({
            "status": "Paid",
        });
        EmptyCart(userId);
        console.log("PAYMENT SUCCESSFULL");

        return true;
    } else {
        admin.firestore().collection("CustomerInfo").doc(userId).collection("orders").doc(data.id).update({
            "status": "Failed",
        });
        return false;
    }

});






// For algoia Search




// listen for creating a piece of equipment in Firestore
exports.addEquipmentToAlgolia = functions.firestore.document('Products/{document}')
    .onCreate((event, context) => {
        console.log('ADD EQUIP EVENT IS', event);
        const active = event.data().toShow
        const data = {
            objectID: event.data().id,
            name: event.data().name,
            brand: event.data().brand,
            isInSale: event.data().isInSale,
            size: event.data().size,
            style: event.data().style,
            type: event.data().type,
            // category_id: event.data.data().category_id,
            originalPrice: event.data().originalPrice,
            // group: event.data.data().group,
            // hourly: event.data.data().hourly,
            toShow: active,
            // bundleItem: event.data.data().bundleItem,
            // daily: event.data.data().daily,
            // weekly: event.data.data().weekly,
            // monthly: event.data.data().monthly,
            // bulkItem: event.data.data().bulkItem
        };
        return addToAlgolia(data, 'Products')
            .then(res => console.log('SUCCESS ALGOLIA equipment ADD', res))
            .catch(err => console.log('ERROR ALGOLIA equipment ADD', err));
    });
// listen for editing a piece of equipment in Firestore
exports.editEquipmentToAlgolia = functions.firestore.document('Products/{document}')
    .onUpdate((event, context) => {
        console.log('edit event', event.after.data())
        const active = event.after.data().toShow
        const data = {
            objectID: event.after.data().id,
            name: event.after.data().name,
            brand: event.after.data().brand,
            isInSale: event.after.data().isInSale,
            size: event.after.data().size,
            style: event.after.data().style,
            type: event.after.data().type,
            // category_id: event.data.data().category_id,
            originalPrice: event.after.data().originalPrice,
            // group: event.data.data().group,
            // hourly: event.data.data().hourly,
            toShow: active,
            // bundleItem: event.data.data().bundleItem,
            // daily: event.data.data().daily,
            // weekly: event.data.data().weekly,
            // monthly: event.data.data().monthly,
            // bulkItem: event.data.data().bulkItem
        };
        console.log('DATA in is', data)
        return editToAlgolia(data, 'Products')
            .then(res => console.log('SUCCESS ALGOLIA EQUIPMENT EDIT', res))
            .catch(err => console.log('ERROR ALGOLIA EQUIPMENT EDIT', err));
    });
// listen for a delete of a piece of equipment in Firestore
exports.removeEquipmentFromAlgolia = functions.firestore.document('Products/{document}')
    .onDelete((event, context) => {
        const objectID = event.data().id;
        return removeFromAlgolia(objectID, 'Products')
            .then(res => console.log('SUCCESS ALGOLIA equipment ADD', res))
            .catch(err => console.log('ERROR ALGOLIA equipment ADD', err));
    })
    // helper functions for create, edit and delete in Firestore to replicate this in Algolia
function addToAlgolia(object, indexName) {
    console.log('GETS IN addToAlgolia')
    console.log('object', object)
    console.log('indexName', indexName)
    const ALGOLIA_ID = functions.config().algolia.app_id;
    const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(indexName);
    return new Promise((resolve, reject) => {
        index.addObject(object)
            .then(res => {
                console.log('res GOOD', res);
                resolve(res)
            })
            .catch(err => {
                console.log('err BAD', err);
                reject(err)
            });
    });
}

function editToAlgolia(object, indexName) {
    const ALGOLIA_ID = functions.config().algolia.app_id;
    const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(indexName);
    return new Promise((resolve, reject) => {
        index.saveObject(object)
            .then(res => {
                console.log('res GOOD', res);
                resolve(res)
            })
            .catch(err => {
                console.log('err BAD', err);
                reject(err)
            });
    });
}

function removeFromAlgolia(objectID, indexName) {
    const ALGOLIA_ID = functions.config().algolia.app_id;
    const ALGOLIA_ADMIN_KEY = functions.config().algolia.api_key;
    const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
    const index = client.initIndex(indexName);
    return new Promise((resolve, reject) => {
        index.deleteObject(objectID)
            .then(res => {
                console.log('res GOOD', res);
                resolve(res)
            })
            .catch(err => {
                console.log('err BAD', err);
                reject(err)
            });
    });
}
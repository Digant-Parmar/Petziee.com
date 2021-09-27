//To get the price form db
async function initialize() {
    await firebase.initializeApp({
        apiKey: "AIzaSyDHBFSULRYjuXw2YRE9lqxki2C_Cc7-s6A",
        authDomain: "petzieee.firebaseapp.com",
        projectId: "petzieee",
        storageBucket: "petzieee.appspot.com",
        messagingSenderId: "779568120586",
        appId: "1:779568120586:web:3e5e2e3ff2746a1bffb0f3",
        measurementId: "G-ZNDJHXSXES"
    });
}

document.addEventListener('DOMContentLoaded', initialize);

async function uploadToFirestore() {

    // const loadEl = document.querySelector('#load');

    // const admin = require('firebase-admin');

    // await firebase.initializeApp({
    //     apiKey: "AIzaSyC5EHyg7Y5InbSGerMutlDBSrpRRQf3o5c",
    //     authDomain: "petezzie.firebaseapp.com",
    //     databaseURL: "https://petezzie.firebaseio.com",
    //     projectId: "petezzie",
    //     storageBucket: "petezzie.appspot.com",
    //     messagingSenderId: "232300058192",
    //     appId: "1:232300058192:web:d1868e4351b3142dd46355",
    //     measurementId: "G-8N4647EL3H"
    // });

    console.log("in");
    // var priceElement = document.getElementById("discountedPrice");
    // var bodyId = document.getElementsByTagName("body")[0].id;
    var id = document.body.id;

    let db = firebase.firestore();

    // var docRef = await db.collection("Products").doc();

    await db.collection("Products").get().then((qs) => {
        qs.forEach(async(element) => {
            await db.collection("Products").doc(element.id).update({
                "temp": "temp",
            });

            await db.collection("Products").doc(element.id).update({
                "temp": firebase.firestore.FieldValue.delete(),
            });
        });
    });

    var text = "";


    // await db.collection("Products").get().then((qs) => {
    //     qs.forEach(async(element) => {
    //         var name = element.data().name.replace(/,/g, '-');
    //         var id = element.id;

    //         text = text + "<br> " + name + "," + id + "," + "</br> ";
    //     });
    // });

    // document.getElementById("pro").innerHTML = text;


    // var uploader = document.getElementById("uploader");
    // var file = document.getElementById("imageUpload").value;

    // var storageRef = firebase.storage().ref('Products/'+docRef.id);
    // var id = document.getElementById("id");



    // var name = document.getElementById("name");
    // var originalPrice = document.getElementById("originalPrice");
    // var eachPrice = document.getElementById("eachPrice");
    // // var mainImage = document.getElementById("mainImage");
    // var size = document.getElementById("size");
    // var averageStar = document.getElementById("averageStar");
    // var salePerc = document.getElementById("salePerc");
    // var style = document.getElementById("style");
    // var toShow = document.getElementById("toShow");
    // var type = document.getElementById("type");
    // var isInStock = document.getElementById("isInStock");
    // var isSale = document.getElementById("isSale");
    // var isEachPrice = document.getElementById("isEachPrice");
    // var brand = document.getElementById("brand");

    // const res = await docRef.set({
    //     "id": docRef.id,
    //     "originalPrice": Number(originalPrice.value),
    //     "eachPrice": eachPrice.value,
    //     "mainImage": "https://petezzie.web.app/dp/image/" + docRef.id + "/" + docRef.id + ".png",
    //     "size": size.value,
    //     "averageStar": Number(averageStar.value),
    //     "salePerc": Number(salePerc.value),
    //     "style": style.value,
    //     "toShow": toShow.value == "true" ? true : false,
    //     "type": type.value,
    //     "isInStock": isInStock.value == "true" ? true : false,
    //     "isSale": isSale.value == "true" ? true : false,
    //     "name": name.value,
    //     "Date": firebase.firestore.Timestamp.now(),
    //     "isEachPrice": isEachPrice.value == "true" ? true : false,
    //     "brand": brand.value,
    // });
    alert("Uploaded");
}

// const call = getPrice;


// //For add to cart

// function addToCart() {

//     var id = document.body.id;
//     var quantity = document.getElementById("quantity");

//     // let db = firebase.firestore();

//     var functions = firebase.functions();

//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             // User logged in already or has just logged in.
//             var addToCart = functions.httpsCallable("addToCart");
//             addToCart({
//                 productId: id,
//                 quantity: +quantity.value,
//             }).then((result) => {
//                 console.log(result.data);
//             }).catch((error) => {
//                 var code = error.code;
//                 var message = error.message;
//                 var details = console.error.details;

//                 console.error("code : " + code + "message:" + message + "details: " + details);

//             });
//             // $.ajax({
//             //     type: "POST",
//             //     url: "https://us-central1-petezzie.cloudfunctions.net/addToCart",
//             //     data: `{
//             //         productId: id,
//             //         quantity: quantity.value,
//             //     }`,
//             //     success: function() {
//             //         console.log("Success");
//             //     },
//             //     dataType: "json"
//             // });
//         } else {
//             // User not logged in or has just logged out.
//             console.log("User not logged in to add to cart");
//         }
//     });

// }


// function buyNow() {
//     var id = document.body.id;
//     var quantity = document.getElementById("quantity");

//     // let db = firebase.firestore();

//     var functions = firebase.functions();

//     firebase.auth().onAuthStateChanged((user) => {
//         if (user) {
//             // User logged in already or has just logged in.
//             var addToCart = functions.httpsCallable("addToCart");
//             addToCart({
//                 productId: id,
//                 quantity: +quantity.value,
//             }).then((result) => {
//                 console.log(result.data);
//             }).catch((error) => {
//                 var code = error.code;
//                 var message = error.message;
//                 var details = console.error.details;

//                 console.error("code : " + code + "message:" + message + "details: " + details);

//             });
//             // $.ajax({
//             //     type: "POST",
//             //     url: "https://us-central1-petezzie.cloudfunctions.net/addToCart",
//             //     data: `{
//             //         productId: id,
//             //         quantity: quantity.value,
//             //     }`,
//             //     success: function() {
//             //         console.log("Success");
//             //     },
//             //     dataType: "json"
//             // });
//         } else {
//             // User not logged in or has just logged out.
//             console.log("User not logged in to add to cart");
//         }
//     });
// }
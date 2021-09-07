//To get the price form db


async function getPrice() {

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
    var priceElement = document.getElementById("discountedPrice");
    // var bodyId = document.getElementsByTagName("body")[0].id;
    var id = document.body.id;
    firebase.initializeApp({
        apiKey: "AIzaSyC5EHyg7Y5InbSGerMutlDBSrpRRQf3o5c",
        authDomain: "petezzie.firebaseapp.com",
        databaseURL: "https://petezzie.firebaseio.com",
        projectId: "petezzie",
        storageBucket: "petezzie.appspot.com",
        messagingSenderId: "232300058192",
        appId: "1:232300058192:web:d1868e4351b3142dd46355",
        measurementId: "G-8N4647EL3H"
    });
    let db = firebase.firestore();

    let product = await db.collection("Products").doc(id).get();
    document.getElementById("cartBtn").addEventListener("click", addToCart);
    document.getElementById("buyBtn").addEventListener("click", addToCart);

    console.log(product.data());

    if (product.data().isInStock) {
        if (product.data().isSale) {
            console.log(product.data().originalPrice);
            const sale = product.data().salePerc;
            const discountOff = (product.data().originalPrice * sale / 100);
            const finalprice = product.data().originalPrice - discountOff;
            document.getElementById("discountedPrice").innerHTML = "₹" + finalprice;
            document.getElementById("originalPrice").innerHTML = "₹" + product.data().originalPrice;
            document.getElementById("eachPrice").innerHTML = "₹" + product.data().eachPrice;
        } else {
            document.getElementById("discountedPrice").innerHTML = "₹" + product.data().originalPrice;
            document.getElementById("originalPrice").innerHTML = "";
            document.getElementById("eachPrice").innerHTML = product.data().eachPrice;
        }
    } else {
        document.getElementById("discountedPrice").innerHTML = "Currently Unavailable";
        document.getElementById("originalPrice").innerHTML = "";
        document.getElementById("eachPrice").innerHTML = "";
    }
}

console.log("IN file");

document.addEventListener('DOMContentLoaded', getPrice);
// const call = getPrice;



//For add to cart

function addToCart() {

    var id = document.body.id;
    var quantity = document.getElementById("quantity");

    // let db = firebase.firestore();

    var functions = firebase.functions();

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User logged in already or has just logged in.
            var addToCart = functions.httpsCallable("addToCart");
            addToCart({
                productId: id,
                quantity: +quantity.value,
            }).then((result) => {
                console.log(result.data);
            }).catch((error) => {
                var code = error.code;
                var message = error.message;
                var details = console.error.details;

                console.error("code : " + code + "message:" + message + "details: " + details);

            });
            // $.ajax({
            //     type: "POST",
            //     url: "https://us-central1-petezzie.cloudfunctions.net/addToCart",
            //     data: `{
            //         productId: id,
            //         quantity: quantity.value,
            //     }`,
            //     success: function() {
            //         console.log("Success");
            //     },
            //     dataType: "json"
            // });
        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
        }
    });

}


function buyNow() {
    var id = document.body.id;
    var quantity = document.getElementById("quantity");

    // let db = firebase.firestore();

    var functions = firebase.functions();

    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            // User logged in already or has just logged in.
            var addToCart = functions.httpsCallable("addToCart");
            addToCart({
                productId: id,
                quantity: +quantity.value,
            }).then((result) => {
                console.log(result.data);
            }).catch((error) => {
                var code = error.code;
                var message = error.message;
                var details = console.error.details;

                console.error("code : " + code + "message:" + message + "details: " + details);

            });
            // $.ajax({
            //     type: "POST",
            //     url: "https://us-central1-petezzie.cloudfunctions.net/addToCart",
            //     data: `{
            //         productId: id,
            //         quantity: quantity.value,
            //     }`,
            //     success: function() {
            //         console.log("Success");
            //     },
            //     dataType: "json"
            // });
        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
        }
    });
}
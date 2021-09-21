var totalPriceArray = {};
var discountArray = {};
var quantityArray = {};
var totalAmount = 0;
var discountedAmount = 0;
var finalAmount = 0;
var currentUser;



async function cart() {
    firebase.initializeApp({
        apiKey: "AIzaSyDHBFSULRYjuXw2YRE9lqxki2C_Cc7-s6A",
        authDomain: "petzieee.firebaseapp.com",
        databaseURL: "https://petzieee-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "petzieee",
        storageBucket: "petzieee.appspot.com",
        messagingSenderId: "779568120586",
        appId: "1:779568120586:web:a44924235200039dffb0f3",
        measurementId: "G-801X9K0951"
    }).functions('asia-east2');;
    let db = firebase.firestore();

    var totalItemHtml = document.getElementById("totalItems");

    var htmlCode = '<div class="row mb-4" id ="productId"> \
    <div class="col-md-5 col-lg-3 col-xl-3">\
      <div class="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">\
        <img class="img-fluid w-100"\
         id="productImage" src="../dp/image/dogf1.jpg" alt="Sample">\
        <a href="#!">\
          <div class="mask waves-effect waves-light">\
            <img class="img-fluid w-100"\
            id="productImage1" src="../dp/image/dogf1.jpg">\
            <div class="mask rgba-black-slight waves-effect waves-light"></div>\
          </div>\
        </a>\
      </div>\
    </div>\
    <div class="col-md-7 col-lg-9 col-xl-9">\
      <div>\
        <div class="d-flex justify-content-between">\
          <div>\
            <h5 id = "name">Blue denim shirt</h5>\
            <p class="mb-3 text-muted text-uppercase small" id="size"></p>\
            <p class="mb-2 text-muted text-uppercase small"></p>\
            <p class="mb-3 text-muted text-uppercase small" id = "isInStock"></p>\
          </div>\
          <div>\
            <div class="def-number-input number-input safari_only mb-0 w-100">\
              <button onclick="return quantityChange(false,this.parentNode.querySelector(\'input[type=number]\'))"\
                class="minus"></button>\
              <input class="quantity" min="0" name="quantity" value="1" type="number" id="quantity" min = 0 onchange = valueChanged(this.id,this.value)>\
              <button onclick="return quantityChange(true,this.parentNode.querySelector(\'input[type=number]\'))"\
                class="plus"></button>\
            </div>\
            <small id="passwordHelpBlock" class="form-text text-muted text-center">\
              (Note, 1 piece)\
            </small>\
          </div>\
        </div>\
        <div class="d-flex justify-content-between align-items-center">\
          <div>\
            <a type="button" class="card-link-secondary small text-uppercase mr-3" onclick = "return removeItemsFromCart(this.id)" id="removeButton"><i\
                class="fas fa-trash-alt mr-1"  ></i> Remove item </a>\
            <a type="button" class="card-link-secondary small text-uppercase"><i\
                class="fas fa-heart mr-1"></i> Move to wish list </a>\
          </div>\
          <p class="mb-0"><span><strong id ="price"><i class="fas fa-rupee-sign"></i> 540.99</strong></span></p>\
        </div>\
      </div>\
    </div>\
  </div>\
  <hr class="mb-4">';



    firebase.auth().onAuthStateChanged(async(user) => {
        currentUser = user;

        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }


        async function getProduct(productId, quantity) {

        }

        if (user) {

            await db.collection("CustomerInfo").doc(user.uid).collection("cart").get().then((qs) => {
                var totalItems = qs.size;
                totalItemHtml.innerHTML = totalItems;
                qs.forEach(async(element) => {
                    console.log(element.id, " => ", element.id);

                    var productId = element.id;
                    var quantity = element.data().quantity;
                    quantityArray[productId] = quantity;
                    await db.collection("Products").doc(productId).get().then((element) => {
                        $("#mainCartBody").append(htmlCode);
                        console.log("Poduct id : ", element.id);
                        document.getElementById("productImage").src = element.data().mainImage;
                        document.getElementById("productImage1").src = element.data().mainImage;
                        document.getElementById("name").innerHTML = element.data().name;
                        document.getElementById("size").innerHTML = element.data().size;
                        if (element.data().isInStock) {
                            document.getElementById("isInStock").innerHTML = "In Stock";
                        } else {
                            document.getElementById("isInStock").innerHTML = "Currently Unavialable";
                        }
                        document.getElementById("quantity").value = quantity;
                        var op = element.data().originalPrice;
                        var discount = op * element.data().salePerc / 100;
                        var finalPrice = (op - discount) * quantity;
                        document.getElementById("price").innerHTML = finalPrice;

                        totalPriceArray[element.id] = op - discount;

                        totalAmount = totalAmount + finalPrice;

                        discountArray[element.id] = discount;

                        discountedAmount = discountedAmount + discount;


                        var totalCost = totalAmount + discountedAmount;
                        console.log("totalPrice : ", totalAmount);
                        console.log("dicount: ", discountedAmount);
                        document.getElementById("totalCost").innerHTML = totalCost;
                        document.getElementById("totalDiscount").innerHTML = discountedAmount;
                        document.getElementById("finalCost").innerHTML = totalAmount;
                        //Change Id of the append Elements

                        document.getElementById("name").id = element.id + "name";
                        document.getElementById("productId").id = element.id;
                        document.getElementById("productImage").id = element.id + "productImage";
                        document.getElementById("productImage1").id = element.id + "productImage1";
                        document.getElementById("size").id = element.id + "size";
                        document.getElementById("isInStock").id = element.id + "isInStock";
                        document.getElementById("quantity").id = element.id + "quantity";
                        document.getElementById("price").id = element.id + "price";
                        document.getElementById("removeButton").id = element.id + "removeButton";
                        console.log("Completed first product");
                    });
                });
            });


            console.log("Totol Price Array : ", totalPriceArray);
            console.log("discount Array: ", discountArray);
            console.log("total Amount : ", totalAmount);
            console.log("dicounted Amount : ", discountArray);



        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
            alert("You are not logged in to add to cart");
        }
    });

}

document.addEventListener('DOMContentLoaded', cart);


async function removeItemsFromCart(botttonId) {
    console.log("Inside of the cart functions");
    var id = botttonId.replace("removeButton", '');
    var functions = firebase.functions();
    console.log("Id given is", id);
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            console.log("Inside of the cart functions");
            // User logged in already or has just logged in.
            var removeFromCart = functions.httpsCallable("removeFromCart");

            removeFromCart({
                productId: id,
            }).catch((error) => {
                var code = error.code;
                var message = error.message;
                var details = console.error.details;
                console.log("code : " + code + "message:" + message + "details: " + details);

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


async function quantityChange(isStepUp, doc) {
    if (isStepUp) {
        doc.stepUp();
        var qid = doc.id;
        var id = qid.replace("quantity", '');
        var fp = totalPriceArray[id];
        var dp = discountArray[id];
        // var currentquantity = document.getElementById(qid).value
        totalAmount = totalAmount + fp;
        discountedAmount = discountedAmount + dp;
        var totalCost = totalAmount + discountedAmount;
        quantityArray[id] = quantityArray[id] + 1;

        var productPrice = fp * quantityArray[id];

        document.getElementById("totalCost").innerHTML = totalCost;
        document.getElementById("totalDiscount").innerHTML = discountedAmount;
        document.getElementById("finalCost").innerHTML = totalAmount;

        const obj = document.getElementById(id + "price");
        animateValue(obj, Number(obj.innerHTML), productPrice, 500);
    } else {
        doc.stepDown();
        var qid = doc.id;
        var id = qid.replace("quantity", '');
        var fp = totalPriceArray[id];
        var dp = discountArray[id];
        quantityArray[id] = quantityArray[id] - 1;

        // var currentquantity = document.getElementById(qid).value
        if (quantityArray[id] >= 0) {
            totalAmount = totalAmount - fp;
            discountedAmount = discountedAmount - dp;
            var totalCost = totalAmount + discountedAmount;
            var productPrice = fp * quantityArray[id];

            document.getElementById("totalCost").innerHTML = totalCost;
            document.getElementById("totalDiscount").innerHTML = discountedAmount;
            document.getElementById("finalCost").innerHTML = totalAmount;
            const obj = document.getElementById(id + "price");
            animateValue(obj, Number(obj.innerHTML), productPrice, 500);
        }
    }
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}


function valueChanged(qid, value) {
    var id = qid.replace("quantity", '');
    var fp = totalPriceArray[id];
    var dp = discountArray[id];
    // var currentquantity = document.getElementById(qid).value
    quantityArray[id] = value;

    totalAmount = totalAmount - fp;
    discountedAmount = discountedAmount - dp;
    var totalCost = totalAmount + discountedAmount;
    var productPrice = fp * quantityArray[id];
    document.getElementById("totalCost").innerHTML = totalCost;
    document.getElementById("totalDiscount").innerHTML = discountedAmount;
    document.getElementById("finalCost").innerHTML = totalAmount;
    const obj = document.getElementById(id + "price");
    animateValue(obj, Number(obj.innerHTML), productPrice, 500);
}





document.getElementById('checkout').onclick = async function(e) {

    // var x;
    // var totalPrice = 0;
    const userId = "GVyUWRXPPnUcnD6hKNXh2efmrxR2";
    // var db = firebase.firestore();

    // var ref = await db.collection("CustomerInfo").doc(currentUser.id).collection("orders").doc();
    // var ref = db.collection("CustomerInfo").doc(userId).collection("orders").doc();

    // if (true) {
    //     // console.log("is if", userId);
    //     return await db.collection("CustomerInfo").doc(userId).collection("cart").get().then(async(qs) => {
    //         // console.log(qs, qs.doc);
    //         for(element of qs.docs){

    //             console.log("Element ud", element.id);
    //             console.log("Element", element);
    //             await db.collection("CustomerInfo").doc(userId).collection("orders").doc(ref.id).collection("products").doc(element.id).set(element.data());
    //             await db.collection("Products").doc(element.id).get().then((value) => {
    //                 var op = value.data().originalPrice;
    //                 var discount = op * value.data().salePerc / 100;
    //                 var finalPrice = (op - discount) * element.data().quantity;
    //                 totalPrice = totalPrice + finalPrice;
    //             });


    //         };
    //         console.log("Total Amount", totalPrice);


    //         // var options = {
    //         //     amount: totalPrice, // amount in the smallest currency unit
    //         //     currency: "INR",
    //         //     receipt: ref.id,
    //         // };
    //         // var temp = instance.orders;
    //         // await temp.create(options, function(err, order) {
    //         //     console.log(JSON.stringify(order));
    //         //     // console.log("returning to the function");
    //         //     db.collection("CustomerInfo").doc(userId).collection("orders").doc(ref.id).update({
    //         //         "orderId": order.body.id,
    //         //         "amount": totalPrice,
    //         //         "status": "created"
    //         //     });
    //         //     x = (JSON.stringify(order));
    //         // });
    //         console.log("x is ", x);

    //     });


    // } else {

    //     return Error;
    // }



    var db = firebase.firestore();

    // var ref = await db.collection("CustomerInfo").doc(currentUser.id).collection("orders").doc();
    var functions = firebase.functions();

    var razorpay = functions.httpsCallable("razorpay");

    await razorpay({
            isCart: true,
        })
        .then((res) => {
            result = JSON.parse(res.data);
            console.log("resule", result);
            var options = {
                "key": "rzp_test_EQavvp4sNxxG6W", // Enter the Key ID generated from the Dashboard
                "amount": "10000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Acme Corp",
                "description": "Test Transaction",
                "image": "https://petziee-dev.web.app/image/sanji.png",
                "order_id": result.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                "handler": async function(response) {
                    console.log(response);
                    alert(response.razorpay_payment_id);
                    alert(response.razorpay_order_id);
                    alert(response.razorpay_signature);

                    var confirmPayment = functions.httpsCallable("confirmPayment");
                    await confirmPayment({
                        razorpay_order_id: result.id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        id: result.receipt,
                    }).then((value) => {
                        if (value) {
                            alert("Payment Successfull");
                        } else {
                            alert("Payment Unsuccessfull");
                        }
                    });
                },
                "prefill": {
                    "name": "Gaurav Kumar",
                    "email": "gaurav.kumar@example.com",
                    "contact": "9999999999"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                }
            };
            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function(response) {
                alert(response.error.code);
                alert(response.error.description);
                alert(response.error.source);
                alert(response.error.step);
                alert(response.error.reason);
                alert(response.error.metadata.order_id);
                alert(response.error.metadata.payment_id);
            });
            rzp1.open();
            e.preventDefault();
        });


}



// order_Hz3QRoIwEw0dj7
// order_Hz3QRoIwEw0dj7
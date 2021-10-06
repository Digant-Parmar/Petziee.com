document.getElementById('paynow').onclick = async function(e) {
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
    $('#lottie').css('display', '');

    await razorpay({
            isCart: true,
        })
        .then((res) => {
            $('#lottie').css('display', 'none');
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


document.addEventListener('DOMContentLoaded', getInfo);

function getInfo() {
    firebase.initializeApp({
        apiKey: "AIzaSyDHBFSULRYjuXw2YRE9lqxki2C_Cc7-s6A",
        authDomain: "petzieee.firebaseapp.com",
        databaseURL: "https://petzieee-default-rtdb.asia-southeast1.firebasedatabase.app",
        projectId: "petzieee",
        storageBucket: "petzieee.appspot.com",
        messagingSenderId: "779568120586",
        appId: "1:779568120586:web:a44924235200039dffb0f3",
        measurementId: "G-801X9K0951"
    })
    getAddresses();
    cart();
}

async function getAddresses() {




    // <h5 class="mb-4" id="others">Other addresses</h5>

    // <div class="label">
    //     <input type="radio" id="html" name="fav_language" value="HTML">   <label for="html">First Address</label>
    // </div>

    // <div class="label">
    //     <input type="radio" id="html" name="fav_language" value="HTML">   <label for="html">Second Address</label>
    // </div>

    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(async(user) => {
        var userId = user.uid;
        const qs = await db.collection("CustomerInfo").doc(userId).collection("addresses").get();
        if (qs.size) {
            var inital = '<h5 class="mb-4">Choose an Addresses</h5>';
            await $('#addresses').append(inital);
            qs.forEach(docs => {
                var temp = '<div class="label">';
                var add = docs.data();
                temp = temp + '<input type="radio" name="addrRadio" value = ' + docs.id + ' id=' + docs.id + '>';
                temp = temp + '<label for=' + docs.id + '><strong>' + add.firstName + '</strong></label>'
                temp = temp + '<label for=' + docs.id + '><strong>' + add.lastName + '</strong></label>   '
                temp = temp + '<label for=' + docs.id + '><strong>          ' + add.phone + '</strong></label><br>'
                temp = temp + '<label for=' + docs.id + '>' + add.email + '</label><br>'
                if (add.add1 != "") temp = temp + '<label for=' + docs.id + '>' + add.add1 + '</label><br>';
                if (add.add2 != "") temp = temp + '<label for=' + docs.id + '>' + add.add2 + '</label><br>';
                if (add.landmark != "") temp = temp + '<label for=' + docs.id + '>' + add.firstName + '</label><br>';

                temp = temp + '<label for=' + docs.id + '>' + add.city + ',</label>';
                temp = temp + '<label for=' + docs.id + '>' + add.state + '-</label>';
                temp = temp + '<label for=' + docs.id + '>' + add.pin + '</label><br>'
                temp = temp + '</div>'
                $('#addresses').append(temp);
            });
        } else {
            console.log("most recent Addresses doesnt exits");
            var inital = '<h5 class="mb-4">No Addresses found please all an Address</h5>';
            await $('#addresses').append(inital);

        }

    });
}



async function cart() {
    let db = firebase.firestore();
    var totalItemHtml = document.getElementById("totalItems");

    //     var htmlCode = '<div class="row mb-4" id ="productId"> \
    //     <div class="col-md-5 col-lg-3 col-xl-3">\
    //       <div class="view zoom overlay z-depth-1 rounded mb-3 mb-md-0">\
    //         <img class="img-fluid w-100"\
    //          id="productImage" src="../dp/image/dogf1.jpg" alt="Sample">\
    //         <a href="#!">\
    //           <div class="mask waves-effect waves-light">\
    //             <img class="img-fluid w-100"\
    //             id="productImage1" src="../dp/image/dogf1.jpg">\
    //             <div class="mask rgba-black-slight waves-effect waves-light"></div>\
    //           </div>\
    //         </a>\
    //       </div>\
    //     </div>\
    //     <div class="col-md-7 col-lg-9 col-xl-9">\
    //       <div>\
    //         <div class="d-flex justify-content-between">\
    //           <div>\
    //             <h5 id = "name">Blue denim shirt</h5>\
    //             <p class="mb-3 text-muted text-uppercase small" id="size"></p>\
    //             <p class="mb-2 text-muted text-uppercase small"></p>\
    //             <p class="mb-3 text-muted text-uppercase small" id = "isInStock"></p>\
    //           </div>\
    //           <div>\
    //             <div class="def-number-input number-input safari_only mb-0 w-100">\
    //               <button onclick="return quantityChange(false,this.parentNode.querySelector(\'input[type=number]\'))"\
    //                 class="minus"></button>\
    //               <input class="quantity" min="0" name="quantity" value="1" type="number" id="quantity" min = 0 onchange = valueChanged(this.id,this.value)>\
    //               <button onclick="return quantityChange(true,this.parentNode.querySelector(\'input[type=number]\'))"\
    //                 class="plus"></button>\
    //             </div>\
    //             <small id="passwordHelpBlock" class="form-text text-muted text-center">\
    //               (Note, 1 piece)\
    //             </small>\
    //           </div>\
    //         </div>\
    //         <div class="d-flex justify-content-between align-items-center">\
    //           <div>\
    //             <a type="button" class="card-link-secondary small text-uppercase mr-3" onclick = "return removeItemsFromCart(this.id)" id="removeButton"><i\
    //                 class="fas fa-trash-alt mr-1"  ></i> Remove item </a>\
    //             <a type="button" class="card-link-secondary small text-uppercase"><i\
    //                 class="fas fa-heart mr-1"></i> Move to wish list </a>\
    //           </div>\
    //           <p class="mb-0"><span><strong id ="price"><i class="fas fa-rupee-sign"></i> 540.99</strong></span></p>\
    //         </div>\
    //       </div>\
    //     </div>\
    //   </div>\
    //   <hr class="mb-4">';


    var priceWithDiscountArray = {};
    var discountArray = {};
    var quantityArray = {};
    var totalDiscountArray = {}

    var totalAmountWithDiscountAndQuantity = 0;
    var discountedAmount = 0;
    var totalCostWithoutDiscount = 0;

    firebase.auth().onAuthStateChanged(async(user) => {
        currentUser = user;



        if (user) {

            await db.collection("CustomerInfo").doc(user.uid).collection("cart").get().then((qs) => {
                qs.forEach(async(element) => {
                    // console.log(element.id, " => ", element.id);

                    var productId = element.id;
                    var quantity = element.data().quantity;
                    quantityArray[productId] = quantity;
                    await db.collection("Products").doc(productId).get().then((element) => {
                        // $("#mainCartBody").append(htmlCode);
                        console.log("Poduct id : ", element.id);
                        // document.getElementById("productImage").src = element.data().mainImage;
                        // document.getElementById("productImage1").src = element.data().mainImage;
                        // document.getElementById("name").innerHTML = element.data().name;
                        // document.getElementById("size").innerHTML = element.data().size;
                        if (element.data().isInStock) {
                            var op = element.data().originalPrice;
                            var discount = op * element.data().salePerc / 100;
                            //dicount = productdiscount withiut quantity
                            var finalPrice = (op - discount) * quantity;
                            //finalPrice = price with discount and quantity

                            // document.getElementById("price").innerHTML = finalPrice;

                            //priceWithDiscountArray = array without quantity
                            priceWithDiscountArray[element.id] = op - discount;

                            totalAmountWithDiscountAndQuantity = totalAmountWithDiscountAndQuantity + finalPrice;
                            //discountArray only the discount without quntity
                            discountArray[element.id] = discount;

                            //discountammount  = overall discount with product quantity
                            discountedAmount = discountedAmount + discount * quantity;
                            //totalDiscountArray  = product discount with quantity
                            totalDiscountArray[element.id] = discount * quantity;


                            totalCostWithoutDiscount = totalCostWithoutDiscount + discount * quantity + finalPrice;

                            document.getElementById("totalCost").innerHTML = totalCostWithoutDiscount;
                            document.getElementById("totalDiscount").innerHTML = discountedAmount;
                            document.getElementById("finalCost").innerHTML = totalAmountWithDiscountAndQuantity;
                            //Change Id of the append Elements

                            // document.getElementById("name").id = element.id + "name";
                            // document.getElementById("productId").id = element.id;
                            // document.getElementById("productImage").id = element.id + "productImage";
                            // document.getElementById("productImage1").id = element.id + "productImage1";
                            // document.getElementById("size").id = element.id + "size";
                            // document.getElementById("isInStock").id = element.id + "isInStock";
                            // document.getElementById("quantity").id = element.id + "quantity";
                            // document.getElementById("price").id = element.id + "price";
                            // document.getElementById("removeButton").id = element.id + "removeButton";

                            console.log("Completed first product");
                        }
                        // document.getElementById("quantity").value = quantity;
                        //Original price = op

                    });
                });
            });


            console.log("priceWithDiscountArray : ", priceWithDiscountArray);
            console.log("discount Array: ", discountArray);
            console.log("Quantity Price Array : ", quantityArray);




        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
            alert("You are not logged in to add to cart");
        }
    });

}
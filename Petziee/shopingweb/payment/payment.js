document.getElementById('paynow').onclick = async function(e) {
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
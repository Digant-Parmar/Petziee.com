function onScriptLoad() {
    firebase.initializeApp({
        apiKey: "AIzaSyDHBFSULRYjuXw2YRE9lqxki2C_Cc7-s6A",
        authDomain: "petzieee.firebaseapp.com",
        projectId: "petzieee",
        storageBucket: "petzieee.appspot.com",
        messagingSenderId: "779568120586",
        appId: "1:779568120586:web:3e5e2e3ff2746a1bffb0f3",
        measurementId: "G-ZNDJHXSXES"
    });
    var functions = firebase.functions();
    var removeFromCart = functions.httpsCallable("paymentRequest");
    removeFromCart().then((value) => {
        console.log("Value id ", value);
    }).catch((error) => {
        var code = error.code;
        var message = error.message;
        var details = console.error.details;
        console.log("code : " + code + "message:" + message + "details: " + details);
    });


    // removeFromCart().catch((error) => {
    //     var code = error.code;
    //     var message = error.message;
    //     var details = console.error.details;
    //     console.log("code : " + code + "message:" + message + "details: " + details);
    // });

    //Check if CheckoutJS is available
    // if (window.Paytm && window.Paytm.CheckoutJS) {

    //     //Add callback function to CheckoutJS onLoad function
    //     window.Paytm.CheckoutJS.onLoad(function excecuteAfterCompleteLoad() {
    //         //Config
    //         var config = {
    //             flow: "DEFAULT",
    //             hidePaymodeLabel: true,
    //             data: {
    //                 orderId: "1",
    //                 amount: 1,
    //                 token: "token",
    //                 tokenType: "TXN_TOKEN"
    //             },
    //             merchant: {
    //                 mid: "AOTaKS60821089230337"
    //             },
    //             handler: {
    //                 notifyMerchant: function(eventType, data) {
    //                     console.log("notify merchant called", eventType, data);
    //                 }
    //             }
    //         };

    //         //Create elements instance
    //         var elements = window.Paytm.CheckoutJS.elements(config);
    //         //Create card element
    //         var cardElement = elements.createElement(window.Paytm.CheckoutJS.ELEMENT_PAYMODE.CARD, {
    //             root: "#card",
    //             style: {
    //                 bodyBackgroundColor: "blue"
    //             }
    //         });
    //         //Render element
    //         cardElement.invoke();
    //     });
    // }
}
document.addEventListener('DOMContentLoaded', onScriptLoad);
var priceWithDiscountArray = {};
var discountArray = {};
var quantityArray = {};
var totalDiscountArray = {}

var totalAmountWithDiscountAndQuantity = 0;
var discountedAmount = 0;
var totalCostWithoutDiscount = 0;



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
              <input class="quantity" min="1" name="quantity" value="1" type="number" id="quantity" min = 0 onchange = valueChanged(this.id,this.value) oninput = "return this.onchange()">\
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
          <p class="mb-0"><span><strong><i class="fas fa-rupee-sign"></strong></i> <strong id ="price"></strong></span></p>\
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
                        //Original price = op
                        var op = element.data().originalPrice;
                        var discount = op * element.data().salePerc / 100;
                        //dicount = productdiscount withiut quantity
                        var finalPrice = (op - discount) * quantity;
                        //finalPrice = price with discount and quantity

                        document.getElementById("price").innerHTML = finalPrice;

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


            console.log("priceWithDiscountArray : ", priceWithDiscountArray);
            console.log("discount Array: ", discountArray);
            console.log("Quantity Price Array : ", quantityArray);




        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
            // window.location.assign("https://petzieee.web.app/login/login.html");
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
    var quantitydoc = document.getElementById(doc.id);
    if (isStepUp) {
        doc.stepUp();
        var qid = doc.id;
        var id = qid.replace("quantity", '');
        var fp = priceWithDiscountArray[id];
        var dp = discountArray[id];
        // var currentquantity = document.getElementById(qid).value
        totalAmountWithDiscountAndQuantity = totalAmountWithDiscountAndQuantity + fp;
        discountedAmount = discountedAmount + dp;
        totalCostWithoutDiscount = totalCostWithoutDiscount + dp + fp;
        quantityArray[id] = quantityArray[id] + 1;
        totalDiscountArray[id] = totalDiscountArray[id] + dp;

        var productPrice = fp * quantityArray[id];

        document.getElementById("totalCost").innerHTML = totalCostWithoutDiscount;
        document.getElementById("totalDiscount").innerHTML = discountedAmount;
        document.getElementById("finalCost").innerHTML = totalAmountWithDiscountAndQuantity;

        const obj = document.getElementById(id + "price");
        animateValue(obj, Number(obj.innerHTML), productPrice, 500);
    } else {
        if (quantitydoc.value > 1) {
            doc.stepDown();
            var qid = doc.id;
            var id = qid.replace("quantity", '');
            var fp = priceWithDiscountArray[id];
            var dp = discountArray[id];

            // var currentquantity = document.getElementById(qid).value

            quantityArray[id] = quantityArray[id] - 1;

            totalAmountWithDiscountAndQuantity = totalAmountWithDiscountAndQuantity - fp;
            discountedAmount = discountedAmount - dp;
            var productPrice = fp * quantityArray[id];
            totalDiscountArray[id] = totalDiscountArray[id] - dp;
            totalCostWithoutDiscount = totalCostWithoutDiscount - dp - fp;



            document.getElementById("totalCost").innerHTML = totalCostWithoutDiscount;
            document.getElementById("totalDiscount").innerHTML = discountedAmount;
            document.getElementById("finalCost").innerHTML = totalAmountWithDiscountAndQuantity;
            const obj = document.getElementById(id + "price");
            animateValue(obj, Number(obj.innerHTML), productPrice, 500);

        }
    }
    console.log("Quantity Price Array : ", quantityArray);

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
    if (value > 0) {
        console.log("initial discount: ", totalCost);
        console.log("initial totalamount: ", discountedAmount);

        var id = qid.replace("quantity", '');
        var pwd = priceWithDiscountArray[id];
        var dp = discountArray[id];
        // var currentquantity = document.getElementById(qid).value
        var initialQuantity = quantityArray[id];
        quantityArray[id] = Number(value);

        totalAmountWithDiscountAndQuantity = totalAmountWithDiscountAndQuantity + pwd * (quantityArray[id] - initialQuantity);
        var x = 0;
        x = x - totalDiscountArray[id];
        x = x + (dp * quantityArray[id]);
        discountedAmount = discountedAmount + x;
        var productPrice = pwd * quantityArray[id];

        totalCostWithoutDiscount = totalCostWithoutDiscount + (pwd + dp) * (quantityArray[id] - initialQuantity);
        totalDiscountArray[id] = dp * quantityArray[id];

        document.getElementById("totalCost").innerHTML = totalCostWithoutDiscount;
        document.getElementById("totalDiscount").innerHTML = discountedAmount;
        document.getElementById("finalCost").innerHTML = totalAmountWithDiscountAndQuantity;
        const obj = document.getElementById(id + "price");
        console.log("Quantity Price Array : ", quantityArray);

        animateValue(obj, Number(obj.innerHTML), productPrice, 500);
    }
}





// order_Hz3QRoIwEw0dj7
// order_Hz3QRoIwEw0dj7
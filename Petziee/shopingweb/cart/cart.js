async function cart() {
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
              <button onclick="this.parentNode.querySelector(\'input[type=number]\').stepDown()"\
                class="minus"></button>\
              <input class="quantity" min="0" name="quantity" value="1" type="number" id="quantity">\
              <button onclick="this.parentNode.querySelector(\'input[type=number]\').stepUp()"\
                class="plus"></button>\
            </div>\
            <small id="passwordHelpBlock" class="form-text text-muted text-center">\
              (Note, 1 piece)\
            </small>\
          </div>\
        </div>\
        <div class="d-flex justify-content-between align-items-center">\
          <div>\
            <a href="#!" type="button" class="card-link-secondary small text-uppercase mr-3"><i\
                class="fas fa-trash-alt mr-1"></i> Remove item </a>\
            <a href="#!" type="button" class="card-link-secondary small text-uppercase"><i\
                class="fas fa-heart mr-1"></i> Move to wish list </a>\
          </div>\
          <p class="mb-0"><span><strong id ="price"><i class="fas fa-rupee-sign"></i> 540.99</strong></span></p>\
        </div>\
      </div>\
    </div>\
  </div>\
  <hr class="mb-4">';



    firebase.auth().onAuthStateChanged(async(user) => {
        function removeAllChildNodes(parent) {
            while (parent.firstChild) {
                parent.removeChild(parent.firstChild);
            }
        }

        var totalPriceArray = {};
        var discountArray = {};
        var totalAmount = 0;
        var discountedAmount = 0;
        async function getProduct(productId, quantity) {
            db.collection("Products").doc(productId).get().then((element) => {
                $("#mainCartBody").append(htmlCode);
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

                console.log("totalPrice : ", totalAmount);
                console.log("dicount: ", discountedAmount);
                document.getElementById("totalCost").innerHTML = totalAmount;
                document.getElementById("totalDiscount").innerHTML = discountedAmount;
                document.getElementById("finalCost").innerHTML = totalAmount;
                //Change Id of the append Elements

                document.getElementById("productId").id = element.id;
                document.getElementById("productImage").id = element.id + "productImage";
                document.getElementById("productImage1").id = element.id + "productImage1";
                document.getElementById("size").id = element.id + "size";
                document.getElementById("isInStock").id = element.id + "isInStock";
                document.getElementById("quantity").id = element.id + "quantity";
                document.getElementById("price").id = element.id + "price";

            });
        }

        if (user) {

            await db.collection("CustomerInfo").doc(user.uid).collection("cart").get().then((qs) => {
                var totalItems = qs.size;
                totalItemHtml.innerHTML = totalItems;
                qs.forEach(async(element) => {
                    console.log(element.id, " => ", element.id);
                    await getProduct(element.id, element.data().quantity);
                });
            });



        } else {
            // User not logged in or has just logged out.
            console.log("User not logged in to add to cart");
        }
    });

}

document.addEventListener('DOMContentLoaded', cart);
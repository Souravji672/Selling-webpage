let cart = [];
let allProducts = [];

// LOAD PRODUCTS
async function loadProducts() {
  let res = await fetch("/api/products");
  let products = await res.json();

  allProducts = products;
  showProducts(products);
}

// SHOW PRODUCTS
function showProducts(products){
  let container = document.getElementById("products");
  container.innerHTML = "";

  products.forEach(p => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart('${p._id}')">🛒 Add to Cart</button>
      </div>
      `;
    });
    if(products.length === 0){
    container.innerHTML = "<h2>No products found 😢</h2>";
    return;
}
}

// ADD TO CART
function addToCart(id) {
  let item = cart.find(p => p.id === id);

  if(item){
    item.qty++;
  } else {
    cart.push({id:id, qty:1});
  }

  updateCart();
}

// UPDATE CART
function updateCart(){
  document.getElementById("count").innerText =
    cart.reduce((sum,i)=>sum+i.qty,0);

  let cartBox = document.getElementById("cartItems");
  cartBox.innerHTML = "";

  let total = 0;

  cart.forEach(item=>{
    let product = allProducts.find(p=>p._id === item.id);

    if(!product) return;

    total += product.price * item.qty;

    cartBox.innerHTML += `
      <div class="cart-item">
        <h4>${product.name}</h4>
        <p>₹${product.price} x ${item.qty}</p>

        <button onclick="increase('${item.id}')">+</button>
        <button onclick="decrease('${item.id}')">-</button>
        <button onclick="removeItem('${item.id}')">Remove</button>
      </div>
    `;
  });

  document.getElementById("total").innerText = total;
}

// increase
function increase(id){
  let item = cart.find(p=>p.id===id);
  item.qty++;
  updateCart();
}

// decrease
function decrease(id){
  let item = cart.find(p=>p.id===id);
  item.qty--;

  if(item.qty <= 0){
    cart = cart.filter(p=>p.id!==id);
  }

  updateCart();
}

// remove
function removeItem(id){
  cart = cart.filter(p=>p.id!==id);
  updateCart();
}

// CHECKOUT
function checkout() {
  if(cart.length === 0){
    alert("Cart empty!");
    return;
  }

  alert("Order placed successfully 🎉");
  cart = [];
  updateCart();
}

// SEARCH
document.getElementById("search").addEventListener("input", (e) => {
  let value = e.target.value.toLowerCase();

  let filtered = allProducts.filter(p =>
    p.name.toLowerCase().includes(value)
  );

  showProducts(filtered);
});

// ADD PRODUCT
async function addProduct(){
  let name = document.getElementById("pname").value;
  let price = document.getElementById("pprice").value;
  let image = document.getElementById("pimage").files[0];

  let formData = new FormData();
  formData.append("name", name);
  formData.append("price", price);
  formData.append("image", image);

  await fetch("/api/products",{
    method:"POST",
    body: formData
  });

  alert("Product added 🔥");
  loadProducts();
}

// INIT
loadProducts();
if(token){
  document.querySelector(".admin").style.display = "block";
}else{
  document.querySelector(".admin").style.display = "none";
}
const Order = mongoose.model("Order",{
  items:Array,
  total:Number,
  date:{type:Date,default:Date.now}
});
app.post("/api/order", async (req,res)=>{
  let order = new Order(req.body);
  await order.save();
  res.json({msg:"Order saved"});
});
function sortLow(){
  let sorted = [...allProducts].sort((a,b)=>a.price-b.price);
  showProducts(sorted);
}
container.innerHTML = "<h2>Loading... ⏳</h2>";
app.get("/api/products", async (req,res)=>{
  let page = req.query.page || 1;
  let limit = 6;

  let products = await Product.find()
    .skip((page-1)*limit)
    .limit(limit);

  res.json(products);
});
function addToWishlist(id){
  let list = JSON.parse(localStorage.getItem("wish")) || [];

  if(!list.includes(id)){
    list.push(id);
  }

  localStorage.setItem("wish", JSON.stringify(list));
  showToast("Added to wishlist ❤️");
}
app.get("/api/orders", async (req,res)=>{
  let orders = await Order.find();
  res.json(orders);
});
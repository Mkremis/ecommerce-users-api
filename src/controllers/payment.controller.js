import mercadopago from "mercadopago";
import { MERCADOPAGO_API_KEY } from "../config.js";
import { cartUpdate } from "../services/cart.services.js";
import { registerSale } from "../services/payment.services.js";

export const createOrder = async (req, res) => {
  const username = req.user.login_username;
  const order = req.body.cart;
  let cartItems = [];
  for (const key in order) {
    let obj = {};
    obj.id = key;
    obj.category_id = order[key]["gender"];
    obj.picture_url = `https://${order[key]["prodImage"]}`;
    obj.title = order[key]["prodName"];
    obj.quantity = parseInt(order[key]["productQ"]);
    obj.currency_id = "USD";
    obj.unit_price = parseFloat(order[key]["prodPrice"]);
    cartItems.push(obj);
  }
  mercadopago.configure({
    access_token: MERCADOPAGO_API_KEY,
  });
  try {
    console.log("cartItems", cartItems);
    const result = await mercadopago.preferences.create({
      items: cartItems,
      back_urls: {
        success: `https://mkremis.github.io/ecommerce-react/#/success-payment`,
        pending:
          "https://ecommerce-users-api-production.up.railway.app/api/pending",
        failure:
          "https://ecommerce-users-api-production.up.railway.app/api/failure",
      },
      notification_url: `https://ecommerce-users-api-production.up.railway.app/api/webhook/${username}`,
    });
    if (result) return res.status(200).json(result.body);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const receiveWebhook = async (req, res) => {
  console.log("receiveWebhook");
  const payment = req.query;
  const { username } = req.params;
  if (payment.type === "payment") {
    res.status(200).send("HTTP STATUS 200 (OK)");
    const data = await mercadopago.payment.findById(payment["data.id"]);
    console.log("PAYMENT");
    await registerSale(
      data.body.additional_info.items,
      username,
      data.body.date_approved,
      "mercadopago"
    );
    console.log("PAYMENT OK!!");
    await cartUpdate({ username, cart: {} });
  }
};

export const success = async (req, res) => {
  console.log("success!");
};
export const failure = (req, res) => {
  console.log("Failure!");
};
export const pending = (req, res) => {
  console.log("Pending..");
};

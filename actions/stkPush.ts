"use server";

import axios from "axios";
import { Console } from "console";

interface Params {
  mpesa_number: string;
  name: string;
  amount: number;
}

export const sendStkPush = async (body: Params) => {
  //const mpesaEnv = process.env.MPESA_ENVIRONMENT;
  //const MPESA_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"//
    
  const { mpesa_number: phoneNumber, name, amount } = body;
  try {
    //generate authorization token
    const auth: string = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const resp = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    );

    const token = resp.data.access_token;

    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    const formattedPhone = `254${cleanedNumber.slice(-9)}`;

    const date = new Date();
    const timestamp =
      date.getFullYear() +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      ("0" + date.getDate()).slice(-2) +
      ("0" + date.getHours()).slice(-2) +
      ("0" + date.getMinutes()).slice(-2) +
      ("0" + date.getSeconds()).slice(-2);

    const password: string = Buffer.from(
      process.env.MPESA_SHORTCODE! + process.env.MPESA_PASSKEY + timestamp
    ).toString("base64");
    
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline", //Replace with CustomerBuyGoodsOnline for Till
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_PARTY_B,
        PhoneNumber: formattedPhone,
        CallBackURL: "https://mydomain.com/callback-url-path",
        AccountReference: "test-account",
        TransactionDesc: "Your payment intent goes here",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return { data: response.data };
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
      return { error: error.message };
    }
    return { error: "Something wrong happened" };
  }
};



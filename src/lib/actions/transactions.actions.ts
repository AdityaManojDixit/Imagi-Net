'use server';
import { metadata } from '@/app/layout';
import { creditFee } from '@/constants';
import { redirect } from 'next/navigation';
import Razorpay from 'razorpay';
import { connectToDatabase } from '../db/mongoose';
import { handleError } from '../utils';
import Transaction from '../db/models/transaction.model';
import { updateCredits } from './user.actions';

//Payments Handler Method
export async function checkoutCredits(transaction : CheckoutTransactionParams){
    const instance = new Razorpay({
        key_id: 'rzp_test_RFWH0xxIaAmyaS',
        key_secret: 'y0BikLjcSX4VMV2cT29vH7Yc',
    });
    const amount = Number(transaction.amount)*100
    var options = {
        amount: amount,  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        receipt: "order_rcptid_11",
        partial_payment: false,
        first_payment_min_amount: amount,
        note_key: {
            product_data: {
                name: transaction.plan
            },
            metadata: {
                plan: transaction.plan,
                credits: transaction.credits,
                buyerId: transaction.buyerId
            },
            mode:"payment"
        },
    };
    
    instance.orders.create(options, function(err, order) {
        console.log(order);
    });
    redirect(session.URL)
}

//Method to create Transaction in database
export async function createTransaction(transaction : CreateTransactionParams){
    try{
        await connectToDatabase();
        //Create new transaction with buyerID
        const newTransaction = await Transaction.create({
            ...transaction, buyer: transaction.buyerId
        })
        await updateCredits(transaction.buyerId, transaction.credits);
        return JSON.parse(JSON.stringify(newTransaction));
    } catch(error) {
        handleError(error);
    }
}
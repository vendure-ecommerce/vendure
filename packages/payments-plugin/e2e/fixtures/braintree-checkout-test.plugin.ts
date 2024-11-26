/* eslint-disable */
import { Controller, Res, Get, Post, Body } from '@nestjs/common';
import { PluginCommonModule, VendurePlugin } from '@vendure/core';
import { Response } from 'express';

import { exposedClientToken, exposedShopClient } from '../braintree-dev-server';
import {
    AddPaymentToOrderMutation,
    AddPaymentToOrderMutationVariables,
} from '../graphql/generated-shop-types';
import { ADD_PAYMENT } from '../graphql/shop-queries';
/**
 * This test controller returns the Braintree drop-in checkout page
 * with the client secret generated by the dev-server
 */
@Controller()
export class BraintreeTestCheckoutController {
    @Get('checkout')
    async client(@Res() res: Response): Promise<void> {
        res.send(`
<head>
  <title>Checkout</title>
  <script src="https://js.braintreegateway.com/web/dropin/1.33.3/js/dropin.min.js"></script>
</head>
<html>


<select id="currency">
    <option value="USD">USD</option>
    <option value="EUR">EUR</option>
    <option value="GBP">GBP</option>
</select>
<label for="currency">
If you are using merchantAccountId, the checkout currency here must match the currency used for clientToken generation.
</label>

<div id="dropin-container"></div>
<button id="submit-button">Purchase</button>
<div id="result"/>

<script>    

    var currencySelector = document.querySelector('#currency');
    var submitButton = document.querySelector('#submit-button');

    braintree.dropin.create({
        authorization: "${exposedClientToken}",
        container: '#dropin-container',
        dataCollector: true,
        paypal: {
            flow: 'checkout',
            amount: 100,
            currency: 'USD',
        },
    }, function (err, dropinInstance) {

        submitButton.addEventListener('click', function () {
            dropinInstance.requestPaymentMethod(async function (err, payload) {
                sendPayloadToServer(payload)
            });
        });

        currencySelector.addEventListener("change", (event) => {
            dropinInstance.updateConfiguration('paypal', 'currency', event.target.value);
            console.log(event.target)
        });

        if (dropinInstance.isPaymentMethodRequestable()) {
            // This will be true if you generated the client token
            // with a customer ID and there is a saved payment method
            // available to tokenize with that customer.
            submitButton.removeAttribute('disabled');
        }

        dropinInstance.on('paymentMethodRequestable', function (event) {
            console.log(event.type); // The type of Payment Method, e.g 'CreditCard', 'PayPalAccount'.
            console.log(event.paymentMethodIsSelected); // true if a customer has selected a payment method when paymentMethodRequestable fires
            submitButton.removeAttribute('disabled');
        });

        dropinInstance.on('noPaymentMethodRequestable', function () {
            submitButton.setAttribute('disabled', true);
        });
    });

    async function sendPayloadToServer(payload) {
        const response = await fetch('checkout', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',       
                'Credentials': 'include',
            },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .catch(err => console.error(err))

        document.querySelector('#result').innerHTML = JSON.stringify(response)
        
    }
</script>

</html>
    `);
    }
    /**
     * This method handles the payment result from the Braintree drop-in page.
     * The `paymentResult` body is created with a normal clientToken by the drop-in UI, which takes the order's currency in consideration.
     */
    @Post('checkout')
    async handlePayment(@Body() paymentResult: Request, @Res() res: Response): Promise<void> {
        const { addPaymentToOrder } = await exposedShopClient.query<
            AddPaymentToOrderMutation,
            AddPaymentToOrderMutationVariables
        >(ADD_PAYMENT, {
            input: {
                method: 'braintree-payment-method',
                metadata: paymentResult,
            },
        });

        res.send(addPaymentToOrder);
    }
}

/**
 * Test plugin for serving the Braintree drop-in page and handling the payment
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [BraintreeTestCheckoutController],
})
export class BraintreeTestPlugin {}

'use server';

import { PaypalOrderStatusResponse } from "@/interfaces";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const paypalCheckPayment = async (paypalTrasactionId: string) => {

    const authToken = await getPaypalBearerToken();

    if (!authToken) {
        return {
            ok: false,
            message: 'No se pudo verificar el token'
        }
    }

    const resp = await verifyPayPalPayment(paypalTrasactionId, authToken);

    if (!resp) {

        return {
            ok: false,
            message: 'error al verificar el pago'
        }

    }

    const { status, purchase_units } = resp;

    if (status !== 'COMPLETED') {
        return {
            ok: false,
            message: 'Aun no se ha pagado en paypal'
        }
    }


    //Realizar la actualizacion en la base de datos.
    const { invoice_id: orderId } = purchase_units[0];//
    try {

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date()
            }
        });


        revalidatePath(`/orders/${orderId}}`);

        return {
            ok:true
        }


    } catch (error) {
        return {
            ok: false,
            message: '500 - El pago no se pudo realizar'
        }
    }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
    const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
    const oauthUrl2 = process.env.PAYPAL_OAUTH_URL ?? '';
    const base64Token = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`, 'utf-8')
        .toString('base64');

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic ${base64Token}`);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    const urlencoded = new URLSearchParams();
    urlencoded.append("grant_type", "client_credentials");

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded
    };


    try {

        const result = await fetch(oauthUrl2, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());
        return result.access_token;


    } catch (error) {
        return null;
    }


}


const verifyPayPalPayment = async (paypalTransaccionId: string, bearerToken: string): Promise<PaypalOrderStatusResponse | null> => {


    const paypalOrderUrl = `${process.env.PAYPAL_ORDERS_URL}/${paypalTransaccionId}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${bearerToken}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    };

    try {
        const result = await fetch(paypalOrderUrl, {
            ...requestOptions,
            cache: 'no-store'
        }).then(r => r.json());
        return result;
    } catch (error) {
        return null;
    }





}
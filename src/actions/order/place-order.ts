'use server';

import { auth } from "@/auth.config";
import type { Size, Address } from "@/interfaces";
import { prisma } from "@/lib/prisma";


interface ProductToOrder {
    productId: string;
    quantity: number;
    size: Size;
}
export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {

    const session = await auth();
    const userId = session?.user.id;
    if (!userId) {
        return {
            ok: false,
            message: 'No hay session de usuario'
        }
    }

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: productIds.map(p => p.productId)
            }
        }
    });

    //Calcular los montos

    const itemsInOrder = productIds.reduce((count, p) => count + p.quantity, 0);

    //Los tatales de tax,subtotal y total


    const { subTotal, tax, total } = productIds.reduce((totals, item) => {

        const productQuantity = item.quantity;
        const product = products.find(p => p.id === item.productId);

        if (!product) throw new Error(`${item.productId} no existe - 500`);

        const subTotal = product.price * productQuantity;

        totals.subTotal += subTotal;
        totals.tax += subTotal * 0.15;
        totals.total += subTotal * 1.15;


        return totals;

    }, { subTotal: 0, tax: 0, total: 0 })

    //Crear la transaccion de la base de datos.



    try {
        const primsaTx = await prisma.$transaction(async (tx) => {

            //Actualizar el stock de los productos

            const updatedProductsPromoises = products.map((product) => {
                //Acumular los valores
                const productQuantity = productIds.filter(p => p.productId === product.id).reduce((acc, item) => item.quantity + acc, 0);

                if (productQuantity === 0) {
                    throw new Error(`${product.id} no tiene cantidad definida`);
                }

                return tx.product.update({
                    where: { id: product.id },
                    data: {
                        inStock: {
                            decrement: productQuantity
                        }
                    }
                })
            });


            const updatedProducts = await Promise.all(updatedProductsPromoises);

            //Verificar valores negaticos en las existencia no gay stock

            updatedProducts.forEach(product => {
                if (product.inStock < 0) {
                    throw new Error(`${product.title} no tiene inventario suficiente`)
                }
            })

            //throw new Error('No se puede grabar algo');


            //2.Crear la orden-Encabezado - Detalles

            const order = await tx.order.create({
                data: {
                    userId: userId,
                    itemsInOrder: itemsInOrder,
                    subTotal: subTotal,
                    tax: tax,
                    total: total,


                    OrderItem: {
                        createMany: {
                            data: productIds.map(product => ({
                                quantity: product.quantity,
                                size: product.size,
                                productId: product.productId,
                                price: products.find(p => p.id === product.productId)?.price ?? 0

                            }))
                        }
                    }
                }
            })

            //Validar si el prices es entonces lanzar un error


            //3.- Crear la direccion de la orden

            const { country, ...restAddress } = address;

            const orderAddress = await tx.orderAddress.create({
                data: {
                    ...restAddress,
                    countryId: country,
                    orderId: order.id,

                }
            });


            return {
                order: order,
                orderAddress: orderAddress,
                updateProdcuts: updatedProducts
            }

        });

        return {
            ok:true,
            order:primsaTx.order,
            primsaTx:primsaTx

        }

    } catch (error: any) {
        return {
            ok: false,
            message: error?.message
        }
    }






}
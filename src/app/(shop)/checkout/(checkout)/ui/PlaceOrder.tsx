'use client';

import { useAddressStore, useCartStore } from "@/store";
import { currencyFormat, sleep } from "@/utils";
import clsx from "clsx";
import { useEffect, useState } from "react";

export const PlaceOrder = () => {

    const [loaded, setLoaded] = useState(false);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const address = useAddressStore(state => state.address);
    const cart = useCartStore(state => state.cart);

    const { itemsInCart, total, subsTotal, tax } = useCartStore(state => state.getSummatyInformation());

    useEffect(() => {
        setLoaded(true);
    }, []);


    const onPlaceOrder = async () => {
        setIsPlacingOrder(true);
        //await sleep(2);

        const productsToCart = cart.map (product => ({
            
        }))
        setIsPlacingOrder(false);
    }

    if (!loaded) {
        return <p> Cargando... </p>
    }



    return (
        <div className="bg-white rounded-xl shadow-xl p-7">


            <h2 className="text-2xl  mb-2"> Direccion de entrega</h2>

            <div className="mb-10">
                <p className="text-xl">{address.firstName} - {address.lastName}  </p>
                <p>{address.address} </p>
                <p>{address.address2}</p>
                <p>{address.postalCode}</p>
                <p>{address.city} , {address.country}</p>
                <p>{address.phone}</p>
            </div>

            <div className="w-full h-0.5 rounded bg-gray-200 mb-10" />


            <h2 className="text-2xl mb-2"> Resumen de orden</h2>

            <div className="grid grid-cols-2">
                <span>No. Productos</span>
                <span className="text-right">  {itemsInCart === 1 ? '1 artículo' : `${itemsInCart} articulos`} </span>

                <span>Subtotal</span>
                <span className="text-right">  {currencyFormat(subsTotal)} </span>

                <span>Impuestos (15%)</span>
                <span className="text-right">  {currencyFormat(tax)} </span>

                <span className="mt-5 text-2xl">Total:</span>
                <span className="mt-5 text-2xl text-right ">  {currencyFormat(total)} </span>
            </div>


            <div className="mt-5 mb-2 2-full">
                <p className="mb-5">
                    <span className="text-xs">Al hacer clic en "Colocar orden", aceptas nuestros
                        <a href="#" className="underline">terminos y condiciones </a> y <a href="#" className="unerline"> política de privacidad</a>
                    </span>
                </p>


                {/* <p className="text-red-500">Error de creación</p> */}

                <button className={
                    clsx(

                        {
                            'btn-primary': !isPlacingOrder,
                            'btn-disabled': isPlacingOrder,
                        }
                    )
                }
                    onClick={onPlaceOrder} >
                    Colocar orden
                </button>
            </div>
        </div>
    )
}

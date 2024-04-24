import type { CartProduct } from "@/interfaces";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];

    getTotalItems: () => number;
    getSummatyInformation: () => {
        subsTotal: number;
        tax: number;
        total: number;
        itemsInCart: number;
    };
    addProductTocart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProduct: (product: CartProduct) => void;
}


export const useCartStore = create<State>()(
    persist(


        (set, get) => ({

            cart: [],
            getTotalItems: () => {
                const { cart } = get();
                return cart.reduce((total, item) => total + item.quantity, 0);
            },
            addProductTocart: (product: CartProduct) => {
                const { cart } = get();

                const productInCart = cart.some(
                    (item) => item.id === product.id && item.size === product.size
                )

                if (!productInCart) {
                    set({ cart: [...cart, product] });
                    return;
                }

                const updatedCartProducts = cart.map((item) => {

                    if (item.id === product.id && item.size === product.size) {
                        return {
                            ...item,
                            quantity: item.quantity + product.quantity
                        }
                    }

                    return item;
                });

                set({ cart: updatedCartProducts })

            },
            updateProductQuantity: (product: CartProduct, quantity: number) => {
                const { cart } = get();

                const updatedCartProducts = cart.map(item => {

                    if (item.id === product.id && item.size === product.size) {
                        return { ...item, quantity: quantity };
                    }
                    return item;
                });

                set({ cart: updatedCartProducts })



            },
            removeProduct: (product: CartProduct) => {
                const { cart } = get();
                const updatedCartProducts = cart.filter(
                    (item) => item.id !== product.id || item.size !== product.size
                );

                set({ cart: updatedCartProducts })
            },
            getSummatyInformation: () => {

                const { cart } = get();

                const subsTotal = cart.reduce((subtotal, product) => (product.quantity * product.price) + subtotal, 0);

                const tax = subsTotal * 0.15;
                const total = subsTotal + tax;
                const itemsInCart = cart.reduce((total, item) => total + item.quantity, 0);

                return {
                    subsTotal,
                    tax,
                    total,
                    itemsInCart
                }


            }

        })
        ,
        {
            name: 'shopping-cart',

        }
    )


)
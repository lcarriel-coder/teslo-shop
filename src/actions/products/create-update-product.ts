'use server';


import { object, z } from 'zod';
import { Category } from '@/interfaces';
import { Gender, Product, Size } from '@prisma/client';
import { prisma } from '@/lib/prisma';

const productSchema = z.object({
    id: z.string().uuid().optional().nullable(),
    title: z.string().min(3).max(255),
    slug: z.string().min(3).max(255),
    description: z.string(),
    price: z.coerce.number().min(0).transform(val => Number(val.toFixed(2))),
    inStock: z.coerce.number().min(0).transform(val => Number(val.toFixed(0))),
    categoryId: z.string().uuid(),
    sizes:z.coerce.string().transform( val => val.split(',')),
    tags:z.string(),
    gender : z.nativeEnum(Gender),
});

export const createUpdateProduct = async (formData: FormData) => {

    const data = Object.fromEntries( formData );
    const productParsed = productSchema.safeParse(data);
    
    if(!productParsed.success){
        return {ok:false};
    }

    const product = productParsed.data;

    product.slug.toLowerCase().replace(/ /g,'-').trim();


    const {id,...rest}= product;
    const tagsArray = rest.tags.split(',').map( tag => tag.trim().toLowerCase());
    const prismaTx = await prisma.$transaction( async (tx ) => {

        let product:Product;
        if(id){
            product = await prisma.product.update({
                where:{id},
                data:{
                    ...rest,
                    sizes:{
                        set:rest.sizes as Size[]
                    },
                    tags:{
                        set:tagsArray
                    },
                }
            })
        }else{

        }

    })




    return {
        ok: true
    }
}
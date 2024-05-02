import { getCargories, getProductBySlug } from "@/actions";
import { Title } from "@/components";
import { redirect } from "next/navigation";
import { Product } from '../../../../../interfaces/product.interface';
import { ProductForm } from "./ui/ProductForm";

interface Props {
    params: {
        slug: string;
    }
}

export default async function ProductPage({ params }: Props) {

    const { slug } = params;

    const [product, categories] = await Promise.all([
        getProductBySlug(slug),
        getCargories()
    ])

    if( !product ){
        redirect('/admin/products');
    }

    const title = ( slug === 'new') ? 'Nuevo producto' :'Editar producto';

    return (
        <>
            <Title title={ title } />
            <ProductForm product={ product }  categories={ categories }/>
        </>
    );
}
export const revalidate = 604800;

import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { ProductSlideshow, QuantitySelector, SizeSelector, ProductMobileSlideshow, StockLabel } from "@/components";
import { Product } from "@/interfaces";
import { getProductBySlug } from "@/actions";
import { Metadata, ResolvingMetadata } from "next";
import { AddToCart } from "./ui/AddToCart";


interface Props {
  params: {
    slug: string;
  }
}


export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const slug = params.slug

  // fetch data
  const product = await getProductBySlug(slug);

  // optionally access and extend (rather than replace) parent metadata
  //const previousImages = (await parent).openGraph?.images || []

  return {
    title: product?.title ?? 'Producto no encontrado' + 'Teslo-Shop',
    description: product?.description ?? '',
    openGraph: {
      title: product?.title ?? 'Producto no encontrado',
      description: product?.description ?? '',
      images: [`/product/${product?.images[1]}`],
    },
  }
}



export default async function ProductBySlugPage({ params }: Props) {

  const { slug } = params;

  const product = await getProductBySlug(slug) as Product;

  if (!product) {
    notFound();
  }


  return (
    <div className="mt-5 mb-20 grid md:grid-cols-3 gap-3">

      <div className="col-span-1 md:col-span-2 ">
        <ProductMobileSlideshow images={product.images} title={product.title} className="block md:hidden" />
        <ProductSlideshow images={product.images} title={product.title} className="hidden md:block" />
      </div>


      <div className="col-span-1 px-5 ">

        <StockLabel slug={product.slug} />

        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg mb-5">${product?.price}</p>


        <AddToCart product={ product } />

        <h3 className="font-bol text-sm"> Descripción</h3>
        <p>
          { product.description }
        </p>
      </div>


    </div>
  );
}
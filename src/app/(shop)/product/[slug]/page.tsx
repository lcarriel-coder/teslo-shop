import { initialData } from "@/seed/seed";
import notFound from "../not-found";
import { titleFont } from "@/config/fonts";
import { ProductSlideshow, QuantitySelector, SizeSelector,ProductMobileSlideshow } from "@/components";
import { Product } from "@/interfaces";


interface Props {
  params: {
    slug: string;
  }
}

export default function ({ params }: Props) {

  const { slug } = params;
  const product = initialData.products.find(p => p.slug === slug) as Product;

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
        <h1 className={`${titleFont.className} antialiased font-bold text-xl`}>{product.title}</h1>
        <p className="text-lg mb-5">${product?.price}</p>

        <SizeSelector
          selectedSize={product.sizes[0]}
          availableSizes={product.sizes}

        />
        <QuantitySelector quantity={2} />

        <button className="btn-primary my-5"> Agregar al carrito</button>
        <h3 className="font-bol text-sm"> Descripción</h3>
        <p>
          {product.description}
        </p>
      </div>


    </div>
  );
}
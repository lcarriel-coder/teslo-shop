import { Title, ProductGrid } from "@/components";
import { ValidCategory } from "@/interfaces";
import { initialData } from "@/seed/seed";
import { notFound } from "next/navigation";

const seedProducts = initialData.products;

interface Props {
  params: {
    id: ValidCategory;
  }
}

export default function ({ params }: Props) {

  const { id } = params;
  const products = seedProducts.filter(e => e.gender === id);

  const labels:Record<ValidCategory,string> = {
    'men': 'para Hombres',
    'women': 'para Mujeres',
    'kid': 'para Niños',
    'unisex': 'para todos',
  }

  // if(id === 'kids'){
  //   notFound();
  // }
  return (
    <>
      <Title
        title={`Articulos de ${(labels)[id]}`}
        subtitle="Todos los productos"
        className="mb-2" />

      <ProductGrid
        products={products}
      />
    </>
  );
}
import { titleFont } from "@/config/fonts";

export default function Home() {
  return (
    <main className="">
      <h1 > hola Mundo </h1>
      <h1 className={ `${titleFont.className} font-bold` }> hola Mundo </h1>
    </main>
  );
}

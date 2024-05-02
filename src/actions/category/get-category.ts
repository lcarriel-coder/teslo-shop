import { prisma } from "@/lib/prisma"

export const getCargories = async () => {


    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            }
        });
        return categories;
    } catch (error) {

        return null;

    }
}
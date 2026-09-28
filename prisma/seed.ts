import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const clothes = await prisma.category.upsert({
    where: { slug: "clothes" },
    update: {},
    create: {
      name: "Clothes",
      slug: "clothes",
      description: "Premium clothing for every occasion",
    },
  });

  const shoes = await prisma.category.upsert({
    where: { slug: "shoes" },
    update: {},
    create: {
      name: "Shoes",
      slug: "shoes",
      description: "Step out in style with our shoe collection",
    },
  });

  const perfumes = await prisma.category.upsert({
    where: { slug: "perfumes" },
    update: {},
    create: {
      name: "Perfumes",
      slug: "perfumes",
      description: "Luxurious fragrances for every mood",
    },
  });

  const accessories = await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: {
      name: "Accessories",
      slug: "accessories",
      description: "Complete your look with our accessories",
    },
  });

  // Create sample products
  const products = [
    {
      name: "Classic White Sneakers",
      slug: "classic-white-sneakers",
      description: "Timeless white sneakers crafted from premium leather. Perfect for everyday wear with a cushioned insole for all-day comfort.",
      price: 89.99,
      comparePrice: 119.99,
      sku: "SHO-001",
      stock: 50,
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"],
      categoryId: shoes.id,
      attributes: { color: ["White", "Black"], size: ["7", "8", "9", "10", "11"] },
    },
    {
      name: "Slim Fit Oxford Shirt",
      slug: "slim-fit-oxford-shirt",
      description: "A perfectly tailored oxford shirt made from 100% Egyptian cotton. Features a modern slim fit and button-down collar.",
      price: 59.99,
      comparePrice: null,
      sku: "CLO-001",
      stock: 100,
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"],
      categoryId: clothes.id,
      attributes: { color: ["White", "Blue", "Pink"], size: ["S", "M", "L", "XL"] },
    },
    {
      name: "Eau de Parfum - Noir",
      slug: "eau-de-parfum-noir",
      description: "A sophisticated blend of bergamot, black pepper, and sandalwood. Long-lasting fragrance for the modern individual.",
      price: 129.99,
      comparePrice: 149.99,
      sku: "PER-001",
      stock: 30,
      images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=800"],
      categoryId: perfumes.id,
      attributes: { size: ["50ml", "100ml"] },
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description: "Handcrafted from genuine Italian leather. Features multiple compartments and an adjustable strap.",
      price: 149.99,
      comparePrice: 189.99,
      sku: "ACC-001",
      stock: 25,
      images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
      categoryId: accessories.id,
      attributes: { color: ["Brown", "Black", "Tan"] },
    },
    {
      name: "Running Performance Shoes",
      slug: "running-performance-shoes",
      description: "Engineered for performance with responsive cushioning and breathable mesh upper. Ideal for daily training.",
      price: 119.99,
      comparePrice: null,
      sku: "SHO-002",
      stock: 75,
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      categoryId: shoes.id,
      attributes: { color: ["Red", "Black", "Blue"], size: ["7", "8", "9", "10", "11", "12"] },
    },
    {
      name: "Wool Blend Overcoat",
      slug: "wool-blend-overcoat",
      description: "Luxurious wool blend overcoat with a tailored silhouette. Perfect for the colder months.",
      price: 199.99,
      comparePrice: 249.99,
      sku: "CLO-002",
      stock: 40,
      images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800"],
      categoryId: clothes.id,
      attributes: { color: ["Camel", "Navy", "Charcoal"], size: ["S", "M", "L", "XL", "XXL"] },
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Jhumka",
  },
  {
    name: "Payal",
  },
  {
    name: "Necklace",
  },
  {
    name: "Tika",
  },
];

async function main() {
  // Example: Seeding a User table
  await prisma.category.createMany({ data: categories });
  console.log("Seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

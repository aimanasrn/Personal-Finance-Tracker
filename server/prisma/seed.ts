import { prisma } from "../src/lib/prisma.js";

async function main() {
  console.log("seed ready");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

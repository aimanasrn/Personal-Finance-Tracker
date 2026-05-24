import { prisma } from "../src/lib/prisma.js";
import { defaultCategoryData } from "../src/modules/categories/service.js";

async function main() {
  const workspaces = await prisma.workspace.findMany({
    select: { id: true }
  });

  for (const workspace of workspaces) {
    await prisma.category.createMany({
      data: defaultCategoryData(workspace.id),
      skipDuplicates: true
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

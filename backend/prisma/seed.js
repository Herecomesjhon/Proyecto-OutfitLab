// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categorias = ['Camisetas', 'Pantalones', 'Sudaderas', 'Zapatos', 'Accesorios'];
  for (const name of categorias) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('✔ Categorías base listas');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });

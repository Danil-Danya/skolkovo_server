const roles = [
  { name: "ADMIN" },
  { name: "MANAGER" },
  { name: "USER" },
];

async function seedRoles(prisma) {
  for (const role of roles) {
    await prisma.roles.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log(`[seed] Seeded ${roles.length} roles`);
}

module.exports = {
  seedRoles,
};

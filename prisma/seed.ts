import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding HAVØK Command Center — roles and permissions only.\n");

  const roles = await Promise.all([
    prisma.role.upsert({
      where: { name: "Super Admin" },
      update: {},
      create: { name: "Super Admin", description: "Full system access with all permissions" },
    }),
    prisma.role.upsert({
      where: { name: "Founder Admin" },
      update: {},
      create: { name: "Founder Admin", description: "Founder-level access to all business operations" },
    }),
    prisma.role.upsert({
      where: { name: "Operations Manager" },
      update: {},
      create: { name: "Operations Manager", description: "Manages inventory, orders, and day-to-day operations" },
    }),
    prisma.role.upsert({
      where: { name: "Sales Manager" },
      update: {},
      create: { name: "Sales Manager", description: "Manages leads, orders, and dealer relationships" },
    }),
    prisma.role.upsert({
      where: { name: "Dealer Manager" },
      update: {},
      create: { name: "Dealer Manager", description: "Manages dealer network and applications" },
    }),
    prisma.role.upsert({
      where: { name: "Content Manager" },
      update: {},
      create: { name: "Content Manager", description: "Manages site content and media assets" },
    }),
    prisma.role.upsert({
      where: { name: "Analyst Read Only" },
      update: {},
      create: { name: "Analyst Read Only", description: "View-only access to dashboards and reports" },
    }),
  ]);

  const [superAdmin, founderAdmin, opsManager, salesManager, dealerManager, contentManager, analystReadOnly] = roles;

  const modules = [
    "dashboard", "products", "dealers", "applications", "inventory",
    "leads", "orders", "media", "content", "activity_log", "users", "settings",
  ];
  const actions = [
    "view", "create", "edit", "delete", "approve", "publish", "export", "manage_users", "manage_roles",
  ];

  const permissions: Array<{ id: string; key: string; module: string }> = [];
  for (const mod of modules) {
    for (const act of actions) {
      const key = `${mod}:${act}`;
      const label = `${act.charAt(0).toUpperCase() + act.slice(1).replace(/_/g, " ")} ${mod.replace(/_/g, " ")}`;
      const perm = await prisma.permission.upsert({
        where: { key },
        update: {},
        create: { key, label, module: mod },
      });
      permissions.push(perm);
    }
  }

  const allPermIds = permissions.map((p) => p.id);

  for (const role of [superAdmin, founderAdmin]) {
    for (const permId of allPermIds) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permId } },
        update: {},
        create: { roleId: role.id, permissionId: permId },
      });
    }
  }

  const scoped: Array<{ roleId: string; modules: string[]; actions: string[] }> = [
    {
      roleId: opsManager.id,
      modules: ["dashboard", "products", "inventory", "orders", "activity_log"],
      actions: ["view", "create", "edit", "delete", "export"],
    },
    {
      roleId: salesManager.id,
      modules: ["dashboard", "products", "dealers", "leads", "orders", "activity_log"],
      actions: ["view", "create", "edit", "export", "approve"],
    },
    {
      roleId: dealerManager.id,
      modules: ["dashboard", "dealers", "applications", "inventory", "activity_log"],
      actions: ["view", "create", "edit", "approve", "export"],
    },
    {
      roleId: contentManager.id,
      modules: ["dashboard", "products", "media", "content", "activity_log"],
      actions: ["view", "create", "edit", "publish"],
    },
    {
      roleId: analystReadOnly.id,
      modules: ["dashboard", "products", "dealers", "inventory", "leads", "orders", "activity_log"],
      actions: ["view", "export"],
    },
  ];

  for (const scope of scoped) {
    for (const perm of permissions) {
      const [mod, act] = perm.key.split(":");
      if (scope.modules.includes(mod) && scope.actions.includes(act)) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: scope.roleId, permissionId: perm.id } },
          update: {},
          create: { roleId: scope.roleId, permissionId: perm.id },
        });
      }
    }
  }

  console.log("Roles:", roles.length);
  console.log("Permissions:", permissions.length);
  console.log("No users, products, dealers, or demo rows were seeded.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@zek-reservation.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      email: "admin@zek-reservation.com",
      password: hashedPassword,
      role: "ADMIN",
      phoneNumber: "1234567890",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff1@zek-reservation.com" },
    update: {},
    create: {
      firstName: "Staff",
      lastName: "Member",
      username: "staff1",
      email: "staff1@zek-reservation.com",
      password: hashedPassword,
      role: "STAFF",
      phoneNumber: "0987654321",
    },
  });

  await prisma.permission.createMany({
    data: [
      // Reserved for future non-USER permissions
    ],
    skipDuplicates: true,
  });

  console.log({ admin, staff });
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

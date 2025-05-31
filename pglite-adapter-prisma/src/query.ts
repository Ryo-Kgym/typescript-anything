// query.js
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// setup
dotenv.config();
const connectionString = `${process.env.DATABASE_DIR}`;

// init prisma client
const client = new PGlite(connectionString);
const adapter = new PrismaPGlite(client);
const prisma = new PrismaClient({ adapter });

(async () => {
  await client.exec(`
    CREATE TABLE "cats" (
      "id" SERIAL NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "reference_image_id" VARCHAR(255),
      "temperament" VARCHAR(255),
      "description" TEXT,
      "country_id" INTEGER,
      CONSTRAINT "cats_pkey" PRIMARY KEY ("id"));

    CREATE TABLE "countries" (
      "id" SERIAL NOT NULL,
      "name" VARCHAR(255) NOT NULL,
      "country_code" VARCHAR(2) NOT NULL,
      CONSTRAINT "countries_pkey" PRIMARY KEY ("id"));

    ALTER TABLE "cats" ADD CONSTRAINT "cats_country_id_fkey" FOREIGN KEY ("country_id")
      REFERENCES "countries"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  `);
})();

const testFunc = async () => {
  const user = await prisma.country.createMany({
    data: [
      {
        name: "Japan",
        countryCode: "JP",
      },
      {
        name: "China",
        countryCode: "CN",
      },
    ],
  });
  console.log(user);

  // query after insert
  console.log(await prisma.country.findMany());
};

void testFunc();

import { prisma } from "../src/lib/prisma";

async function run() {
  const events = await prisma.event.findMany({ take: 1 });
  console.log(events);
}
run().finally(() => process.exit(0));

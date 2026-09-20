// server.js
import express from "express";
import cors from "cors";
import { PrismaClient } from "./src/generated/prisma/index.js";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get("/api/pages/:slug", async (req, res) => {
  const page = await prisma.page.findUnique({
    where: { slug: req.params.slug },
  });

  if (!page) {
    return res.status(404).json({ error: "Page not found" });
  }

  res.json(page);
});

app.put("/api/pages/:slug", async (req, res) => {
  const { slug } = req.params;
  const { blocks } = req.body;

  if (!Array.isArray(blocks)) {
    return res.status(400).json({ error: "Blocks must be an array" });
  }

  const page = await prisma.page.upsert({
    where: { slug },
    update: { blocks },
    create: { slug, blocks },
  });

  res.json({ success: true, page });
});

app.listen(3000, () => {
  console.log("API running on http://localhost:3000");
});
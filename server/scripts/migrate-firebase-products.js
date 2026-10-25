
import dotenv from "dotenv";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "../src/lib/prisma.js";

dotenv.config({ path: path.resolve(process.cwd(), "../.env") });

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const exportPath = path.resolve(
  currentDir,
  "../../firebase-products-export.json"
);

const BUCKET = "product-images";

const CATEGORY_LABELS = {
  teachers: "За Учители",
  jubilee: "Юбилей",
  "just-because": "Без Повод",
  baptism: "Кръщене",
  birthday: "Рожден Ден",
  baby: "За бебе",
  graduation: "Дипломиране",
  "8-march": "8-ми март",
  valentine: "Свети Валентин",
};

const BULGARIAN_TO_LATIN = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e",
  ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s",
  т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch",
  ш: "sh", щ: "sht", ъ: "a", ь: "y", ю: "yu", я: "ya",
};

function slugify(value) {
  const transliterated = [...value.toLowerCase()]
    .map((character) => BULGARIAN_TO_LATIN[character] ?? character)
    .join("");

  return transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function getImageUrls(product) {
  const urls = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(product.image ? [product.image] : []),
  ];

  return [...new Set(urls.filter((url) => typeof url === "string" && url.trim()))];
}

function getExtension(url, contentType) {
  try {
    const pathname = new URL(url).pathname;
    const decoded = decodeURIComponent(pathname);
    const match = decoded.match(/\.(png|jpe?g|webp|gif|avif)$/i);

    if (match) {
      return match[1].toLowerCase().replace("jpeg", "jpg");
    }
  } catch {
    // Ако URL няма разпознаваемо разширение, използваме content type.
  }

  if (contentType?.includes("png")) return "png";
  if (contentType?.includes("webp")) return "webp";
  if (contentType?.includes("gif")) return "gif";
  if (contentType?.includes("avif")) return "avif";

  return "jpg";
}

async function downloadAndUploadImage(url, storagePath, supabase) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Неуспешно изтегляне на снимка: HTTP ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const buffer = Buffer.from(await response.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType,
      upsert: false,
    });

  if (error) {
    throw new Error(`Supabase Storage: ${error.message}`);
  }

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath);

  return data.publicUrl;
}

async function main() {
  if (!fs.existsSync(exportPath)) {
    throw new Error(`Не е намерен JSON файлът: ${exportPath}`);
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Липсват SUPABASE_URL или SUPABASE_KEY в root .env.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const products = JSON.parse(fs.readFileSync(exportPath, "utf8"));

  if (!Array.isArray(products)) {
    throw new Error("JSON файлът трябва да съдържа масив с продукти.");
  }

  // Проверяваме предварително категориите и създаваме липсващите.
  const categoryValues = new Set();

  for (const product of products) {
    const categories = Array.isArray(product.categories)
      ? product.categories
      : product.category
        ? [product.category]
        : [];

    categories.forEach((category) => categoryValues.add(category));
  }

  const categoryMap = new Map();

  for (const value of categoryValues) {
    const category = await prisma.category.upsert({
      where: { name: value },
      update: {},
      create: { name: value },
    });

    categoryMap.set(value, category.id);
  }

  const usedSlugs = new Set(
    (await prisma.product.findMany({ select: { slug: true } }))
      .map((product) => product.slug)
  );

  let imported = 0;
  let failed = 0;
  let uploadedImages = 0;

  for (let index = 0; index < products.length; index++) {
    const product = products[index];

    try {
      const baseSlug = slugify(product.name || `product-${index + 1}`);
      let slug = baseSlug;
      let suffix = 1;

      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${suffix++}`;
      }

      usedSlugs.add(slug);

      const categoryValuesForProduct = [
        ...new Set(
          (Array.isArray(product.categories)
            ? product.categories
            : product.category
              ? [product.category]
              : []
          ).filter((value) => categoryMap.has(value))
        ),
      ];

      const imageUrls = getImageUrls(product);
      const migratedImageUrls = [];

      for (let imageIndex = 0; imageIndex < imageUrls.length; imageIndex++) {
        const oldUrl = imageUrls[imageIndex];
        const responseExtension = getExtension(oldUrl);
        const storagePath =
          `firebase-migration/${slug}/${String(imageIndex + 1).padStart(2, "0")}.${responseExtension}`;

        try {
          const publicUrl = await downloadAndUploadImage(
            oldUrl,
            storagePath,
            supabase
          );

          migratedImageUrls.push(publicUrl);
          uploadedImages++;
        } catch (imageError) {
          console.error(
            `  ⚠️ Снимка ${imageIndex + 1} не беше качена за "${product.name}":`,
            imageError.message
          );
        }
      }

      const connectedCategories = categoryValuesForProduct.map((value) => ({
        id: categoryMap.get(value),
      }));

      await prisma.product.create({
        data: {
          name: String(product.name || "Продукт без име").trim(),
          slug,
          price: String(product.price ?? 0),
          shortDescription: product.shortDescription || null,
          description: product.description || null,
          position: Number.isInteger(product.order) ? product.order : index,
          categories: {
            connect: connectedCategories,
          },
          images: {
            create: migratedImageUrls.map((url) => ({ url })),
          },
        },
      });

      imported++;
      console.log(`✅ Импортиран: ${product.name} (${migratedImageUrls.length} снимки)`);
    } catch (error) {
      failed++;
      console.error(`❌ Грешка при "${product.name || `продукт ${index + 1}`}":`, error.message);
    }
  }

  console.log("\nРезултат от миграцията");
  console.log("----------------------");
  console.log(`Импортирани продукти: ${imported}`);
  console.log(`Качени снимки: ${uploadedImages}`);
  console.log(`Продукти с грешки: ${failed}`);
  console.log(`Общо продукти в JSON: ${products.length}`);
  console.log(`Категории в експорта: ${categoryMap.size}`);
}

main()
  .catch((error) => {
    console.error("Миграцията не може да продължи:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

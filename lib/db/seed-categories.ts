import { nanoid } from "nanoid";
import { db } from "./drizzle";
import { categories } from "./schema";

export const defaultCategories = [
  {
    id: nanoid(),
    name: "Health",
    description: "Physical and mental well-being habits",
    color: "#10B981", // green
    icon: "heart",
  },
  {
    id: nanoid(),
    name: "Productivity",
    description: "Work and efficiency related habits",
    color: "#3B82F6", // blue
    icon: "target",
  },
  {
    id: nanoid(),
    name: "Learning",
    description: "Education and skill development habits",
    color: "#8B5CF6", // purple
    icon: "book",
  },
  {
    id: nanoid(),
    name: "Personal",
    description: "Personal development and lifestyle habits",
    color: "#F59E0B", // amber
    icon: "user",
  },
  {
    id: nanoid(),
    name: "Social",
    description: "Relationships and social interaction habits",
    color: "#EF4444", // red
    icon: "users",
  },
  {
    id: nanoid(),
    name: "Creativity",
    description: "Creative and artistic pursuits",
    color: "#EC4899", // pink
    icon: "palette",
  },
];

export async function seedCategories() {
  try {
    console.log("Seeding categories...");

    // Check if categories already exist
    const existingCategories = await db.select().from(categories);

    if (existingCategories.length > 0) {
      console.log("Categories already exist, skipping seed");
      return;
    }

    // Insert default categories
    await db.insert(categories).values(defaultCategories);

    console.log(`Successfully seeded ${defaultCategories.length} categories`);
  } catch (error) {
    console.error("Error seeding categories:", error);
    throw error;
  }
}

if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log("Seed completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seed failed:", error);
      process.exit(1);
    });
}

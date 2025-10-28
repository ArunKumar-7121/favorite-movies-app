import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Validation schema
const entrySchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["MOVIE", "TV_SHOW"]),
  director: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  year: z.string().optional(),
  posterUrl: z.string().optional(),
  notes: z.string().optional(),
});

// Success response helper
const successResponse = (data: any, message: string = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

// Error response helper
const errorResponse = (message: string, error: any = null) => {
  return {
    success: false,
    message,
    error: error?.message || error,
  };
};

// Create entry
app.post("/api/entries", async (req, res) => {
  try {
    const validated = entrySchema.parse(req.body);
    const newEntry = await prisma.entry.create({ data: validated });
    
    res.status(201).json(
      successResponse(newEntry, "Entry created successfully")
    );
  } catch (error: any) {
    console.error("Create entry error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        errorResponse("Validation failed", error)
      );
    }
    
    res.status(400).json(
      errorResponse("Failed to create entry", error)
    );
  }
});

// Get entries (with pagination for infinite scroll)
app.get("/api/entries", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      prisma.entry.findMany({
        skip,
        take: limit,
        orderBy: { id: "desc" },
      }),
      prisma.entry.count(),
    ]);

    const responseData = {
      items,
      total,
      page,
      limit,
      hasMore: skip + items.length < total,
    };

    res.json(
      successResponse(responseData, "Entries fetched successfully")
    );
  } catch (error: any) {
    console.error("Get entries error:", error);
    res.status(500).json(
      errorResponse("Failed to fetch entries", error)
    );
  }
});

// Update entry
app.put("/api/entries/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Check if entry exists
    const existingEntry = await prisma.entry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return res.status(404).json(
        errorResponse("Entry not found")
      );
    }

    const validated = entrySchema.partial().parse(req.body);
    const updatedEntry = await prisma.entry.update({
      where: { id },
      data: validated,
    });

    res.json(
      successResponse(updatedEntry, "Entry updated successfully")
    );
  } catch (error: any) {
    console.error("Update entry error:", error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json(
        errorResponse("Validation failed", error)
      );
    }
    
    res.status(400).json(
      errorResponse("Failed to update entry", error)
    );
  }
});

// Delete entry
app.delete("/api/entries/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    
    // Check if entry exists
    const existingEntry = await prisma.entry.findUnique({
      where: { id },
    });

    if (!existingEntry) {
      return res.status(404).json(
        errorResponse("Entry not found")
      );
    }

    await prisma.entry.delete({ where: { id } });
    
    res.status(200).json(
      successResponse(null, "Entry deleted successfully")
    );
  } catch (error: any) {
    console.error("Delete entry error:", error);
    res.status(400).json(
      errorResponse("Failed to delete entry", error)
    );
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
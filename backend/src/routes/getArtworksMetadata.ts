import { Router, Request, Response } from "express";
import { prisma } from "../config/prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  // router.get("/") is to get all artworks
  try {
    const artworks = await prisma.artwork.findMany({
      select: {
        id: true,
        title: true,
        imageURL: true,
        pieceDate: true,
        size: true,
        style: true,
        medium: true,
        price: true,
      },
      orderBy: {
        pieceDate: "desc",
      },
    });
    res.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching artworks",
    });
  }
});

export default router;

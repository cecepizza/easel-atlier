"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const prisma_1 = require("../config/prisma");
const router = (0, express_1.Router)();
router.get("/", async (req, res) => {
    // router.get("/") is to get all artworks
    try {
        const artworks = await prisma_1.prisma.artwork.findMany({
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
    }
    catch (error) {
        console.error("Error fetching artworks:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching artworks",
        });
    }
});
exports.default = router;

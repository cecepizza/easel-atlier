"use client";

import React, { useState } from "react";
import { Size, Medium, Style } from "../../../types";
import envConfig from "../../../env.config";

export default function AdminUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    size: Size.SMALL,
    medium: Medium.PEN,
    style: Style.REALM01,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const form = new FormData();
    form.append("image", file);
    form.append("title", formData.title);
    form.append("price", formData.price);
    form.append("size", formData.size);
    form.append("medium", formData.medium);
    form.append("style", formData.style);
    form.append("pieceDate", new Date().toISOString());

    try {
      const response = await fetch(`${envConfig.apiUrl}/admin/upload`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!response.ok) {
        const errorText = await response.text(); // Get the raw response text
        console.error("Error response:", errorText); // Log it for debugging
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Upload success:", data);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload New Artwork</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <div>
          <label className="block mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            required
            className="w-full p-2 border rounded text-black"
          />
        </div>

        <div>
          <label className="block mb-2">Size</label>
          <select
            value={formData.size}
            onChange={(e) =>
              setFormData({ ...formData, size: e.target.value as Size })
            }
            required
            className="w-full p-2 border rounded text-black"
          >
            {Object.values(Size).map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Medium</label>
          <select
            value={formData.medium}
            onChange={(e) =>
              setFormData({ ...formData, medium: e.target.value as Medium })
            }
            required
            className="w-full p-2 border rounded text-black"
          >
            {Object.values(Medium).map((medium) => (
              <option key={medium} value={medium}>
                {medium}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Style</label>
          <select
            value={formData.style}
            onChange={(e) =>
              setFormData({ ...formData, style: e.target.value as Style })
            }
            required
            className="w-full p-2 border rounded text-black"
          >
            {Object.values(Style).map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!file}
        >
          Upload Artwork
        </button>
      </form>
    </div>
  );
}

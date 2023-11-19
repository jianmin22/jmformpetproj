import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import cloudinary from "~/server/cloudinary";

export const ImageRouter = createTRPCRouter({
  deleteImage: publicProcedure
    .input(z.object({ public_id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const cloudinaryResponse = await cloudinary.uploader.destroy(
          input.public_id,
        );
        console.log("Image removed successfully:", cloudinaryResponse);
      } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw new Error("Failed to delete image from Cloudinary");
      }
    }),
});

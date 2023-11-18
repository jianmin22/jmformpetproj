import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import cloudinary from "~/server/cloudinary";
export const formRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getFormNamesByID: publicProcedure.query(async ({ ctx }) => {
    try {
      const userID = ctx.session?.user.id;

      if (!userID) {
        throw new Error("User not authenticated");
      }

      const userForms = await ctx.db.form.findMany({
        where: {
          createdUserID: userID,
        },
        select: {
          formID: true,
          formName: true,
          creationDate: true
        },        
      });
      userForms.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());

      return userForms;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve forms");
    }
  }),

  getFormDetailsByFormID: publicProcedure
    .input(z.object({ formID: z.string() }))
    .query(async ({ input, ctx }) => {
      try {
        const userID = ctx.session?.user.id;

        if (!userID) {
          throw new Error("User not authenticated");
        }
        if (!input.formID || input.formID.length == 0) {
          throw new Error("Form ID is invalid");
        }

        const formDetails = await ctx.db.form.findUnique({
          where: { formID: input.formID },
          include: { questions: { include: { options: true } } },
        });

        if (!formDetails) {
          throw new Error("Form not found");
        }

        const userQnsAns = await ctx.db.userQnsAns.findMany({
          where: {
            formID: input.formID,
            userID: userID,
          },
        });

        const result = {
          ...formDetails,
          userQnsAns,
        };

        return result;
      } catch (error) {
        console.error(error);
        throw new Error(
          "Failed to retrieve form details and user question answers",
        );
      }
    }),

  getOptionDetails: publicProcedure
    .input(z.object({ optionIDs: z.array(z.string()) }))
    .query(async ({ input, ctx }) => {
      try {
        const userID = ctx.session?.user.id;

        if (!userID) {
          throw new Error("User not authenticated");
        }
        if (!input.optionIDs || input.optionIDs.length === 0) {
          throw new Error("Option IDs are invalid");
        }

        const optionDetails = await ctx.db.questionOption.findMany({
          where: { qnsOptionID: { in: input.optionIDs } },
        });

        if (!optionDetails || optionDetails.length === 0) {
          throw new Error("No options found");
        }

        return optionDetails;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to retrieve option details");
      }
    }),

  createForm: publicProcedure
    .input(
      z.object({
        formName: z.string(),
        questions: z.array(
          z.object({
            questionNumber: z.number(),
            question: z.string(),
            questionType: z.string(),
            options: z.array(
              z.object({
                option: z.string(),
              }),
            ),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const userID = ctx.session?.user.id;

        if (!userID) {
          throw new Error("User not authenticated");
        }
        const createdForm = await ctx.db.form.create({
          data: {
            createdUserID: userID,
            formName: input.formName,
          },
        });

        for (const questionData of input.questions) {
          const { questionNumber, question, questionType, options } =
            questionData;

          const createdQuestion = await ctx.db.question.create({
            data: {
              questionNumber,
              question,
              questionType,
              formID: createdForm.formID,
            },
          });

          if (options && options.length > 0) {
            for (const optionData of options) {
              await ctx.db.questionOption.create({
                data: {
                  option: optionData.option,
                  qnsID: createdQuestion.qnsID,
                },
              });
            }
          }

          await ctx.db.userQnsAns.create({
            data: {
              userID: userID,
              qnsID: createdQuestion.qnsID,
              formID: createdForm.formID,
              lastUpdated: new Date(),
            },
          });
        }
        return { message: "Form created successfully" };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create form");
      }
    }),
    uploadImage: publicProcedure
    .input(z.object({ imageFile: z.object({ path: z.string() }) }))
    .mutation(async ({ input }) => {
      try {
        const { imageFile } = input;

        const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.path, {
          folder: 'images',
        });

        return { imageUrl: cloudinaryResponse.secure_url };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to upload image');
      }
    }),
    uploadFile: publicProcedure
    .input(z.object({ file: z.object({ path: z.string() }) }))
    .mutation(async ({ input }) => {
      try {
        const { file } = input;

        const cloudinaryResponse = await cloudinary.uploader.upload(file.path, {
          folder: 'files',
          resource_type: 'auto', // Automatically detect the resource type
        });

        return { fileUrl: cloudinaryResponse.secure_url };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to upload file to Cloudinary');
      }
    }),
});

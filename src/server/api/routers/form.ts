import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
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
    deleteForm: publicProcedure
    .input(z.object({ formID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userID = ctx.session?.user.id;

        if (!userID) {
          throw new Error("User not authenticated");
        }

        // Delete userQnsAns entries related to the form
        await ctx.db.userQnsAns.deleteMany({
          where: {
            formID: input.formID,
          },
        });

        const qnsIDs = await ctx.db.question.findMany({
          where: {
            formID: input.formID,
          },
          select: {
            qnsID: true,
          },
        });

        // Extract qnsID values from the result
        const qnsIDValues = qnsIDs.map((qnsID) => qnsID.qnsID);
        // Delete questionOptions related to the form's questions
        await ctx.db.questionOption.deleteMany({
          where: {
            qnsID: {
              in: qnsIDValues,
            },
          },
        });
        
        // Delete questions related to the form
        await ctx.db.question.deleteMany({
          where: {
            formID: input.formID,
          },
        });

        // Delete the form itself
        await ctx.db.form.delete({
          where: {
            formID: input.formID,
          },
        });

        return { message: "Form and related data deleted successfully" };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to delete form and related data");
      }
    }),
    updateAnswer: publicProcedure
    .input(
      z.object({
        answers: z.array( z.object({
          userQnsAnsID: z.string(),
          userID: z.string(),
          qnsID: z.string(),
          formID: z.string(),
          answer: z.string().nullable(),
          public_id: z.string().nullable(),
          qnsOptionID: z.string().nullable(),
          qnsOptionIDs: z.array(z.string()),
          dateTimeAns: z.date().nullable(),
          lastUpdated: z.date().nullable(),
        }),),
      }),
    )
  .mutation(async ({ ctx, input }) => {
    try {
      const userID = ctx.session?.user.id;

      if (!userID) {
        throw new Error("User not authenticated");
      }
      for (const answerData of input.answers) {
        const {
          userQnsAnsID,
          answer,
          public_id,
          qnsOptionID,
          qnsOptionIDs,
          dateTimeAns
        } = answerData;

        await ctx.db.userQnsAns.update({
          where: {
            userQnsAnsID: userQnsAnsID,
          },
          data: {
            answer: answer,
            public_id: public_id,
            qnsOptionID: qnsOptionID,
            qnsOptionIDs: { set: qnsOptionIDs },
            dateTimeAns: dateTimeAns
          },
        });
      }

      return { message: "Answers updated successfully" };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update answers");
    }
  })
});

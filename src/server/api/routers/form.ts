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

  getFormNamesByID: publicProcedure.query(async({ ctx }) => {
    try {
      const userID = ctx.session?.user.id;
  
      if (!userID) {
        throw new Error("User not authenticated");
      }
  
      const userForms = await ctx.db.form.findMany({
        where: {
          createdUserID: userID,
        },
        select:{
          formName:true
        }
      });
      return userForms;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to retrieve forms");
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
});

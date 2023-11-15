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

  createForm: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        questions: z.array(
          z.object({
            questionNumber: z.number(),
            question: z.string(),
            questionType: z.string(),
            options: z.array(
              z.object({
                option: z.string(),
              })
            ),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
       

        // Step 2: Create a new Form
        const createdForm = await ctx.db.form.create({
          data: {
            createdUserID: input.userId,
          },
        });

        // Step 3 and 4: Create Questions and Options
        for (const questionData of input.questions) {
          const { questionNumber, question, questionType, options } = questionData;

          const createdQuestion = await ctx.db.question.create({
            data: {
              questionNumber,
              question,
              questionType,
              formID: createdForm.formID,
            },
          });

          // Create QuestionOptions if the question has options
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

          // Step 5: Create UserQnsAns for each question
          await ctx.db.userQnsAns.create({
            data: {
              userID: input.userId,
              qnsID: createdQuestion.qnsID,
              formID: createdForm.formID,
              lastUpdated: new Date(),
            },
          });
        }
console.log("b");
        return { message: 'Form created successfully' };
      } catch (error) {
        console.error(error);
        throw new Error('Failed to create form');
      }
    }),
});
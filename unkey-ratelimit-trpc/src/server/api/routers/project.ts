import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
  rateLimitedProcedure,
} from "~/server/api/trpc";
import { projects } from "~/server/db/schema";
import { TRPCError } from "@trpc/server";
import { UnkeyRatelimit } from "~/server/ratelimit";

export const projectRouter = createTRPCRouter({
  create: rateLimitedProcedure({ limit: 3, duration: 5 })
    .input(
      z.object({
        projectName: z.string().min(3),
        projectDescription: z.string(),
        category: z.string(),
        projectImage: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [project] = await ctx.db
        .insert(projects)
        .values({
          id: crypto.randomUUID(),
          projectName: input.projectName,
          created_by: ctx.session.user.id,
          created_byName: ctx.session.user.name,
          projectDescription: input.projectDescription,
          category: input.category.toUpperCase(),
          projectImage: input.projectImage ?? undefined,
          createdAt: new Date(Date.now()),
        })
        .returning({ projectId: projects.id });
      if (!project?.projectId) {
        throw new TRPCError({
          message: "Error inserting into DB",
          code: "BAD_REQUEST",
        });
      }
      return { projectId: project.projectId };
    }),
  getUserProjects: rateLimitedProcedure({ limit: 3, duration: 5 }).query(async ({ ctx }) => {
    const success = await UnkeyRatelimit({
      namespace: "project.get.userProjects",
      limit: 3,
      duration: 5,
      userId: ctx.session.user.id,
    });
    if (!success) {
      throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
    }
    const projectList = await ctx.db.query.projects.findMany({
      where: eq(projects.created_by, ctx?.session?.user.id ?? ""),
      orderBy: (projects, { desc }) => [desc(projects.createdAt)],
      with: { steps: true },
    });

    return projectList;
  }),
  getProjectById: publicProcedure
    .input(
      z.object({
        projectId: z.string().min(3),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findFirst({
        where: eq(projects.id, input.projectId),
        with: { steps: true },
      });
      if (!project) {
        throw new TRPCError({
          message: "No projects found",
          code: "NOT_FOUND",
        });
      }
      return project;
    }),
  getLatestProjects: publicProcedure
    .input(
      z.object({
        limit: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findMany({
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
        limit: input.limit ?? 10,
        with: { steps: true },
      });
      return project;
    }),
  getProjectsByCategory: publicProcedure
    .input(
      z.object({
        category: z.string().min(3),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.query.projects.findMany({
        where: eq(projects.category, input.category.toUpperCase()),
        orderBy: (projects, { desc }) => [desc(projects.createdAt)],
        limit: 50,
        with: { steps: true },
      });
      return project;
    }),
  editProjectName: rateLimitedProcedure({ limit: 3, duration: 5 })
    .input(
      z.object({
        projectId: z.string().min(3),
        projectName: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "project.edit.projectName",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(projects)
        .set({
          projectName: input.projectName,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(projects.id, input.projectId));
      if (res.rowsAffected !== 1) {
        return new TRPCError({
          message: "Name not updated",
          code: "BAD_REQUEST",
        });
      }
      return res;
    }),
  editProjectImage: rateLimitedProcedure({ limit: 3, duration: 5 })
    .input(
      z.object({
        projectId: z.string().min(3),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "project.edit.projectImage",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(projects)
        .set({
          projectImage: input.image,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(projects.id, input.projectId));
      if (res.rowsAffected !== 1) {
        return new TRPCError({
          message: "Name not updated",
          code: "BAD_REQUEST",
        });
      }
      return res.rowsAffected === 1;
    }),
  editProjectCategory: rateLimitedProcedure({ limit: 3, duration: 5 })
    .input(
      z.object({
        projectId: z.string().min(3),
        category: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "project.edit.projectCategory",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(projects)
        .set({
          category: input.category,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(projects.id, input.projectId));
      if (res.rowsAffected !== 1) {
        return new TRPCError({
          message: "Category not updated",
          code: "BAD_REQUEST",
        });
      }
      return res.rowsAffected === 1;
    }),
  editProjectDescription: rateLimitedProcedure({ limit: 3, duration: 5 })
    .input(
      z.object({
        projectId: z.string().min(3),
        projectDescription: z.string().min(3),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const success = await UnkeyRatelimit({
        namespace: "project.edit.projectDescription",
        limit: 3,
        duration: 5,
        userId: ctx.session.user.id,
      });
      if (!success) {
        return new TRPCError({ code: "TOO_MANY_REQUESTS" });
      }
      const res = await ctx.db
        .update(projects)
        .set({
          projectDescription: input.projectDescription,
          updatedAt: new Date(Date.now()),
        })
        .where(eq(projects.id, input.projectId));
      if (res.rowsAffected !== 1) {
        return new TRPCError({
          message: "Description not updated",
          code: "BAD_REQUEST",
        });
      }
      return res.rowsAffected === 1;
    }),
});

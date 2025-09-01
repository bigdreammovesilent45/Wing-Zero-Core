"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const projectSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(500).optional().or(z.literal("")),
});

const taskSchema = z.object({
	title: z.string().min(1).max(200),
	description: z.string().max(1000).optional().or(z.literal("")),
	projectId: z.string().cuid(),
});

export async function createProject(userId: string, data: z.infer<typeof projectSchema>) {
	const parsed = projectSchema.safeParse(data);
	if (!parsed.success) throw new Error("Invalid project data");
	await prisma.project.create({ data: { ...parsed.data, ownerId: userId } });
	revalidatePath("/dashboard");
}

export async function deleteProject(projectId: string) {
	await prisma.project.delete({ where: { id: projectId } });
	revalidatePath("/dashboard");
}

export async function createTask(userId: string, data: z.infer<typeof taskSchema>) {
	const parsed = taskSchema.safeParse(data);
	if (!parsed.success) throw new Error("Invalid task data");
	await prisma.task.create({
		data: {
			title: parsed.data.title,
			description: parsed.data.description || undefined,
			projectId: parsed.data.projectId,
			assigneeId: userId,
		},
	});
	revalidatePath("/dashboard");
}

export async function setTaskStatus(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
	await prisma.task.update({ where: { id: taskId }, data: { status } });
	revalidatePath("/dashboard");
}

export async function deleteTask(taskId: string) {
	await prisma.task.delete({ where: { id: taskId } });
	revalidatePath("/dashboard");
}
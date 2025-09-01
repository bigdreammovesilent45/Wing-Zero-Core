"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createProject, createTask, deleteProject, setTaskStatus, deleteTask } from "../projects/actions";

export async function createProjectFromDashboard(formData: FormData) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) throw new Error("Unauthorized");
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) throw new Error("User not found");
	await createProject(user.id, {
		name: String(formData.get("name") ?? ""),
		description: String(formData.get("description") ?? ""),
	});
}

export async function createTaskFromDashboard(formData: FormData) {
	const session = await getServerSession(authOptions);
	if (!session?.user?.email) throw new Error("Unauthorized");
	const user = await prisma.user.findUnique({ where: { email: session.user.email } });
	if (!user) throw new Error("User not found");
	await createTask(user.id, {
		title: String(formData.get("title") ?? ""),
		description: String(formData.get("description") ?? ""),
		projectId: String(formData.get("projectId") ?? ""),
	});
}

export async function setTaskStatusFromDashboard(taskId: string, status: "TODO" | "IN_PROGRESS" | "DONE") {
	return setTaskStatus(taskId, status);
}

export async function deleteProjectFromDashboard(projectId: string) {
	return deleteProject(projectId);
}

export async function deleteTaskFromDashboard(taskId: string) {
	return deleteTask(taskId);
}
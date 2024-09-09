export type ProjectCardSchema = {
	projectName: string | null;
	category: string;
	projectDescription: string;
	projectImage: string | null;
	id: string;
	created_by: string;
	created_byName: string | null;
	createdAt: Date;
	updatedAt: Date | null;
	steps: {
		id: string;
		createdAt: Date;
		updatedAt: Date | null;
		description: string;
		title: string;
		stepNumber: number;
		projectId: string;
		stepImage: string | null;
	}[];
};
export type StepSchema ={
    id: string;
		createdAt: Date;
		updatedAt: Date | null;
		description: string;
		title: string;
		stepNumber: number;
		projectId: string;
		stepImage: string | null;
};

export type ProjectSchema ={
    projectName: string | null;
	category: string;
	projectDescription: string;
	projectImage: string | null;
	id: string;
	created_by: string;
	created_byName: string | null;
	createdAt: Date;
	updatedAt: Date | null;
};


export type UserSchema = {
    id: string;
    name: string;
    email: string;
    emailVerified: number;
    image: string | null;
};

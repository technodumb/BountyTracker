import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Task from "./task.entity";
import Employee from "./employee.entity";
import Comment from "./comment.entity";

@Entity()
class TaskParticipants extends AbstractEntity {
	@ManyToOne(() => Task, (task) => task.participants)
	task: Task;

	@ManyToOne(() => Employee, (employee) => employee.participatingTasks)
	employee: Employee;

	@Column()
	contribution: number;

	@OneToMany(() => Comment, (comment) => comment.taskParticipant)
	comments: Comment[];
}

export default TaskParticipants;

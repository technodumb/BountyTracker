import { CreateTaskDto, ResponseTaskDto } from "../dto/task.dto";
import Employee from "../entity/employee.entity";
import Task from "../entity/task.entity";
import HttpException from "../exceptions/http.exceptions";
import TaskRepository from "../repository/task.repository";
import { CommentType } from "../utils/commentType.enum";

class TaskService {
	constructor(private taskRepository: TaskRepository) {}

	getAllTasks = async (relations?: Array<string>): Promise<Task[]> => {
		return this.taskRepository.find({}, relations);
	};

	getTasks = async (filter: Partial<Task>, relations: Array<string>) => {
		return this.taskRepository.find(filter, relations);
	};
	getTaskById = async (id: number) => {
		return this.taskRepository.findOneBy({ id }, ["createdBy", "participants", "participants.employee"]);
	};

	createTask = async (task: CreateTaskDto, user: Employee) => {
		let newTask = new Task();
		const { title, description, maxParticipants, totalBounty, startDate, deadLine, skills } = task;
		newTask.title = title;
		newTask.description = description;
		// newTask.status = status;
		newTask.createdBy = user;
		newTask.maxParticipants = maxParticipants;
		newTask.currentParticipants = 0;
		newTask.totalBounty = totalBounty;
		newTask.startDate = startDate;
		newTask.deadLine = deadLine;
		newTask.skills = skills;

		await this.taskRepository.save(newTask);
	};

	updateTask = async (id: number, task: Partial<Task>) => {
		return this.taskRepository.update(id, task);
	};

	getTaskCreatedByUser = async (id: number) => {
		return this.taskRepository.find({ createdById: id });
	};

	getTaskCommentsById = async (id: number) => {
		const task = await this.getTaskById(id);
		const allComments = task.comments;
		const normalComments = allComments.filter((comment) => comment.commentType === CommentType.Normal);
		const reviewComments = allComments.filter((comment) => comment.commentType === CommentType.Review);

		return { normalComments, reviewComments };
	};
}

export default TaskService;

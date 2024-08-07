import { Repository } from "typeorm";
import Comment from "../entity/comment.entity";
import BaseRepository from "./base.repository";

// class CommentRepository {
// 	constructor(private repository: Repository<Comment>) {}

// 	find = async (filter?: Partial<Comment>, relations?: Array<string>): Promise<Comment[]> => {
// 		return this.repository.find({
// 			where: filter,
// 			relations: relations,
// 		});
// 	};

// 	findOneBy = async (filter: Partial<Comment>, relations?: Array<string>): Promise<Comment> => {
// 		return this.repository.findOne({
// 			where: filter,
// 			relations,
// 		});
// 	};

// 	create = async (data: Comment): Promise<Comment> => {
// 		return this.repository.create(data);
// 	};
// 	update = async (id: number, comment: Partial<Comment>) => {
// 		return this.repository.update({ id }, comment);
// 	};

// 	save = async (comment: Comment): Promise<Comment> => {
// 		return this.repository.save(comment);
// 	};

// 	delete = async (filter: Partial<Comment>): Promise<void> => {
// 		await this.repository.delete(filter.id);
// 	};

// 	softDelete = async (comment: Comment): Promise<void> => {
// 		await this.repository.softRemove(comment);
// 	};
// }

// export default CommentRepository;

class CommentRepository extends BaseRepository<Comment> {
	constructor(repository: Repository<Comment>) {
		super(repository);
	}
}

export default CommentRepository;

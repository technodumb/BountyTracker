import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import AbstractEntity from "./abstract.entity";
import Employee from "./employee.entity";

@Entity()
class Task extends AbstractEntity {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    status: string;

    @ManyToOne(() => Employee, (employee) => employee.tasks)
    createdBy: Employee;

    @Column()
    maxParticipants: number;

    @Column()
    totalBounty: number;

    @Column()
    deadLine: Date;
}

export default Task;

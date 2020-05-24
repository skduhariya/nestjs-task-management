import { Repository, EntityRepository } from "typeorm";
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { FilteredTaskDto } from './dto/filtered-task.dto';
import { User } from '../auth/user.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{
    private logger = new Logger('TaskRepository');

    async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskDto;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        delete task.user;
        return task;
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const found = await this.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return found;
    }

    async deleteTaskById(id: number, user: User) {
        // const found = await this.getTaskById(id);
        const result = await this.delete({id, userId: user.id});
        if (result['affected'] === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

    async updateTaskStatus(id: number, newStatus: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = newStatus;
        await task.save();
        return task;
    }

    async getTasks(filteredTaskDto: FilteredTaskDto, user: User): Promise<Task[]> {
        const { status, search } = filteredTaskDto;
        const query = this.createQueryBuilder('task');

        // query.where('task.userId = :userid', { userId: user.id });
        query.andWhere('task.user.id = :userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere('task.title LIKE :search OR task.description LIKE :search', { search: `%${search}%` });
        }

        try{
            const tasks = await query.getMany();
            return tasks;
        }catch(error){
            this.logger.error(`failed to get all task with User "${user.username}", Filters: "${JSON.stringify(filteredTaskDto)}."`, error.stack);
            throw new InternalServerErrorException();
        }
    }
}
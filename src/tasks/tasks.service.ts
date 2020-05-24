import { Injectable } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { FilteredTaskDto } from './dto/filtered-task.dto';
import { User } from '../auth/user.entity';


@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTaskById(id: number, user:User): Promise<Task> {
        return this.taskRepository.getTaskById(id, user);
    }

    async createTask(
        createTaskDto: CreateTaskDto,
        user: User): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async deletTaskById(id: number, user:User): Promise<void> {
        return this.taskRepository.deleteTaskById(id, user);
    }


    async updateTaskStatus(id: number, newStatus: TaskStatus, user: User): Promise<Task> {
        return this.taskRepository.updateTaskStatus(id, newStatus, user);
    }

    async getTasks(filteredTaskDto: FilteredTaskDto, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filteredTaskDto, user);
    }

    // getFilteredTasks(filteredTaskDto: FilteredTaskDto): Task[] {
    //     const { status, search } = filteredTaskDto;
    //     let tasks = this.getAllTasks();
    //     if (status) {
    //         tasks = tasks.filter((task: Task) => task.status === status);
    //     }
    //     if (search) {
    //         tasks = tasks.filter((task: Task) =>
    //             task.title.includes(search) ||
    //             task.description.includes(search));
    //     }
    //     return tasks;
    // }






}

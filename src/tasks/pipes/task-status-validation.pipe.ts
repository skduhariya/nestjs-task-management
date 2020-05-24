import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from '../task-status.enum';


export class TaskStatusValidationPipe implements PipeTransform {
    readonly taskStatuses = [
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE
    ];

    transform(value: any) {
        value = value.toUpperCase();
        // console.log('value: ', value);
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`${status} Invalid Satus`)
        }
        return value;
    }

    isStatusValid(status: any) {
        const idx = this.taskStatuses.indexOf(status);
        return idx !== -1;
    }
}
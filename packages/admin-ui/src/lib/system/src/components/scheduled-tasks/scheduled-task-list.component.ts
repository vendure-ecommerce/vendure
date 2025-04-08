import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    DataService,
    GetAllScheduledTasksQuery,
    ToggleScheduledTaskEnabledMutation,
    ToggleScheduledTaskEnabledMutationVariables,
} from '@vendure/admin-ui/core';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';

export const GET_SCHEDULED_TASKS_LIST = gql`
    query GetAllScheduledTasks {
        scheduledTasks {
            id
            description
            schedule
            scheduleDescription
            lastExecutedAt
            nextExecutionAt
            isRunning
            lastResult
            enabled
        }
    }
`;

const TOGGLE_SCHEDULED_TASK_ENABLED = gql`
    mutation ToggleScheduledTaskEnabled($input: UpdateScheduledTaskInput!) {
        updateScheduledTask(input: $input) {
            id
            enabled
        }
    }
`;

@Component({
    selector: 'vdr-scheduled-task-list',
    templateUrl: './scheduled-task-list.component.html',
    styleUrls: ['./scheduled-task-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduledTaskListComponent implements OnInit {
    tasks$: Observable<GetAllScheduledTasksQuery['scheduledTasks']>;
    liveUpdate = new FormControl(true);

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.tasks$ = this.dataService
            .query<GetAllScheduledTasksQuery>(GET_SCHEDULED_TASKS_LIST)
            .mapStream(res => {
                console.log(res.scheduledTasks);
                return res.scheduledTasks;
            });
    }

    toggleEnabled(task: GetAllScheduledTasksQuery['scheduledTasks'][0]) {
        this.dataService
            .mutate<ToggleScheduledTaskEnabledMutation, ToggleScheduledTaskEnabledMutationVariables>(
                TOGGLE_SCHEDULED_TASK_ENABLED,
                {
                    input: {
                        id: task.id,
                        enabled: !task.enabled,
                    },
                },
            )
            .subscribe();
    }
}

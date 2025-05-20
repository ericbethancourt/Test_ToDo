import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { task } from '/imports/api/task_collection/task';

Meteor.methods({
    async 'task.insert'(taskinsert) {
        check(taskinsert, {
            name_task: String,
            done: Boolean,
            priority: String,
        });

        return await task.insertAsync(taskinsert);
    },
});
import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import { check } from 'meteor/check';

Meteor.methods({
    async 'task.delete'(taskId){
        check(taskId, String);
        return await task.removeAsync(taskId);
    }
});

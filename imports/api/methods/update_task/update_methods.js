import { Meteor } from 'meteor/meteor';
import { task } from '/imports/api/task_collection/task';
import { check } from 'meteor/check';


Meteor.methods({
    async 'task.update'(taskId, status){
        check(taskId, String);
        check(status, Boolean);
        return await task.updateAsync(taskId, {$set: {done: status}});
    }
});
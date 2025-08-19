import { error } from 'console';
import Project from '../models/project.js';
import Task from '../models/task.js';
import Workspace from '../models/workspace.js';
import ActivityLog from '../models/activity.js';

import { recordActivity } from '../libs/index.js';

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: 'Project not found',
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: 'Workspace not found',
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: 'You are not a member of this workspace',
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate('assignees', 'name profilePicture')
      .populate('watchers', 'name profilePicture');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }

    const project = await Project.findById(task.project).populate(
      'members.user',
      'name profilePicture'
    );

    return res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateTaskTitle = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'you are not member of this project' });
    }

    const oldTitle = task.title;

    task.title = title;
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Title changed from ${oldTitle} to ${title}`,
    });

    return res.status(200).json(task);
  } catch {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'you are not member of this project' });
    }

    const oldDescription =
      task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '');

    task.description = description;
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Title changed from ${oldDescription} to ${description}`,
    });

    return res.status(200).json(task);
  } catch {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'you are not member of this project' });
    }

    const oldStatus = task.status;

    task.status = status;
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Title changed from ${oldStatus} to ${status}`,
    });

    return res.status(200).json(task);
  } catch {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'you are not member of this project' });
    }

    const oldAssignees = task.assignees;

    task.assignees = assignees;
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Assignees updated from ${oldAssignees.length} to ${assignees.length}`,
    });

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'you are not member of this project' });
    }

    const oldPriority = task.priority;

    task.priority = priority;
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Priority changed from ${oldPriority} to ${priority}`,
    });

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const addSubtask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'You are not member of this project' });
    }

    const newSubtask = {
      title,
      completed: false,
      createAt: new Date(),
    };

    task.subtasks.push(newSubtask);
    await task.save();

    await recordActivity(req.user._id, 'updated_task', 'Task', taskId, {
      description: `Added subtask: ${title}`,
    });

    return res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { completed } = req.body;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        message: 'Task not found',
      });
    }
    const subTask = task.subtasks.find((subTask) => subTask._id.toString() === subTaskId);
    if (!subTask) {
      return res.status(404).json({
        message: 'Subtask not found',
      });
    }
    subTask.completed = completed;
    await task.save();

    // record activity
    await recordActivity(req.user._id, 'updated_subtask', 'Task', taskId, {
      description: `updated subtask ${subTask.title}`,
    });
    return res.status(200).json(task);
  } catch (error) {
    console.log('error update subtask', error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

const getActivitiesByResourceId = async (req, res) => {
  try {
    const { resourceId } = req.params;
    const activity = await ActivityLog.find({ resourceId })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });

    return res.status(200).json({ activity });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};

export {
  createTask,
  getTaskById,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskAssignees,
  updateTaskPriority,
  addSubtask,
  updateSubTask,
  getActivitiesByResourceId,
};

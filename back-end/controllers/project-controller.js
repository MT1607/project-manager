import router from "../routes/auth.js";
import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

const createProject = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const {title, description, status, startDate, dueDate, tags, members} =
            req.body;

        console.log('workspace-id: ', workspaceId);
        const workspace = await Workspace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).send({error: "Workspace does not exist"});
        }

        const isMember = workspace.members.some(
            (member) => member.user.toString() === req.user._id.toString(),
        );

        if (!isMember) {
            return res.status(403).send({error: "Invalid member with this user."});
        }

        const tagArray = tags ? tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0) : [];
        const newProject = await Project.create({
            title,
            description,
            status,
            startDate,
            dueDate,
            tags: tagArray,
            workspace: workspaceId,
            members,
            createdBy: req.user._id,
        });

        workspace.projects.push(newProject._id);
        await workspace.save();

        return res.status(201).json(newProject);
    } catch (err) {
        return res.status(500).json({message: "Internal server error"});
    }
};

const getProjectDetails = async (req, res) => {
    try {
        const {projectId} = req.params;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        return res.status(200).json(project);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const {projectId} = req.params;
        const project = await Project.findById(projectId).populate("members.user");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member.user._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const tasks = await Task.find({
            project: projectId,
            isArchived: false,
        })
            .populate("assignees", "name profilePicture")
            .sort({createdAt: -1});

        res.status(200).json({
            project,
            tasks,
        });

        console.log("project: ", project);
        console.log("tasks", tasks);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


export {createProject, getProjectDetails, getProjectTasks};

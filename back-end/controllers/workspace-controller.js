import Workspace from "../models/workspace.js";
import Project from "../models/project.js";

const createWorkspace = async (req, res) => {
    try {
        const {name, description, color} = req.body;
        const workspace = await Workspace.create({
            name,
            description,
            color,
            owner: req.user._id,
            members: [
                {
                    user: req.user._id,
                    role: "owner",
                    joinedAt: new Date(),
                },
            ],
        });

        res.status(200).json(workspace);
    } catch (e) {
        console.log("error: ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getWorkspaces = async (req, res) => {
    try {
        const workspace = await Workspace.find({
            "members.user": req.user._id,
        }).sort({createdAt: -1});
        res.status(200).json(workspace);
    } catch (e) {
        console.log("error: ", e);
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getWorkspaceDetail = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const workspace = await Workspace.findOne({
            _id: workspaceId,
            "members.user": req.user._id,
        }).populate("members.user");
        if (!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }
        res.status(200).json(workspace);
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
};

const getWorkspaceProject = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const workspace = await Workspace.findOne({
            _id: workspaceId,
            "members.user": req.user._id,
        }).populate("members.user", "name email profilePicture");

        if (!workspace) {
            return res.status(404).json({message: "Workspace not found"});
        }

        const projects = await Project.find({
            workspace: workspaceId,
            isArchived: false,
            members: {$in: req.user._id}
        }).populate("tasks", "status").sort({createdAt: -1});
        res.status(200).json({projects, workspace});
    } catch (e) {
        res.status(500).json({message: "Internal Server Error"});
    }
};
export {
    createWorkspace,
    getWorkspaces,
    getWorkspaceDetail,
    getWorkspaceProject,
};

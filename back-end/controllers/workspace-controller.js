import Workspace from "../models/workspace.js";

const createWorkspace = async (req, res) => {
    try {
        const {name, description, color} = req.body;
        const workspace = await Workspace.create({
            name,
            description,
            color,
            owner: req.user._id,
            members: [{
                user: req.user._id,
                role: "owner",
                joinedAt: new Date(),
            }],
        })

        res.status(200).json(workspace)
    } catch (e) {
        console.log("error: ", e);
        res.status(500).json({message: "Internal Server Error"})
    }
}

export {createWorkspace}
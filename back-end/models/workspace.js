import {model, Schema} from "mongoose";

const workspaceModel = new Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    description: {type: String, trim: true},
    color: {type: String, default: '#FF5733'},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    members: [{
        user: {type: Schema.Types.ObjectId, ref: 'User'},
        role: {
            type: String,
            enum: ["owner", "admin", "member", "viewer"],
            default: "member"
        },
        joinedAt: {type: Date, default: Date.now}
    }],
    projects: [{type: Schema.Types.ObjectId, ref: 'Project'}]
}, {timestamps: true})

const Workspace = model("Workspace", workspaceModel);
export default Workspace;
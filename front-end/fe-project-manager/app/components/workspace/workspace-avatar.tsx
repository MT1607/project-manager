interface WorkspaceAvatarProps {
    color: string,
    name: string
}

const WorkspaceAvatar = ({color, name}: WorkspaceAvatarProps) => {
    return (
        <div className={"flex justify-center items-center w-6 h-6 rounded-sm"} style={{backgroundColor: color}}>
            <span className={"text-xs font-medium text-white"}>{name.charAt(0).toUpperCase()}</span>
        </div>
    )
}


export default WorkspaceAvatar;
import {Button} from "@/components/ui/button";
import {CirclePlus} from "lucide-react";

interface NoDataFoundProps {
    title: string,
    description: string,
    buttonText: string,
    buttonAction: () => void
}

const NoDataFound = ({title, description, buttonText, buttonAction}: NoDataFoundProps) => {
    return (
        <div className={"col-span-full text-center py-12 2xl:py-14 bg-muted/40 rounded-lg"}>
            <h3 className={"mt-4 text-lg font-semibold"}>{title}</h3>
            <p className={"mt-2 text-sm text-muted-foreground max-w-sm mx-auto"}>{description}</p>
            <Button onClick={buttonAction} className={"mt-4"}>
                <CirclePlus className={"size-4 mr-2"}/>
                {buttonText}
            </Button>
        </div>
    )
}

export default NoDataFound;
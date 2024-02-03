import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import BackButton from "./back-button";
import CardWrapper from "./card-wrappper";
import Header from "./header";

const ErrorCard = () => {
    return ( 
        <CardWrapper
        headerLabel="Ooops! Something went wrong"
        backButonHref="/auth/login"
        backButtonLabel="Back to login"
        >
            <div className="w-full flex items-center justify-center">
                <ExclamationTriangleIcon className="text-destructive"/>
                </div>
        </CardWrapper>
        
     );
}
 
export default ErrorCard;
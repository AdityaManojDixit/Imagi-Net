import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import qs from "qs";
import  { aspectRatioOptions }  from '@/constants';


//Function by ShadCn that allow to merge couple of class names together
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


//Error Handler
export const handleError = (error : unknown) =>{
  if(error instanceof Error){
    console.log(error.message);
    throw new Error(`Error: ${error.message}`);
  }
  else if( typeof error == "string"){
    console.log(error);
    throw new Error(`Error: ${error}`);
  }
  else{
    console.log(error);
    throw new Error(`Unknown Error: ${JSON.stringify(error)}`) 
  }
}

//Form URL Query
// export const formUrlQuery = ({searchParams, key, value} : FormUrlQueryParams){
//   const params = { ...qs.parse(searchParams.toString()), }
// }npm run
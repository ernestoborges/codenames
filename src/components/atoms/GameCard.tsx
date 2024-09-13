import { RandomWords } from "@/utils/words";

export default function GameCard({
    title,
    color
}:{
    title:string,
    color?:string
}){

    return <>
        <div 
            className={`w-[150px] h-[100px] flex items-center justify-center w-aut border-2 border-white rounded-lg uppercase`}
            style={{backgroundColor: color?color:'gray'}}
        >
            <div>
                {title}
            </div>
        </div>
    </>
}
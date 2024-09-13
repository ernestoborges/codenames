export default function Select({
    options,
    defaultvalue
}:{
    options: string[],
    defaultvalue?: string
}){

    return <>
        <select className="text-black">
            {options.map((option,i) => 
                <option key={i} value={option} defaultValue={defaultvalue?defaultvalue:'-'} >
                    {option}
                </option>
                )}
        </select>
    </>
}
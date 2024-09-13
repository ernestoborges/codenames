export function TextInput({
    placeholder
}:{
    placeholder?:string
}){
    return <>
        <input placeholder={placeholder?placeholder:''} />
    </>
}
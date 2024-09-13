export default function Button({
    name
}:{
    name: string
}){

    return <>
        <button
            className="bg-green-500 rounded-lg p-1"
            type="button"
        >
            {name}
        </button>
    </>
}
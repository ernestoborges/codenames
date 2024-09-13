import Button from "../atoms/Button";
import Select from "../atoms/Select";
import { TextInput } from "../atoms/TextInput";

const options = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'I'
]

export function GameTipBar() {
    return <>
        <div className="flex gap-4">
            <TextInput placeholder="Digite sua dica" />
            <Select options={options} />
            <Button name="Dar dica" />
        </div>
    </>
}
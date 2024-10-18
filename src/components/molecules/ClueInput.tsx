import { useState } from "react";
import Button from "../atoms/Button";
import { useSocketContext } from "../../context/socket";
import { useTokenContext } from "../../context/token";

export default function ClueInput({
    gameState
}: {
    gameState: any
}) {

    const { socket } = useSocketContext();
    const { token } = useTokenContext();

    const [clueWordInput, setClueWordInput] = useState<string>('');
    const [clueNumberInput, setClueNumberInput] = useState<number>(0);
    return (
        <>
            <div className="flex gap-4">
                <input
                    className="text-black p-2"
                    value={clueWordInput}
                    onChange={(e) => setClueWordInput(e.target.value)}
                />
                <select
                    className="text-black cursor-pointer"
                    onChange={(e) => setClueNumberInput(Number(e.target.value))}
                >
                    {Array.from({ length: (gameState.turn === 1 ? gameState.teamsScore.team1 : gameState.teamsScore.team2) + 1 }, (_, i) => (
                        <option
                            className="flex w-full justify-center text-center "
                            key={i}
                            value={i}
                        >
                            {i}
                        </option>
                    ))}
                    <option className="flex w-full justify-center text-center text-3xl" value={-1}>
                        ∞
                    </option>
                </select>
                <Button className="px-4" onClick={() => socket && socket.emit('gameClue', { token, word: clueWordInput, number: clueNumberInput })}>Dar dica</Button>
            </div>
        </>
    )
}
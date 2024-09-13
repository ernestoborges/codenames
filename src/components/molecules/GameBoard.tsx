import GameCard from "../atoms/GameCard"

export default function GameBoard({
    wordList
}: {
    wordList: string[]
}) {

    return <>
        <div className="flex">
            <div className="grid grid-flow-col grid-rows-5 gap-x-4 gap-y-4">
                {
                    wordList.map((word, i) => <GameCard key={i} title={word} />)
                }
            </div>
        </div>
    </>
}
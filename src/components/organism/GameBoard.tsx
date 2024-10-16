import GameCard from "../molecules/GameCard"

export default function GameBoard({
    cards,
    operativeTurn
}: {
    cards: any[],
    operativeTurn: boolean
}) {

    return <>
        <div className="flex">
            <div className="grid grid-flow-col grid-rows-5 gap-x-2 gap-y-2">
                {
                    cards.map((card, i) => <GameCard key={i} card={card} operativeTurn={operativeTurn} />)
                }
            </div>
        </div>
    </>
}
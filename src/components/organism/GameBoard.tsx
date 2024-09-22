import GameCard from "../molecules/GameCard"

export default function GameBoard({
    cards
}: {
    cards: any[]
}) {

    const cardsColor = {};
    cards.forEach((c) => {
        switch (c.color) {
            case 0: cardsColor[c.position] = 'gray'; break;
            case 1: cardsColor[c.position] = 'blue'; break;
            case 2: cardsColor[c.position] = 'red'; break;
            case 3: cardsColor[c.position] = 'black'; break;
        }
    })

    return <>
        <div className="flex">
            <div className="grid grid-flow-col grid-rows-5 gap-x-4 gap-y-4">
                {
                    cards.map((card, i) => <GameCard key={i} title={card.word} color={cardsColor[`${i}`]} index={card.position} />)
                }
            </div>
        </div>
    </>
}
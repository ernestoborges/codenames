import GameCard from "../molecules/GameCard"

export default function GameBoard({
    cards,
    spymasterCards
}: {
    cards: any[],
    spymasterCards: any[]
}) {

    const cardsColor = {};
    spymasterCards.forEach((sc) => {
        switch (sc.color) {
            case 0: cardsColor[sc.position] = 'gray'; break;
            case 1: cardsColor[sc.position] = 'blue'; break;
            case 2: cardsColor[sc.position] = 'red'; break;
            case 3: cardsColor[sc.position] = 'black'; break;
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
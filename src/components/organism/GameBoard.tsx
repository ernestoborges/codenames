import GameCard from "../molecules/GameCard"

export default function GameBoard({
    cards
}: {
    cards: any[]
}) {

    const cardsColor = {};
    cards.forEach((c) => {
        switch (c.color) {
            case 0: cardsColor[c.position] = '#5f5f5f5f'; break;
            case 1: cardsColor[c.position] = '#143464'; break;
            case 2: cardsColor[c.position] = '#b4202a'; break;
            case 3: cardsColor[c.position] = 'black'; break;
        }
    })

    return <>
        <div className="flex">
            <div className="grid grid-flow-col grid-rows-5 gap-x-2 gap-y-2">
                {
                    cards.map((card, i) => <GameCard key={i} title={card.word} color={cardsColor[`${i}`]} index={card.position} tips={card.tips} />)
                }
            </div>
        </div>
    </>
}
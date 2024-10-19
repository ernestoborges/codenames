import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Button from "../atoms/Button";
import Image from 'next/image'
import { MAX_AVATARS } from "../../conf/codenames.conf";
import LoadingSpin from "../atoms/LoadingSpin";

export default function AvatarSelector({
    index,
    setIndex
}: {
    index: number
    setIndex: (n: number) => void
}) {

    const handlePreviousAvatar = () => {
        if (index - 1 < 1) {
            setIndex(MAX_AVATARS)
        } else {
            setIndex(index - 1)
        }
    }

    const handleNextAvatar = () => {
        if (index + 1 > MAX_AVATARS) {
            setIndex(1)
        } else {
            setIndex(index + 1)
        }
    }
    console.log('avatar:', index)

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="relative h-[16rem] w-[16rem] rounded-xl border-2 border-white overflow-hidden flex items-center justify-center">
                    {
                        index
                            ? <Image src={`/avatars/${index}.png`} alt="" fill />
                            : <LoadingSpin />
                    }
                </div>
                <div className="flex gap-4">
                    <Button className="px-4 py-2 text-3xl grow" onClick={handlePreviousAvatar}><IoIosArrowBack /></Button>
                    <Button className="px-4 py-2 text-3xl grow" onClick={handleNextAvatar}><IoIosArrowForward /></Button>
                </div>
            </div>
        </>
    )
}
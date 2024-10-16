import React from "react";

export default function ToggleButton({
    children,
    value,
    className,
    onClick,
}: {
    children: React.ReactNode
    value: boolean
    className?: string,
    onClick: () => void
}) {
    const color1 = '#23823a';
    const color2 = '#75e9a0';
    return (
        <>
            <div
                className={`py-1 px-2 cursor-pointer rounded-lg ${className}`}
                style={{
                    backgroundColor: value ? color2 : "#80808050",
                    color: value ? color1 : "#a4a4a4"
                }}
                onClick={onClick}
            >
                {children}
            </div>
        </>
    )
}
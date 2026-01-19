import React from "react"
import { componentSelector } from "react-component-selector"

const rootVariations = {
    default: (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className={`${props.className || ''} flex-col flex relative w-full`} />,
    checkbox: (props: React.HTMLAttributes<HTMLDivElement>) =>
        <div {...props} className={`${props.className || ''} flex relative gap-3`} />
}

const InputRoot =  componentSelector<keyof typeof rootVariations, React.HTMLAttributes<HTMLDivElement>>(rootVariations)

export default InputRoot
import { componentSelector } from "../utils/helpers/component-selector"
import React from "react"

const divVariations = {
  "accordion-title-root": (props: React.HTMLAttributes<HTMLDivElement>) =>
    <div children={props.children} className='rounded flex justify-between items-center hover:bg-zinc-800 border border-zinc-700 ' />,
  "accordion-content-grid": (props: React.HTMLAttributes<HTMLDivElement>) =>
    <div children={props.children} className="grid grid-cols-2 justify-between items-center gap-6" />,
  "accordion-content": (props: React.HTMLAttributes<HTMLDivElement>) =>
    <div children={props.children} className="p-6 flex flex-col gap-6" />
}

const Div = componentSelector<keyof typeof divVariations, React.HTMLAttributes<HTMLDivElement>>(divVariations)

export default Div
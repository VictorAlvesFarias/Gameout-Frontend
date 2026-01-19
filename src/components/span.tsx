import { componentSelector } from "react-component-selector"
import React from "react"

const spanVariations = {
  default: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className={`${props.className || ''} font-px-1 px-3`} />,
  "default-accordion-button": (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className={`${props.className || ''} font-px-1 px-6 cursor-pointer`} />,
  error: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className={`${props.className || ''} text-red-400`} />,
  divisor: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className={`${props.className || ''} text-zinc-400 text-sm font-semibold pb-2 mb-3 border-b border-zinc-500 `} />,
}

const Span = componentSelector<keyof typeof spanVariations, React.HTMLAttributes<HTMLSpanElement>>(spanVariations)

export default Span
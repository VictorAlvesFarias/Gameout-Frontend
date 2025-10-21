import { componentSelector } from "../utils/helpers/component-selector"
import React from "react"

const spanVariations = {
  default: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span children={props.children} className='font-px-1 px-3' />,
  "default-accordion-button": (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span children={props.children} className='font-px-1 px-6 cursor-pointer' />,
  error: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span children={props.children} className='text-red-400' />,
}

const Span = componentSelector<keyof typeof spanVariations, React.HTMLAttributes<HTMLSpanElement>>(spanVariations)

export default Span
import { componentSelector } from "react-component-selector"
import React from "react"

const spanVariations = {
  default: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className='font-px-1 px-3' />,
  "default-accordion-button": (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className='font-px-1 px-6 cursor-pointer' />,
  error: (props: React.HTMLAttributes<HTMLSpanElement>) =>
    <span {...props} className='text-red-400' />,
}

const Span = componentSelector<keyof typeof spanVariations, React.HTMLAttributes<HTMLSpanElement>, "className">(spanVariations)

export default Span
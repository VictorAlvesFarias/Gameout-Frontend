import React from "react"
import { IAccordionContainerProps, AccordionContainer } from 'react-base-components'
import { componentSelector } from "react-component-selector"

const AccordionVariations = {
    default: (props: IAccordionContainerProps, ref: any) => {
        return (
            <AccordionContainer
                {...props}
                ref={ref}
                className=' bg-black bg-opacity-20 rounded aria-hidden:mt-1' />
        )
    },
    "default-no-max-h": (props: IAccordionContainerProps, ref: any) => {
        return (
            <AccordionContainer
                {...props}
                ref={ref}
                className=' bg-black bg-opacity-20 rounded aria-hidden:mt-1' />
        )
    }
}

const Accordion = componentSelector<keyof typeof AccordionVariations, IAccordionContainerProps, "className">(AccordionVariations)

export default Accordion

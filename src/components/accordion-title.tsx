import React from "react"
import { IAccordionTitleContainerProps, AccordionTitleContainer } from 'react-base-components'
import { componentSelector } from "react-component-selector"

const AccordionTitleVariations = {
    default: (props: IAccordionTitleContainerProps, ref: any) => {
        return (
            <AccordionTitleContainer {...props} ref={ref} className="w-full h-full flex items-center cursor-pointer text-sm text-white" />
        )
    }
}

const AccordionTitle = componentSelector<keyof typeof AccordionTitleVariations, IAccordionTitleContainerProps, "className">(AccordionTitleVariations)

export default AccordionTitle

import React from "react"
import AccordionTitleContainer, { IAccordionTitleContainerProps } from '../base-components/accordion-title'
import { componentSelector } from "../utils/helpers/component-selector"

const AccordionTitleVariations = {
    default: (props: IAccordionTitleContainerProps, ref: any) => {
        return (
            <AccordionTitleContainer {...props} ref={ref} className="w-full h-full flex items-center cursor-pointer text-sm text-white"/>
        )
    }
}

const AccordionTitle =  componentSelector<keyof typeof AccordionTitleVariations, IAccordionTitleContainerProps>(AccordionTitleVariations)

export default AccordionTitle

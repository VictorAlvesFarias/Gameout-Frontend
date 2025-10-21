import React from "react"
import FormContainer, { IFormContainerProps } from '../base-components/form'
import { componentSelector } from "../utils/helpers/component-selector"

const formVariation = {
    default: (props: IFormContainerProps) =>
        <FormContainer {...props} className='flex flex-col gap-3 p-6' />,
}

const Form =  componentSelector<keyof typeof formVariation, IFormContainerProps>(formVariation)

export default Form
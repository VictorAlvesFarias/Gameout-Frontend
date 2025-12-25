import React from "react"
import { IFormContainerProps, FormContainer } from 'react-base-components'
import { componentSelector } from "react-component-selector"

const formVariation = {
    default: (props: IFormContainerProps) =>
        <FormContainer {...props} className='flex flex-col gap-3 p-6' />,
}

const Form = componentSelector<keyof typeof formVariation, IFormContainerProps, "className">(formVariation)

export default Form
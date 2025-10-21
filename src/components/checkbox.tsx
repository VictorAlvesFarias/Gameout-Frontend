import React from "react"
import CheckboxContainer, { ICheckboxContainerProps } from '../base-components/checkbox'
import { componentSelector } from "../utils/helpers/component-selector"

const checkboxVariations = {
    default: (props: ICheckboxContainerProps, ref: any) =>
        <CheckboxContainer
            {...props}
            ref={ref}
            className={'transition-all cursor-pointer bg-transparent aria-checked:border-transparent w-5 h-5 rounded border-2 border-zinc-600 flex items-center justify-center aria-checked:bg-white aria-checked:text-black'}
        />,
}

const Checkbox =  componentSelector<keyof typeof checkboxVariations, ICheckboxContainerProps>(checkboxVariations)

export default Checkbox

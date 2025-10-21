import React from "react"
import TextContainer, { ITextContainerProps } from '../base-components/input-text'
import { componentSelector } from "../utils/helpers/component-selector"

const inputTextVariations = {
    default: (props: ITextContainerProps, ref: any) =>
        <TextContainer {...props} ref={ref} className="text-white bg-transparent flex items-center border border-zinc-700 w-fit p-2 px-3 rounded outline-1 focus-within:outline focus-within:border-transparent outline-white pl-2 cursor-text aria-disabled:bg-black aria-disabled:border-none aria-disabled:bg-opacity-30 aria-disabled:shadow-sm aria-[atomic]:animate-pulse" />,
    "default-full": (props: ITextContainerProps, ref: any) =>
        <TextContainer {...props} ref={ref} className="text-white bg-transparent flex items-center border border-zinc-700 w-full p-2 px-3 rounded outline-1 focus-within:outline focus-within:border-transparent outline-white pl-2 cursor-text aria-disabled:bg-black aria-disabled:border-none aria-disabled:bg-opacity-30 aria-disabled:shadow-sm aria-[atomic]:animate-pulse" />,
    'ultra-rounded': (props: ITextContainerProps, ref) =>
        <TextContainer {...props} ref={ref} className="rounded-full text-white bg-white bg-opacity-5 p-6 py-3 items-center flex outline-2 focus-within:outline outline-violet-500 cursor-text focus-within:border-transparent aria-[atomic]:animate-pulse" />,
}

const Text =  componentSelector<keyof typeof inputTextVariations, ITextContainerProps>(inputTextVariations)

export default Text
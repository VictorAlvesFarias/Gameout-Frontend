import React from "react"
import { IButtonContainerProps, ButtonContainer } from 'react-base-components'
import { componentSelector } from "react-component-selector"
import { LucideLoaderCircle } from "lucide-react"

const buttonVariations = {
  default: (props: IButtonContainerProps, ref: any) => {
    return (
      <ButtonContainer
        {...props}
        ref={ref}
        loadingComponent={
          <LucideLoaderCircle className='flex items-center justify-center w-6 h-6 rotating-div' />
        }
        className='flex items-center justify-center bg-white hover:bg-zinc-200 transition-all p-2 px-2 rounded text-zinc-800' />
    )
  },
  "default-full": (props: IButtonContainerProps, ref: any) => {
    return (
      <ButtonContainer
        {...props}
        ref={ref}
        loadingComponent={
          <LucideLoaderCircle className='flex items-center justify-center w-6 h-6 rotating-div' />
        }
        className='flex items-center justify-center bg-white hover:bg-zinc-200 transition-all p-2 px-2 rounded text-zinc-800 w-full' />
    )
  },
  modal: (props: IButtonContainerProps, ref: any) => {
    return (
      <ButtonContainer
        {...props}
        ref={ref}
        loadingComponent={
          <LucideLoaderCircle className='flex items-center justify-center w-6 h-6 rotating-div' />
        }
        className='flex items-center justify-center bg-white hover:bg-opacity-15 transition-all bg-opacity-10 p-2 px-2 rounded text-white' />
    )
  },
  red: (props: IButtonContainerProps, ref: any) => {
    return (
      <ButtonContainer
        {...props}
        ref={ref}
        loadingComponent={
          <LucideLoaderCircle className='flex items-center justify-center w-6 h-6 rotating-div' />
        }
        className='flex items-center justify-center bg-red-500 text-white px-2 w-full shadow hover:bg-opacity-70 rounded transition-all h-11 p-1 font-semibold' />
    )
  },
}

const Button = componentSelector<keyof typeof buttonVariations, IButtonContainerProps, "className">(buttonVariations)

export default Button

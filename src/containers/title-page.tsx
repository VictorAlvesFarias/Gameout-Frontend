import React from 'react'
import { usePageContext } from '../contexts/page-context'

function TitlePage() {
    const pageContext = usePageContext()

    return (
        <div className="bg-zinc-900 bg-opacity-50 px-6 h-20 flex items-center border-b border-zinc-800">
            <h1 className="text-white text-2xl font-semibold">{pageContext.pageTitle}</h1>
        </div>
    )
}

export default TitlePage
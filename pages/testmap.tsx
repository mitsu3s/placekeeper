import React from 'react'
import dynamic from 'next/dynamic'

const TestMapPage = () => {
    const TestMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/TestMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )
    return (
        <div className="bg-white flex flex-col items-center justify-center h-screen">
            <TestMap />
        </div>
    )
}

export default TestMapPage

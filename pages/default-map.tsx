import dynamic from 'next/dynamic'
import React from 'react'

function DefaultMapPage() {
    const Map = React.useMemo(
        () =>
            dynamic(() => import('@/components/DefaultMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )
    return <Map />
}

export default DefaultMapPage

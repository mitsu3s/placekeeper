import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { GetServerSideProps, NextPage } from 'next'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface FormValues {
    latitude: number
    longitude: number
    buildingName: string
}

export const getServerSideProps = async () => {
    const buildings = await prisma.building.findMany()
    console.log(buildings)

    return {
        props: {
            buildings,
        },
    }
}

const MapPage = ({ buildings }: any) => {
    // const [formMarkerPosition, setFormMarkerPosition] = useState<[number, number] | null>(null)

    const DefaultMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/DefaultMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    // const handleMarkerPositionUpdate = (newPosition: [number, number]) => {
    //     setFormMarkerPosition(newPosition)
    // }

    // const handleSubmit = async (values: FormValues) => {
    //     const latitude = formMarkerPosition ? formMarkerPosition[0] : 0
    //     const longitude = formMarkerPosition ? formMarkerPosition[1] : 0

    //     const updatedValues = {
    //         ...values,
    //         latitude,
    //         longitude,
    //     }

    //     console.log('Before send', updatedValues)
    //     try {
    //         const response = await axios.post('/api/send', updatedValues)
    //         console.log(response)
    //     } catch (error) {
    //         console.error(error)
    //     }
    // }

    // const initialValues = React.useMemo(
    //     () => ({
    //         latitude: formMarkerPosition ? formMarkerPosition[0] : 0,
    //         longitude: formMarkerPosition ? formMarkerPosition[1] : 0,
    //         buildingName: '',
    //         description: '',
    //     }),
    //     [formMarkerPosition]
    // )

    return (
        <div>
            <DefaultMap buildings={buildings} />
        </div>
    )
}

export default MapPage

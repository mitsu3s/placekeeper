import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import axios from 'axios'
import * as Yup from 'yup'
import { GetServerSideProps, NextPage } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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
    const DefaultMap = React.useMemo(
        () =>
            dynamic(() => import('@/components/DefaultMap'), {
                loading: () => <p>A map is loading</p>,
                ssr: false,
            }),
        []
    )

    return (
        <div>
            <DefaultMap buildings={buildings} />
        </div>
    )
}

export default MapPage

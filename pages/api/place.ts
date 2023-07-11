import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { latitude, longitude, placeName, description } = req.body
        console.log(latitude, longitude, placeName)
        try {
            const addPlace = await prisma.place.create({
                data: {
                    latitude: latitude,
                    longitude: longitude,
                    name: placeName,
                    description: description,
                },
            })

            res.status(200).json({ message: 'Data added successfully', data: addPlace })
        } catch (e) {
            res.status(500).json({ error: 'An error occurred while adding data' })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}

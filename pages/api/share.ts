import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { shareCode, userId } = req.body
        console.log('API ' + shareCode, userId)
        try {
            const addShareCode = await prisma.share.create({
                data: {
                    shareId: shareCode,
                    userId: userId,
                },
            })
            // const updateUser = await prisma.user.update({
            //     where: {
            //         id: userId,
            //     },
            //     data: {
            //         share: shareCode,
            //     },
            // })

            res.status(200).json({ message: 'Data added successfully', data: addShareCode })
        } catch (e) {
            res.status(500).json({ error: 'An error occurred while adding data' })
        }
    } else {
        res.status(405).json({ message: 'Method not allowed' })
    }
}

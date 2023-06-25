import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // const { latitude, longitude } = req.body
            console.log('API', req.body)
            res.status(200).json({ message: 'OK' })
        } catch (e) {
            res.status(500).json({ message: 'Miss' })
        }
    }
}

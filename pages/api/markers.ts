// api/markers.js

import ServerlessMySQL from 'serverless-mysql'

export const db = ServerlessMySQL({
    config: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    },
})

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const markers = await db.query('SELECT * FROM markers')
            res.status(200).json(markers)
        } else if (req.method === 'POST') {
            const { locationName, latitude, longitude } = req.body
            await db.query(
                'INSERT INTO markers (latitude, longitude, locationName) VALUES (?, ?, ?)',
                [latitude, longitude, locationName]
            )
            res.status(200).json({ message: 'Marker saved successfully' })
        }
    } catch (error) {
        console.error('Error processing request:', error)
        res.status(500).json({ error: 'An error occurred' })
    }
}

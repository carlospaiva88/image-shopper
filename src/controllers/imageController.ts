import {  Request, Response } from 'express'

export const uploadImage = (req: Request, res: Response) => {
    // Logica para upload da imagem

    res.status(200).send('Image uploaded successfully')
}

export const processImage = (req: Request, res: Response) => {
    res.status(200).send('Image processed successfully')
}

export const getImageResults = (req: Request, res: Response) => {
    res.status(200).send('Image results')
}
import { Pool } from "pg"
import { Request, Response } from 'express';

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT)

})


export const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS measurements (
            id SERIAL PRIMARY KEY,
            customer_code VARCHAR(50) NOT NULL,
            measure_datetime TIMESTAMP NOT NULL,
            measure_type VARCHAR(50) NOT NULL,
            image_url TEXT NOT NULL,
            measure_value INTEGER NOT NULL,
            measure_uuid UUID NOT NULL,
            confirmed_value INTEGER,
            has_confirmed BOOLEAN DEFAULT FALSE
        )
    `
    await pool.query(query);
}

// inserir um registro
export const saveMeasurement = async (measurementData: any) => {
    const query = `
        INSERT INTO measurements (customer_code, measure_datetime, measure_type, image_url, measure_value, measure_uuid)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `
    const values = [
        measurementData.customer_code,
        measurementData.measure_datetime,
        measurementData.measure_type,
        measurementData.image_url,
        measurementData.measure_value,
        measurementData.measure_uuid
    ]

    const result = await pool.query(query, values)
    return result.rows[0]
}

// atualizar um registro
export const confirmMeasurement = async (uuid:string, confirmedValue:number) => { 
    const query = `
        UPDATE measurements
        SET confirmed_value = $1, has_confirmed = TRUE
        WHERE measure_uuid = $2 AND has_confirmed = FALSE
        RETURNING *;
    `
    const values = [confirmedValue, uuid]

    const result = await pool.query(query, values)
    return result.rows[0]
}

export const listMeasurements = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Código do cliente não fornecido',
        });
    }

    try {
        let query = `SELECT * FROM measurements WHERE customer_code = $1`;
        const values = [customer_code];

        if (measure_type) {
            query += ' AND LOWER(measure_type) = LOWER($2)';
            values.push(measure_type as string);
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada',
            });
        }

        res.status(200).json({
            customer_code,
            measures: result.rows,
        });
    } catch (error) {
        res.status(500).json({
            error_code: 'INTERNAL_ERROR',
            error_description: `Erro ao listar as leituras: ${error}`,
        });
    }
};
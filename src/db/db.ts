import { Pool } from "pg"
import { Request, Response } from 'express';

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT)

})


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

    try {
        const result = await pool.query(query, values)
        console.log('Rows affected:', result.rowCount)
        console.log('Confirm Measurement Result:', result.rows[0])
        return result.rows[0]
    } catch (error) { 
        console.log('Error confirming measurement', error)
        throw error
    }
    
    
    
}

// listar um registro
export const listMeasurements = async (req: Request, res: Response) => {
    const { customer_code } = req.params;
    const { measure_type } = req.query;

    if (!customer_code) {
        return res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Código do cliente não fornecido',
        });
    }
    if (measure_type && !['WATER', 'GAS'].includes((measure_type as string).toUpperCase()))
        return res.status(400).json({
            error_code: 'INVALID_TYPE',
            error_description: 'Tipo de medição não permitida'
        })
    try {
        let query = `SELECT * FROM measurements WHERE customer_code = $1`;
        const values: any[] = [customer_code]

        if (measure_type) {
            query += ' AND LOWER(measure_type) = LOWER($2)';
            values.push((measure_type as string).toLowerCase())
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
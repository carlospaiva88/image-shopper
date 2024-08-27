import { Pool } from "pg"

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
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
        WHERE measure_uuid = $2, AND has_confirmed = FALSE
        RETURNING *;
    `
    const values = [confirmedValue, uuid]

    const result = await pool.query(query, values)
    return result.rows[0]
}
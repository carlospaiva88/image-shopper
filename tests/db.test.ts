import { saveMeasurement, confirmMeasurement  } from '../src/db/db'
import dotenv from 'dotenv'


dotenv.config()

describe('Database Functions', () => {
    it('should save a measurement', async () => {
        const measurementData = {
            customer_code: '12345',
            measure_datetime: new Date(),
            measure_type: 'WATER',
            image_url: 'http://example.com/image.png',
            measure_value: 123,
            measure_uuid: 'some-uuid'
        };
        
        const result = await saveMeasurement(measurementData);
        expect(result).toHaveProperty('measure_uuid');
    });

    it('should confirm a measurement', async () => {
        const uuid = 'some-uuid';
        const confirmedValue = 200;
        
        const result = await confirmMeasurement(uuid, confirmedValue);
        expect(result).toHaveProperty('confirmed_value', confirmedValue);
    });
});

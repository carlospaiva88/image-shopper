# Image Shopper API

## Descrição

A **Image Shopper API** permite a leitura e confirmação de medidas extraídas de imagens de medidores de água e gás, utilizando a API do Google Gemini.

## Tecnologias Utilizadas

- **TypeScript**: Linguagem de programação baseada em JavaScript que adiciona tipagem estática ao desenvolvimento.
- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **Express**: Framework para Node.js utilizado para construir a API.
- **Docker**: Plataforma para automatizar a criação, implantação e execução de aplicativos em containers.
- **Docker Compose**: Ferramenta para definir e executar aplicativos multi-container Docker.
- **Google Gemini API**: API utilizada para extrair e confirmar medidas de imagens.

---

## Endpoints

### `POST /upload`

**Descrição:** Recebe uma imagem e retorna a medida extraída.

**Request Body:**
```json
{
  "image": "base64",
  "customer_code": "string",
  "measure_datetime": "datetime",
  "measure_type": "WATER" ou "GAS"
}
```
**Response Body:**
```json
{
  "image_url": "string",
  "measure_value": integer,
  "measure_uuid": "string"
}
```
### `PATCH /confirm`

**Descrição:** Confirma ou corrige o valor lido pela API do Google Gemini.

```json
{
  "measure_uuid": "string",
  "confirmed_value": integer
}
```
**Response Body:**
```json
{
  "success": true
}
```
### `GET /<customer_code>/list`

**Descrição:** Lista as medidas realizadas por um determinado cliente.

```json
{
 "customer_code": "string",
  "measures": [
    {
      "measure_uuid": "string",
      "measure_datetime": "datetime",
      "measure_type": "string",
      "has_confirmed": boolean,
      "image_url": "string"
    }
  ]
}
```
## Acesso Local

1. **Instale as dependências:**
   ```bash
   npm install
   ```
2. **Configuração do arquivo .env:**
   ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=user
    DB_PASSWORD=password
    DB_NAME=db_name
    GEMINI_API_KEY=your_api_key
    GCLOUD_STORAGE_BUCKET=bucket_name
    GCLOUD_PROJECT_ID=project
    GCLOUD_KEY_FILE=/app/path/to/key.json
   ```
## Acesso com Docker

Para rodar a aplicação utilizando Docker, certifique-se de ter o Docker e o Docker Compose instalados. Em seguida, execute:
 ```bash
docker-compose up
```
Isso irá construir a imagem Docker e iniciar os containers necessários

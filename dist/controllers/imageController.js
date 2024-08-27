"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageResults = exports.processImage = exports.uploadImage = void 0;
const uploadImage = (req, res) => {
    // Logica para upload da imagem
    res.status(200).send('Image uploaded successfully');
};
exports.uploadImage = uploadImage;
const processImage = (req, res) => {
    res.status(200).send('Image processed successfully');
};
exports.processImage = processImage;
const getImageResults = (req, res) => {
    res.status(200).send('Image results');
};
exports.getImageResults = getImageResults;

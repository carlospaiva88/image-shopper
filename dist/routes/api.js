"use strict";
// Endpoints 
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const imageController_1 = require("../controllers/imageController");
const router = (0, express_1.Router)();
router.post('/upload', imageController_1.uploadImage);
router.post('/process', imageController_1.processImage);
router.get('/results/:id', imageController_1.getImageResults);
exports.default = router;

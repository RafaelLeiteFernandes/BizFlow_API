"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const axios_1 = __importDefault(require("axios"));
const router = (0, express_1.Router)();
router.get('/', verifyToken_1.verifyToken, (req, res) => {
    var _a;
    res.send(`Hello, ${(_a = req.user) === null || _a === void 0 ? void 0 : _a.email}. This is a protected route.`);
});
router.post('/api/data', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableName, data } = req.body;
    if (!tableName || !data) {
        return res.status(400).json({ error: 'Table name and data are required' });
    }
    try {
        const response = yield axios_1.default.post(`https://api.appsheet.com/api/v2/apps/${process.env.APPSHEET_APP_ID}/tables/${tableName}/Action`, {
            Action: 'Add',
            Properties: {},
            Rows: [data],
        }, {
            headers: {
                'ApplicationAccessKey': process.env.APPSHEET_API_KEY,
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
router.get('/api/data', verifyToken_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { tableName } = req.query;
    if (!tableName) {
        return res.status(400).json({ error: 'Table name is required' });
    }
    try {
        const response = yield axios_1.default.post(`https://api.appsheet.com/api/v2/apps/${process.env.APPSHEET_APP_ID}/tables/${tableName}/Action`, {
            Action: 'Find',
            Properties: {
                Locale: "en-US",
                Location: "47.623098, -122.330184",
                Timezone: "Pacific Standard Time",
                UserSettings: {
                    "Option 1": "value1",
                    "Option 2": "value2"
                }
            },
            Rows: []
        }, {
            headers: {
                'ApplicationAccessKey': process.env.APPSHEET_API_KEY,
            },
        });
        res.status(200).json(response.data);
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
exports.default = router;

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var promises_1 = require("fs/promises");
// console.log(__filename)
// console.log(__dirname)
var readData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var productsStr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, promises_1.readFile)("".concat(__dirname, "/data.json"), "utf-8")];
            case 1:
                productsStr = _a.sent();
                return [2 /*return*/, productsStr];
        }
    });
}); };
var getProductsController = function (req, res) {
    var wrapper = function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, productsArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readData()];
                case 1:
                    products = _a.sent();
                    productsArray = JSON.parse(products);
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify(productsArray));
                    return [2 /*return*/];
            }
        });
    }); };
    wrapper();
};
var getProductController = function (req, res) {
    var id = req.url && req.url.split("/")[2];
    var wrapper = function () { return __awaiter(void 0, void 0, void 0, function () {
        var products, parsedProducts, product;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readData()];
                case 1:
                    products = _a.sent();
                    parsedProducts = JSON.parse(products);
                    product = parsedProducts.find(function (product) { return product._id === id; });
                    if (product) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.end(JSON.stringify(product));
                    }
                    else {
                        res.statusCode = 404;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("Product not found");
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    wrapper();
};
//create a server
var server = (0, http_1.createServer)(function (req, res) {
    var _this = this;
    var _a, _b;
    try {
        // console.log(`The req.url: ${req.url}`)
        if (req.method === "GET") {
            if (req.url === "/") {
                // res.statusCode = 200;
                // res.setHeader("Content-Type", "text/plain");
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Hello Root Route");
            }
            else if (req.url === "/products") {
                getProductsController(req, res);
            }
            else if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.match(/^\/products\/(\d+)$/)) {
                getProductController(req, res);
            }
            else {
                // res.statusCode = 404;
                // res.setHeader("Content-Type", "text/html");
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Not Found</h1>");
            }
        }
        else if (req.method === "POST") {
            if (req.url === "/products/create") {
                var body_1 = "";
                req.on("data", function (chunk) {
                    body_1 += chunk.toString();
                });
                req.on("end", function () {
                    // console.log("Body:" + body)
                    try {
                        if (req.headers["content-type"] === "application/json") {
                            var newProduct_1 = JSON.parse(body_1);
                            if (typeof newProduct_1 != "object") {
                                res.writeHead(400, { "Content-Type": "text/plain" });
                                res.end("Invalid Format. Needs to be an object.");
                                return;
                            }
                            if (!newProduct_1.hasOwnProperty('_id') || !newProduct_1.hasOwnProperty('name')) {
                                res.writeHead(400, { "Content-Type": "text/plain" });
                                res.end("Invalid Format. Need required properties.");
                                return;
                            }
                            var wrapper = function () { return __awaiter(_this, void 0, void 0, function () {
                                var products, parsedProducts, e_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            _a.trys.push([0, 3, , 4]);
                                            return [4 /*yield*/, readData()];
                                        case 1:
                                            products = _a.sent();
                                            parsedProducts = JSON.parse(products);
                                            parsedProducts.push(newProduct_1);
                                            return [4 /*yield*/, (0, promises_1.writeFile)("".concat(__dirname, "/data.json"), JSON.stringify(parsedProducts, null, 2))];
                                        case 2:
                                            _a.sent();
                                            res.statusCode = 201;
                                            res.setHeader("Content-Type", "application/json");
                                            res.end(JSON.stringify(newProduct_1));
                                            return [3 /*break*/, 4];
                                        case 3:
                                            e_1 = _a.sent();
                                            res.writeHead(500, { "Content-Type": "text/plain" });
                                            res.end("Internal Server Error. (Create Wrapper)");
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); };
                            wrapper();
                        }
                        else {
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end("Inavlid Content Type.");
                        }
                    }
                    catch (e) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Internal Server Error. (End)");
                    }
                });
            }
            else {
                // res.statusCode = 404;
                // res.setHeader("Content-Type", "text/html");
                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Not Found</h1>");
            }
        }
        else if (req.method === "DELETE") {
            if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.match(/^\/products\/delete\/(\d+)$/)) {
                var id_1 = req.url.split("/").pop();
                var wrapper = function () { return __awaiter(_this, void 0, void 0, function () {
                    var products, parsedProducts, newProducts, e_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, readData()];
                            case 1:
                                products = _a.sent();
                                parsedProducts = JSON.parse(products);
                                newProducts = parsedProducts.filter(function (product) { return product._id !== id_1; });
                                return [4 /*yield*/, (0, promises_1.writeFile)("".concat(__dirname, "/data.json"), JSON.stringify(newProducts, null, 2))];
                            case 2:
                                _a.sent();
                                res.statusCode = 200;
                                res.setHeader("Content-Type", "text/plain");
                                res.end("Product deleted");
                                return [3 /*break*/, 4];
                            case 3:
                                e_2 = _a.sent();
                                res.writeHead(500, { "Content-Type": "text/plain" });
                                res.end("Internal Server Error. (Delete Wrapper)");
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                wrapper();
            }
        }
        else {
            throw new Error("Method not allowed."); //throw if not get, post, delete
        }
    }
    catch (e) {
        // console.log(e)
        // res.statusCode = 500;
        // res.setHeader("Content-Type", "text/plain");
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error. (Main)");
    }
});
var port = 8080;
server.listen(port, function () {
    console.log("Server running on http://localhost:".concat(port));
});

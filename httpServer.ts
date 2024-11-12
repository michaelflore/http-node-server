import { createServer, IncomingMessage, ServerResponse } from "http";
import { readFile, writeFile } from "fs/promises";

// console.log(__filename)
// console.log(__dirname)

const readData = async () => {
    const productsStr = await readFile(`${__dirname}/data.json`, "utf-8");

    return productsStr;
}

const getProductsController = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    
    const wrapper = async () => {
        
        try {

            const products = await readData();
        
            const productsArray = JSON.parse(products);
            
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");

            res.end(JSON.stringify(productsArray));

        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end("Internal Server Error. (Get Products)");
        }

    }

    wrapper();
}

const getProductController = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => {
    const id = req.url && req.url.split("/")[2];

    const wrapper = async () => {

        try {

            const products = await readData();

            const parsedProducts = JSON.parse(products);

            const product = parsedProducts.find((product: any) => product._id === id);

            if(product) {

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(product));

            } else {

                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Product not found");

            }

        } catch (e) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end("Internal Server Error. (Get Product)");
        }

    }

    wrapper();
}

//create a server
const server = createServer(function( req, res ) {

    try {
        // console.log(`The req.url: ${req.url}`)

        if(req.method === "GET") {

            if(req.url === "/") {

                // res.statusCode = 200;
                // res.setHeader("Content-Type", "text/plain");

                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Hello Root Route");

            } else if (req.url === "/products") {

                getProductsController(req, res);

            } else if (req.url?.match(/^\/products\/(\d+)$/)) {

                getProductController(req, res);

            } else {
                // res.statusCode = 404;
                // res.setHeader("Content-Type", "text/html");

                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Not Found</h1>");
            }

        } else if (req.method === "POST") {

            if(req.url === "/products/create") {

                let body = "";

                req.on("data", (chunk) => { //chunk is a buffer
                    body += chunk.toString();
                });

                req.on("end", () => {
                    // console.log("Body:" + body)

                    try {
                        if (req.headers["content-type"] === "application/json") {

                            const newProduct = JSON.parse(body);
    
                            if(typeof newProduct != "object") {
                                res.writeHead(400, { "Content-Type": "text/plain" });
                                res.end("Invalid Format. Needs to be an object.");
    
                                return;
                            }
    
                            if(!newProduct.hasOwnProperty('_id') || !newProduct.hasOwnProperty('name')) {
                                res.writeHead(400, { "Content-Type": "text/plain" });
                                res.end("Invalid Format. Need required properties.");
    
                                return;
                            }
    
                            const wrapper = async () => {
                                try {

                                    const products = await readData();
                                    const parsedProducts = JSON.parse(products);
        
                                    parsedProducts.push(newProduct);
        
                                    await writeFile(`${__dirname}/data.json`, JSON.stringify(parsedProducts, null, 2));
        
                                    res.statusCode = 201;
                                    res.setHeader("Content-Type", "application/json");
                                    res.end(JSON.stringify(newProduct));
    
                                } catch (e) {
                                    res.writeHead(500, { "Content-Type": "text/plain" });
                                    res.end("Internal Server Error. (Create Wrapper)");
                                }
                            }
    
                            wrapper();
    
                        } else {
                            res.writeHead(400, { "Content-Type": "text/plain" });
                            res.end("Inavlid Content Type.");
                        }

                    } catch (e) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Internal Server Error. (End)");
                    }
                    
                });

            } else {
                // res.statusCode = 404;
                // res.setHeader("Content-Type", "text/html");

                res.writeHead(404, { "Content-Type": "text/html" });
                res.end("<h1>Not Found</h1>");
            }


        } else if (req.method === "DELETE") {

            if(req.url?.match(/^\/products\/delete\/(\d+)$/)) {

                const id = req.url.split("/").pop();

                const wrapper = async () => {

                    try {

                        const products = await readData();
                        const parsedProducts = JSON.parse(products);

                        const newProducts = parsedProducts.filter((product: any) => product._id !== id);

                        await writeFile(`${__dirname}/data.json`, JSON.stringify(newProducts, null, 2));

                        res.statusCode = 200;
                        res.setHeader("Content-Type", "text/plain");
                        res.end("Product deleted");

                    } catch (e) {
                        res.writeHead(500, { "Content-Type": "text/plain" });
                        res.end("Internal Server Error. (Delete Wrapper)");
                    }

                }

                wrapper();

            }

        } else {
            throw new Error("Method not allowed."); //throw if not get, post, delete
        }

    } catch (e) {

        // console.log(e)

        // res.statusCode = 500;
        // res.setHeader("Content-Type", "text/plain");
        
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Internal Server Error. (Main)");

    }
    
});

const port = 8080;

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

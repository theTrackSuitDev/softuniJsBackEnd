const url = require("url");
const fs = require("fs");
const path = require("path");
const qs = require("querystring");
const formidable = require("formidable");
const cats = require("../data/cats.json");
const breeds = require("../data/breeds.json");

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    if (pathname === "/cats/add-cat" && req.method === "GET") {
        let filePath = path.normalize(
            path.join(__dirname, "../views/addCat.html")
        );

        const index = fs.createReadStream(filePath);
        
        index.on("data", (data) => {
            let catBreedPlaceholder = breeds.map((breed) => `<option value="${breed}">${breed}</option>`);

            let modifiedData = data.toString().replace("{{catBreeds}}", catBreedPlaceholder);

            res.write(modifiedData);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.write(`400 Bad Request \n ${err}`);
            res.end();
        });

    } else if (pathname === "/cats/add-breed" && req.method === "GET") {
        let filePath = path.normalize(
            path.join(__dirname, "../views/addBreed.html")
        );

        const index = fs.createReadStream(filePath);
        
        index.on("data", (data) => {
            res.write(data);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.write(`400 Bad Request \n ${err}`);
            res.end();
        });

    } else if (pathname === "/cats/add-breed" && req.method === "POST") {
        let formData = "";

        req.on("data", (data) => {
            formData += data;
        });

        req.on("end", () => {
            let body = qs.parse(formData);

            fs.readFile("./data/breeds.json", (err, data) => {
                if(err) {
                    console.log(err);
                    res.writeHead(400, {
                        "Content-Type": "text/plain"
                    });
                    res.write(`400 Bad Request \n ${err}`);
                    res.end();
                }

                let breeds = JSON.parse(data);
                breeds.push(body.breed);
                let json = JSON.stringify(breeds);

                fs.writeFile("./data/breeds.json", json, "utf-8", () => console.log("The breed was added successfully"));

                res.writeHead(301, { location: "/" });
                res.end();
            });

        });

    } else if (pathname === "/cats/add-cat" && req.method === "POST") {

        let form = new formidable.IncomingForm();
        let mainDir = path.dirname(require.main.filename);
        let imgDir = path.normalize(path.join(mainDir, './content/images/'));
        form.uploadDir = imgDir;
        form.options.allowEmptyFiles = true;
        form.options.minFileSize = 0;

        form.parse(req, (err, fields, files) => {
            if(err) {
                console.log(err);
                res.writeHead(400, {
                    "Content-Type": "text/plain"
                });
                res.write(`400 Bad Request \n ${err}`);
                res.end();
            }

            if (files.upload[0].originalFilename) {

                let oldPath = files.upload[0].filepath;
                let newPath = path.normalize(path.join(imgDir, `${files.upload[0].newFilename}---` + files.upload[0].originalFilename));

                fs.rename(oldPath, newPath, (err) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(400, {
                            "Content-Type": "text/plain"
                        });
                        res.write(`400 Bad Request \n ${err}`);
                        res.end();
                    }
    
                    console.log("File was uploaded and named successfully!");
                });
            }

            fs.readFile("./data/cats.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(400, {
                        "Content-Type": "text/plain"
                    });
                    res.write(`400 Bad Request \n ${err}`);
                    res.end();
                }

                let allCats = JSON.parse(data);
                let newUniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);

                let newCat = {
                    id: newUniqueId,
                    name: fields.name,
                    description: fields.description,
                    breed: fields.breed,
                }

                if (files.upload[0].originalFilename) {
                    newCat.image = `${files.upload[0].newFilename}---` + files.upload[0].originalFilename;
                } else {
                    newCat.image = "catIcon.png";
                }

                allCats.push(newCat);

                let json = JSON.stringify(allCats);

                fs.writeFile("./data/cats.json", json, () => {
                    res.writeHead(301, { location: "/" });
                    res.end();
                });
            });
        });
    } else if (pathname.includes("/cats-edit") && req.method === "GET") {
        let filePath = path.normalize(
            path.join(__dirname, "../views/editCat.html")
        );

        const index = fs.createReadStream(filePath);
        
        index.on("data", (data) => {
            let editId = pathname.split("/").pop();
            let catData = cats.find((cat) => cat.id === editId);

            let catBreedPlaceholder = breeds.map((breed) => {
                if (breed === catData.breed[0]) {
                    return `<option selected value="${breed}">${breed}</option>`
                } else {
                    return `<option value="${breed}">${breed}</option>`
                }
            });

            let modifiedData = data.toString().replace("{{id}}", catData.id);
            modifiedData = modifiedData.replace("{{name}}", catData.name[0]);
            modifiedData = modifiedData.replace("{{description}}", catData.description[0]);
            modifiedData = modifiedData.replace("{{catBreeds}}", catBreedPlaceholder);

            res.write(modifiedData);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.write(`400 Bad Request \n ${err}`);
            res.end();
        }); 
    } else if (pathname.includes("/cats-edit") && req.method === "POST") {

        let form = new formidable.IncomingForm();
        let mainDir = path.dirname(require.main.filename);
        let imgDir = path.normalize(path.join(mainDir, './content/images/'));
        form.uploadDir = imgDir;
        form.options.allowEmptyFiles = true;
        form.options.minFileSize = 0;

        let editId = pathname.split("/").pop();
        let editIndex = cats.findIndex((cat) => cat.id === editId);

        form.parse(req, (err, fields, files) => {
            if(err) {
                console.log(err);
                res.writeHead(400, {
                    "Content-Type": "text/plain"
                });
                res.write(`400 Bad Request \n ${err}`);
                res.end();
            }

            let oldPath = files.upload[0].filepath;
            let newPath = path.normalize(path.join(imgDir, `${files.upload[0].newFilename}---` + files.upload[0].originalFilename));

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    console.log(err);
                    res.writeHead(400, {
                        "Content-Type": "text/plain"
                    });
                    res.write(`400 Bad Request \n ${err}`);
                    res.end();
                }

                console.log("File was uploaded and named successfully!");
            });

            let oldImagePath = path.join("./content/images/" + cats[editIndex].image);

            fs.readFile("./data/cats.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(400, {
                        "Content-Type": "text/plain"
                    });
                    res.write(`400 Bad Request \n ${err}`);
                    res.end();
                }

                let allCats = JSON.parse(data);
                let newData = {
                    id: editId,
                    name: fields.name,
                    description: fields.description,
                    breed: fields.breed,
                }

                if (files.upload[0].originalFilename) {
                    newData.image = `${files.upload[0].newFilename}---` + files.upload[0].originalFilename;

                    if (cats[editIndex].image != "catIcon.png") {
                        fs.rm(oldImagePath, (err) => {
                            if (err) {
                                console.log(err);
                                res.writeHead(400, {
                                    "Content-Type": "text/plain"
                                });
                                res.write(`400 Bad Request \n ${err}`);
                                res.end();
                            }
            
                            console.log("Old image deleted successfully!");
                        });
                    }
                } else {
                    newData.image = allCats[editIndex].image;
                }

                allCats.splice(editIndex, 1, newData);
                let json = JSON.stringify(allCats);

                fs.writeFile("./data/cats.json", json, () => {
                    res.writeHead(301, { location: "/" });
                    res.end();
                });
            });
        });
    } else if (pathname.includes("/cats-find-new-home") && req.method === "GET") {

        let catId = pathname.split("/").pop();
        let catData = cats.find((cat) => cat.id === catId);

        let filePath = path.normalize(
            path.join(__dirname, "../views/catShelter.html")
        );

        const index = fs.createReadStream(filePath);
        
        index.on("data", (data) => {

            let modifiedData = data.toString().replace("{{id}}", catData.id);
            modifiedData = modifiedData.replace("{{image}}", path.join("../content/images/" + catData.image));
            modifiedData = modifiedData.replace("{{altImg}}", catData.name[0]);
            modifiedData = modifiedData.replace("{{name}}", catData.name[0]);
            modifiedData = modifiedData.replace("{{description}}", catData.description[0]);
            modifiedData = modifiedData.replace("{{breed}}", catData.breed[0]);
            modifiedData = modifiedData.replace("{{breed}}", catData.breed[0]);

            res.write(modifiedData);
        });

        index.on("end", () => {
            res.end();
        });

        index.on("error", (err) => {
            console.log(err);
            res.writeHead(400, {
                "Content-Type": "text/plain"
            });
            res.write(`400 Bad Request \n ${err}`);
            res.end();
        });

    } else if (pathname.includes("/cats-find-new-home") && req.method === "POST") {

        let deleteId = pathname.split("/").pop();
        
        fs.readFile("./data/cats.json", (err, data) => {
            if(err) {
                console.log(err);
                res.writeHead(400, {
                    "Content-Type": "text/plain"
                });
                res.write(`400 Bad Request \n ${err}`);
                res.end();
            }

            let cats = JSON.parse(data);
            let deleteIndex = cats.findIndex((cat) => cat.id === deleteId);

            let oldImagePath = path.join("./content/images/" + cats[deleteIndex].image);

            if (cats[deleteIndex].image != "catIcon.png") {
                fs.rm(oldImagePath, (err) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(400, {
                            "Content-Type": "text/plain"
                        });
                        res.write(`400 Bad Request \n ${err}`);
                        res.end();
                    }
    
                    console.log("Image file deleted successfully!");
                });
            }

            cats.splice(deleteIndex, 1);
            let json = JSON.stringify(cats);

            fs.writeFile("./data/cats.json", json, "utf-8", () => console.log("The cat found its happy new home!"));

            res.writeHead(301, { location: "/" });
            res.end();
        });

    } else {
        return true;
    }
}
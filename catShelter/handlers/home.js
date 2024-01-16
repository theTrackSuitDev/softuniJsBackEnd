const url = require("url");
const fs = require("fs");
const qs = require("querystring");
const path = require("path");
const cats = require("../data/cats.json");
const breeds = require("../data/breeds.json");

module.exports = (req, res) => {
    const pathname = url.parse(req.url).pathname;
    
    if (pathname === "/" && req.method === "GET") {
        let filePath = path.normalize(
            path.join(__dirname, "../views/home/index.html")
        );

        const index = fs.createReadStream(filePath);
        
        index.on("data", (data) => {
            let catListPlaceholder = cats.map((cat) => `<li>
            <img src="${path.join("./content/images/" + cat.image)}" alt="${cat.name[0]}">
            <h3>${cat.name[0]}</h3>
            <p><span>Breed: </span>${cat.breed[0]}</p>
            <p><span>Description: </span>${cat.description[0]}</p>
            <ul class="buttons">
                <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
                <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
            </ul>
        </li>`);

            let modifiedData = data.toString().replace("{{cats}}", catListPlaceholder.join("\n"));

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
            return;
        });
    } else if (pathname === "/" && req.method === "POST") {

        let formData = "";

        req.on("data", (data) => {
            formData += data;
        });

        req.on("end", () => {
            let body = qs.parse(formData);

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
                let searchText = body.search;
                let searchResult = cats.filter((cat) => cat.name[0].includes(searchText));

                let filePath = path.normalize(
                    path.join(__dirname, "../views/home/index.html")
                );

                console.log(filePath);
        
                const index = fs.createReadStream(filePath);
                
                index.on("data", (data) => {

                    let catListPlaceholder = "";
                    let modifiedData = "";

                    if (searchResult.length > 0) {
                        catListPlaceholder = searchResult.map((cat) => `<li>
                        <img src="${path.join("./content/images/" + cat.image)}" alt="${cat.name[0]}">
                        <h3>${cat.name[0]}</h3>
                        <p><span>Breed: </span>${cat.breed[0]}</p>
                        <p><span>Description: </span>${cat.description[0]}</p>
                        <ul class="buttons">
                            <li class="btn edit"><a href="/cats-edit/${cat.id}">Change Info</a></li>
                            <li class="btn delete"><a href="/cats-find-new-home/${cat.id}">New Home</a></li>
                        </ul>
                        </li>`);

                        modifiedData = data.toString().replace("{{cats}}", catListPlaceholder.join("\n"));
                    } else {
                        catListPlaceholder = "<h3>No matches found</h3>";
                        modifiedData = data.toString().replace("{{cats}}", catListPlaceholder);
                    }
        
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
                    return;
                });

            });

        });

    } else {
        return true;
    }
}

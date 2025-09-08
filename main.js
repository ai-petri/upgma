import { createMatrix, buildTree } from "./tree.js";


let data =
{
    "Sample 1": [12,0,5,3,1],
    "Sample 2": [0,8,2,0,7],
    "Sample 3": [4,6,0,9,0],
    "Sample 4": [15,1,0,0,4],
    "Sample 5": [0,0,10,2,8]
}

let table = createTable(data);
document.body.append(table);

let distanceMatrix = createMatrix(data);
let tree = buildTree(distanceMatrix);
let image = new Image();
image.src = tree.createImage(800,600);
document.body.append(image);


function createTable(data)
{
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let header = document.createElement("tr");
    for(let i=0; i<Math.max(...Object.values(data).map(o=>o.length)) + 1; i++)
    {
        let th = document.createElement("th");
        if(i>0) th.innerText = `Species ${i}`;
        header.append(th);
    }
    thead.append(header);
    table.append(thead);

    let tbody = document.createElement("tbody");
    for(let prop in data)
    {
        let tr = document.createElement("tr");
        let th = document.createElement("th");
        th.innerText = prop;
        tr.append(th);
        for(let item of data[prop])
        {
            let td = document.createElement("td");
            td.innerText = item;
            tr.append(td);
        }
        tbody.append(tr);
    }
    table.append(tbody);

    return table;
}
import { getBrayCurtis } from "./BrayCurtis.js";

export function createMatrix(obj)
{
    let matrix = {}
    for(let sample1 in obj)
    {
        matrix[sample1] = {};
        for(let sample2 in obj)
        {
            matrix[sample1][sample2] = getBrayCurtis(obj[sample1], obj[sample2]);
        }
    }
    return matrix;
}

export function buildTree(matrix)
{
    var links = [];
    var oldMatrix = matrix;
    while(Object.keys(matrix).length > 1)
    {
        matrix = go(matrix, oldMatrix);
    }

    links.reverse();


    if(links.length>0)
    {
        var tree = new Node(links[0][2]);
        tree.grow();

        return tree;
    }
    else
    {
        return new Node();
    }
    



    function Node(name)
    {
        this.name = name;
        this.children = [];
        this.parent = null;
        this.distance = 0;

        this.grow = function()
        {
            var link = links.filter(o=>o[2] == this.name)[0];

            if(!link) return;

            this.distance = link[3];
            
            this.children.push(new Node(link[0]), new Node(link[1]));

            for(let child of this.children)
            {
                child.parent = this;
                child.grow();
            }
        }

        this.createImage = function(width=2000, height=2000)
        {
            var max = 1;
            var canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = "white";
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.fillStyle = "black";
            ctx.font = `${Math.ceil(0.03*canvas.height)}px Times New Roman`;
            ctx.lineWidth = Math.ceil(0.005*canvas.height);
            ctx.lineCap = "square";
            ctx.textBaseline = "top"

            var w = 0.6*canvas.width;
            var h = 0.8*canvas.height;
            var gap = 0.05*canvas.height;
            ctx.strokeStyle = "black";
            ctx.beginPath();
            ctx.moveTo(0,h + gap);
            ctx.lineTo(w,h + gap);
            for(let n of [0,0.25,0.5,0.75,1])
            {
                ctx.moveTo(n*w,h+gap);
                ctx.lineTo(n*w,h+gap+0.01*canvas.height);
                ctx.fillText((max*n).toFixed(2),n*w,h+gap+0.04*canvas.height);
            }

            ctx.textAlign = "center";
            ctx.fillText("Сходство", w/2,h+gap+140);
            ctx.textAlign = "left";

            ctx.stroke();

            ctx.textBaseline = "middle";


            ctx.strokeStyle = "blue";



            draw(this, 0, h/2, w, h);

            function draw(node,x0, y0, width, height, notFirstNode=false)
            {
                var offset = (1-node.distance/max)*width;
                ctx.beginPath();
                if(notFirstNode)
                {
                    ctx.moveTo(x0,y0);
                    ctx.lineTo(offset,y0);
                    ctx.stroke();
                }
                
                if(node.children.length == 2)
                {
                    

                    ctx.moveTo(offset,y0-height/4);
                    ctx.lineTo(offset,y0+height/4);
                    ctx.stroke();


                    draw(node.children[0],offset,y0-height/4, width, height/2, true);
                    draw(node.children[1],offset,y0+height/4, width, height/2, true);
                }
                else
                {
                    if(height>0.02*canvas.height)
                    ctx.fillText(node.name,offset+12,y0);
                }
                

            }
            


            return canvas.toDataURL("image/jpeg", 1.0);

        }

        return this;
    }

    
    


    function go(matrix, oldMatrix)
    {

        var [pair,distance] = getMin(matrix);

        var part1 = pair[0].startsWith("&")? pair[0].slice(1): pair[0];     // <---------------
        var part2 = pair[1].startsWith("&")? pair[1].slice(1): pair[1];     // <---------------
        var newName = "&"+ [part1,part2].join(",");                         //<-----------------

        links.push([...pair, newName, distance]);
 
        var result = {};

        var names = Object.keys(matrix).filter(o=>!pair.includes(o));

        names.push(newName);

        for(let col of names)
        {
            result[col] = {};
            for(let row of names)
            {

                let cols = col.startsWith("&")? col.slice(1).split(","): [col];
                let rows = row.startsWith("&")? row.slice(1).split(","): [row];
                let value = 0;
                let n = 0;
                for(let c of cols)
                {
                    for(let r of rows)
                    {
                        value += oldMatrix[c][r];
                        n++;
                    }
                }
                value = value / n; 

                result[col][row] = value;
            }
        }

        return result;
    }

    function getMin(matrix)
    {
        var min;
        var pair = [];
        for(let col in matrix)
        {
            for(let row in matrix[col])
            {   
                if(col !== row && (!min || matrix[col][row] < min))
                {
                    pair = [col, row];
                    min = matrix[col][row];
                }
            }
        }

        return [pair,min];
    }

}


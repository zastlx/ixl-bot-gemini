import { parseFromString } from "dom-parser";
import parse from 'html-dom-parser';

let a = 'Evaluate.<br/><br/><div class="old-space-indent"><span>2</span><sup class="old-superscript-in-expression" style="bottom: 0.92ex">24</sup> = <span class="old-fi-holder" data-index="0"></span></div>'

function parseQuestion(text) {
    let tree = parse(`<div>${text.replace(/<sup .{0,}\>(\d{1,3})\<\/sup>/gm, "^$1")}</div>`);
    let question = "";


    function getChild(node) {
        if (node.children) {
            for (let i = 0; i < node.children.length; i++) {
                getChild(node.children[i])
            }
        }
        else question += node.data.replace(".", ": ")
        
    }
    
    getChild(tree[0])
    return question;
}

console.log(parseQuestion(a));
//console.log(a.replace(/<sup .{0,}\>(\d{1,3})\<\/sup>/gm, "^$1"))
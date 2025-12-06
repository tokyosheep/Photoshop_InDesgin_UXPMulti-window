const { entrypoints } = require("uxp");

const TEXT_CLASS = "text";



/**
 * obtaining current theme and listening theme change event.
 */
const init = () => {
    const initTheme = document.theme.getCurrent();
    document.getElementById("interface").textContent = `Current theme: ${initTheme}`;
    document.theme.onUpdated.addListener((event) => {
        console.log("theme updated:", event);
        document.getElementById("interface").textContent = `Current theme: ${event}`;
    });
}
init ();

// these methods just create HTML element. 

const createBase = (elm,titleText) =>{
    const container = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = titleText;
    title.classList.add(TEXT_CLASS);
    container.appendChild(title);
    elm.appendChild(container);
    return {container:container,title:title};
}

const createTextBox = (base,id,value = "text") =>{
    const textBox = document.createElement("input");
    textBox.type = "text";
    textBox.id = id;
    textBox.value = value;
    base.appendChild(textBox);
    return textBox;
}

const createButton = (base,id,text="button") =>{
    const button = document.createElement("button");
    button.textContent = text;
    button.id = id;
    base.appendChild(button);
    return button;
}

class Connection{
    constructor(){
        this.elm = document.createElement("h2");
        this.elm.classList.add(TEXT_CLASS);
    }

    setElm(base){
        base.appendChild(this.elm);
    }

    sendMsg(msg){
        this.elm.textContent = msg;
    }
}

const connect = new Connection();

// entryponits constructs basic UXP panel data.

/**
 * first and second panel's elements constructed through JS.
 * 
 * panel's name must be matched manifst's panel id.
 */
entrypoints.setup({
    panels:{
        first:{
            /**
             * 
             * *** Note ***
             * this object bit different on manifest 4 or 5.
             * this code is adapted on manifest 5.
             * 
             * show call back method to be fired when panel is opened.
             * this receives 
             * html object which belongs panel it self.
             * @param {HTMLElement} event 
             */
            show(event){
                console.log("first", event);
                const target_panel = document.getElementById("target_panel");
                console.log(target_panel);
                const title = document.createElement("h2");
                title.classList.add(TEXT_CLASS);
                title.textContent = "title";
                target_panel.appendChild(title);
                const element = createBase(event,"first");
                const messageBox = createTextBox(element.container,"message");
                const button = createButton(element.container,"btn");
                button.addEventListener("click",()=>{
                    connect.sendMsg(messageBox.value);
                });
            }
        },
        second:{
            show(event){
                console.log("second", event);
                const element = createBase(event,"second");
                connect.setElm(element.container);
            }
        },
        third: {
            show(event) {
                console.log("third", event);
                // third panel's elements constructed on html.
                // inside uxp-panel Web Component.
                //I think this is better way to develop multi-panel
                
                /**
                 * this elm'll be displayed on first panel.
                 * even here looks like third scope though.
                 */
                const textElm = document.createElement('p');
                textElm.textContent = 'added from third panel scope.';
                textElm.classList.add(TEXT_CLASS);
                document.body.appendChild(textElm);
            }
        },
        fourth: {
            show (event) {
                console.log("four", event);
                
            }
        }
    }
});
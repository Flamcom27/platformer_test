import { _decorator, Component, Node, Label, input, Input, EventMouse, Button } from 'cc';
import { PlayerController } from "./PlayerController";

const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Button)
    jumpOneBtn: Button | null = null;
    @property(Button)
    jumpTwoBtn: Button | null = null;
    @property(Button)
    logoBtn: Button | null = null;

    @property(Boolean)
    redirect: Boolean = false;

    @property(Label)
    stepCounter: Label | null = null;

    @property({ type: Number, step: 1, min: 0 })
    stepLimit: number = 10;

    private _curScore: number = 0;
    private static _instance: GameManager | null = null

    static get instance(): GameManager {
        return GameManager._instance;
    }

    onLoad() {
        if (GameManager._instance === null) {
            GameManager._instance = this;
        } else {
            console.error('Only one GameManager instance is allowed!');
            this.destroy();
        }
    }

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        this.jumpOneBtn.node.on(Button.EventType.CLICK, this.onButtonClicked("OneStep"), this);
        this.jumpTwoBtn.node.on(Button.EventType.CLICK, this.onButtonClicked("TwoStep"), this);
        this.logoBtn.node.on(Button.EventType.CLICK, this.onButtonClicked("Logo"));
    }
    /**
     * onButtonClicked is a closure, that returns handler functions for buttons
     * It solves the third and the fourth tasks.
     * @param {"OneStep" | "TwoStep" | "Logo"} type is a type of a button.
     */
    onButtonClicked(type: "OneStep" | "TwoStep" | "Logo") {
        switch (type) {
            case "OneStep":
                return () => {
                    PlayerController.instance.jumpByStep(1, "OneStep");
                    this.incrementStepCounter(1);
                }
            case "TwoStep":
                return () => {
                    PlayerController.instance.jumpByStep(2, "TwoStep");
                    this.incrementStepCounter(2);
                }
            case "Logo":
                return GameManager.redirectToStore;
        }
    }
    onMouseUp(event: EventMouse) {
        const button = event.getButton()
        if (button === 0 || button === 2) {
            const step: number = { 0: 1, 2: 2 }[button]
            this.incrementStepCounter(step);
        }
    }
    /**
     * incrementStepCounter is a function, that counts steps and checks if step limit is reached
     * It solves the fifth task.
     * @param {number} step
     */
    incrementStepCounter(step: number) {
        this._curScore += step;
        this.stepCounter.string = String(this._curScore);
        if (this.stepLimit <= this._curScore) {
            GameManager.redirectToStore()
        }
    }

    static redirectToStore() {
        if (GameManager.instance.redirect) {
            location.replace("https://play.google.com/store/games");
        }
    }
    update(deltaTime: number) {
        
    }
}



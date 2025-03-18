import { _decorator, Component, Node, Label, input, Input, EventMouse } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {


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
    }
    onMouseUp(event: EventMouse) {
        let button = event.getButton()
        if (button === 0 || button === 2) {
            this._curScore += { 0: 1, 2: 2 }[button]
            this.stepCounter.string = String(this._curScore);
            this.checkLimitReached();
        }
    }
    checkLimitReached() {
        if (this.stepLimit <= this._curScore) {
            GameManager.redirectToStore()
        }
    }
    static redirectToStore() {
        if (this.instance.redirect) {
            location.replace("https://play.google.com/store/games");
        }
    }
    update(deltaTime: number) {
        
    }
}



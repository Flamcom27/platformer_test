import { Component, Input, _decorator, input, EventMouse, Vec3, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    private _startJump: boolean = false;
    private _curPos: Vec3 = new Vec3();
    private _targetPos: Vec3 = new Vec3();
    private _jumpTime: number = 0.1;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    onMouseUp(event: EventMouse) {
        let button = event.getButton()
        if ( (button === 0 || button === 2) && !this._startJump ) {
            this.jumpByStep( {0: 1, 2: 2}[button] );
        }
    }
    jumpByStep(step: number) {
        this._startJump = true;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(step, 0, 0));
        tween(this.node)
            .to(this._jumpTime, { position: this._targetPos }, {
                easing: "linear",
                onComplete: () => {
                    this._startJump = false;
                }
            })
            .start()
    }
    //update(deltaTime: number) {
        
    //}    
}



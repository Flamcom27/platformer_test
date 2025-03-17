import { Component, Input, _decorator, input, EventMouse, Vec3, Tween, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _targetPos: Vec3 = new Vec3();
    private _curJumpSpeed: number = 0;
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _curJumpTime: number = 0;
    private _jumpTime: number = 1;

    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }
    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        }
        else if (event.getButton() === 2) {
            this.jumpByStep(2);
        }
    }
    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this.node.getPosition(this._curPos);

        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));
    }
    update(deltaTime: number) {
        if (this._startJump) { 
            this._curJumpTime += deltaTime;  
            if (this._curJumpTime > this._jumpTime) { 
                this.node.setPosition(this._targetPos); 
                this._startJump = false
            } else {
                tween(this.node)
                    .to(this._jumpTime, { position: this._targetPos }, { easing: "linear" })
                    .start()
            }
        }
        
    }

    
}



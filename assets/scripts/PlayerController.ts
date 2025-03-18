import {
    Animation,
    Component,
    EventMouse,
    Input,
    Vec3,
    _decorator,
    geometry,
    input,
    tween,
    PhysicsSystem
} from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(Animation)
    bodyAnim: Animation | null = null;

    private _startJump: boolean = false;
    private _curPos: Vec3 = new Vec3();
    private _targetPos: Vec3 = new Vec3();
    private _jumpTime: number = 0.1;
    private _stepAndAnimation: Object = { 0: [1, "OneStep"], 2: [2, "TwoStep"] };
    private static _instance: PlayerController | null = null;

    static get instance(): PlayerController {
        return PlayerController._instance;
    }

    onLoad() {
        if (PlayerController._instance === null) {
            PlayerController._instance = this;
        } else {
            console.error('Only one PlayerController instance is allowed!');
            this.destroy();
        }
    }

    start(): void {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseUp(event: EventMouse): void {
        let button = event.getButton()

        if ((button === 0 || button === 2) && !this._startJump) {
            let step: number, animationClip: "OneStep" | "TwoStep";
            [step, animationClip] = this._stepAndAnimation[button];
            this.jumpByStep(step, animationClip);

        }
    }

    jumpByStep(step: number, animationClip: "OneStep" | "TwoStep"): void {
        this.bodyAnim.play( animationClip );
        this._startJump = true;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(step, 0, 0));

        tween(this.node)
            .to(this._jumpTime, { position: this._targetPos }, {
                easing: "linear",
                onComplete: () => {
                    this._startJump = false;
                    this.checkGameOver();
                }
            })
            .start()
    }

    checkGameOver() {
        const ray: geometry.Ray = new geometry.Ray();
        const targetVector: Vec3 = new Vec3();
        Vec3.add(targetVector, this.node.position, new Vec3(0, -1, 0));
        geometry.Ray.fromPoints(ray, this.node.position, targetVector);

        if (!PhysicsSystem.instance.raycast(ray)) {
            GameManager.redirectToStore();
        }
    }
    //update(deltaTime: number) {
        
    //}    
}



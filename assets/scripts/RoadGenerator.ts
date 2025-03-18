import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RoadGenerator')
export class RoadGenerator extends Component {

    @property(Prefab)
    cubePrfb: Prefab | null = null;

    @property(Node)
    player: Node | null = null;

    @property(Number)
    roadLength: number = 15;

    private _cubes: Node[] = [];
    private _playerPos: Vec3 | null = null;
    private _lastCubePosX: number | null = null;

    start(): void {
        this._playerPos = this.player.position;
        this.generateNextCube(this._playerPos.x);
    }
    /**
     * generateRoad method recursively appends new cubes and voids and deletes previous ones.
     * It solves the second task.
     * @param {Number} coordX is an x coordinate of a future cube or a void.
     */
    generateRoad(coordX: number): void {
        if (this._lastCubePosX - this.player.position.x < this.roadLength) {
            if (Math.random() > 0.5 || this._lastCubePosX - this._cubes.at(-1).position.x > 0) {
                this.generateNextCube(coordX);
            }
            this._lastCubePosX = coordX;
            this.deleteFirstCube();
            this.generateRoad(coordX + 1);
        }
    }
    generateNextCube(coordX: number): void {
        let cube: Node = instantiate(this.cubePrfb);
        cube.parent = this.node;
        cube.setPosition(new Vec3(coordX, -0.5, 0));
        this._cubes.push(cube);
    }
    deleteFirstCube(): void {
        if (this._playerPos.x - this._cubes[0].position.x > this.roadLength) {
            this._cubes.shift().destroy();
        }
    }
    update(deltaTime: number): void {
        if (this.player) {
            this.generateRoad(this._lastCubePosX + 1);
        }
    }
}



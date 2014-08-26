﻿/// <reference path="phaser.d.ts" />
/// <reference path="jquery.d.ts" />
declare module summ {
    class PauseMenu {
        public game: Phaser.Game;
        private _paused;
        public paused : boolean;
        private preUpdateFunction;
        private updateFunction;
        private tweenUpdate;
        private timeUpdate;
        public defaultSpriteKey: string;
        public defaultSpriteOver: number;
        public defaultSpriteOut: number;
        public defaultSpriteDown: number;
        public defaultSpriteUp: number;
        public defaultScaleX: number;
        public defaultScaleY: number;
        public onShowCallback: Function;
        public onHideCallback: Function;
        public showHideCallbackContext: Object;
        public menuBox: Phaser.Rectangle;
        public backgroundSprite: Phaser.Sprite;
        public buttons: Phaser.Button[];
        public buttonsText: Phaser.Text[];
        public defaultTextStyle: any;
        public spreadAlongY: boolean;
        public phaserPause: boolean;
        constructor(game: Phaser.Game, defaultSprite?: string, defaultOverFrame?: number, defaultOutFrame?: number, defaultDownFrame?: number, defaultUpFrame?: number, defaultScaleX?: number, defaultScaleY?: number, defaultTextStyle?: any, backgroundSprite?: any, stretchBackground?: boolean, menuBounds?: Phaser.Rectangle, spreadAlongY?: boolean);
        public addButton(text: string, callback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, key?: string, overFrame?: number, outFrame?: number, downFrame?: number, upFrame?: number, scaleX?: number, scaleY?: number, textStyle?: any): Phaser.Text;
        public addTextAsButton(text: string, callback?: Function, onOverSize?: number, onDownSize?: number, onOutSize?: number, callbackContext?: Object, setButtonTextInContext?: boolean, scaleX?: number, scaleY?: number, textStyle?: any): Phaser.Text;
        public addTextAsCustomizedButton(text: string, onUpCallback?: Function, onOverCallback?: Function, onDownCallback?: Function, onOutCallback?: Function, callbackContext?: Object, setButtonTextInContext?: boolean, scaleX?: number, scaleY?: number, textStyle?: any): Phaser.Text;
        public addExistingButton(buttonText: Phaser.Text, button?: Phaser.Button): void;
        public showMenu(): void;
        public hideMenu(): void;
        private updateButtonPositions();
        public manualPause(pause?: boolean): void;
        public togglePause(): void;
        private handleClick(pointer);
    }
}
declare module summ {
    class Ad extends Phaser.Sprite {
        public game: Phaser.Game;
        public upTime: number;
        public onEnd: Function;
        public onEndContext: Object;
        public clickToClear: boolean;
        constructor(game: Phaser.Game, x: number, y: number, width?: number, height?: number, key?: any, frame?: any, startDelay?: number, upTime?: number, onEnd?: Function, onEndContext?: Object, clickToClear?: boolean, centerAnchor?: boolean, stretchToFit?: boolean);
        public show(): void;
        public remove(): void;
    }
}
declare module summ {
    function urlParam(name: any): {};
    class LeaderboardMessageStructure {
        public action: string;
        public leaderboardName: string;
        public success: boolean;
        public status: string;
        public leaderboard: LeaderboardEntry[];
        public leaderboards: LeaderboardEntry[][];
    }
    class LeaderboardEntry {
        public name: string;
        public score: number;
    }
    class LeaderboardMessages {
        static sendScore(score: number, callback: Function, callbackContext: Object, timeout?: number): void;
        static requestPlayer(callback: Function, callbackContext: Object, timeout?: number): void;
        static requestScores(callback: Function, callbackContext: Object, timeout?: number): void;
    }
    class LeaderboardDisplay {
        public leaderboardNames: string[];
        public tabHeight: number;
        public controlsWidth: number;
        public slots: number;
        public currentLeaderboard: number;
        public currentPos: number;
        public leaderboards: LeaderboardEntry[][];
        public playerNames: Phaser.Text[];
        public playerScores: Phaser.Text[];
        public leaderboardGroup: Phaser.Group;
        public onExitCallback: Function;
        public onExitContext: Object;
        constructor(game: Phaser.Game, tabImage: string, exitImage: string, jumpUpImage: string, stepUpImage: string, onExitCallback?: Function, onExitContext?: Object, tabHeight?: number, controlsWidth?: number, slots?: number, bounds?: Phaser.Rectangle, tabFont?: {
            font: string;
            fill: string;
            align: string;
        }, nameStyle?: any, scoreStyle?: any, leaderboardNames?: string[]);
        public show(): void;
        public hide(): void;
        private nameOnUpFunction();
        public populateLeaderboards(leaderboardNumber?: number, startingPos?: number): void;
    }
}
declare module summ {
    class Preloader {
        static load(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string): void;
        static loadLocal(game: Phaser.Game, loadAssets: Function, context: Object, nextState: string): void;
    }
}
declare module summ {
    class FullScreenSettings {
        static apply(game: Phaser.Game): void;
    }
}
declare module summ {
    class DepthSprite extends Phaser.Sprite {
        private _depth;
        private _lastDepth;
        private _halfWidth;
        private _halfHeight;
        public up: any;
        public down: any;
        public left: any;
        public right: any;
        public zoomIn: any;
        public zoomOut: any;
        constructor(game: Phaser.Game, x: number, y: number, key?: string, frame?: any);
        public preUpdate(): void;
        public update(): void;
        public postUpdate(): void;
    }
}

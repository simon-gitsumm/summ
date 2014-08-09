﻿//#######################PauseMenu.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var PauseMenu = (function () {
        function PauseMenu(game, defaultSprite, defaultOverFrame, defaultOutFrame, defaultDownFrame, defaultUpFrame, defaultScaleX, defaultScaleY, defaultTextStyle, backgroundSprite, stretchBackground, menuBounds, spreadAlongY) {
            this._paused = false;
            this.phaserPause = false;
            this.game = game;

            this.buttons = new Array();
            this.buttonsText = new Array();

            this.defaultSpriteKey = defaultSprite;
            this.defaultSpriteOver = defaultOverFrame;
            this.defaultSpriteOut = defaultOutFrame;
            this.defaultSpriteDown = defaultDownFrame;
            this.defaultSpriteUp = defaultUpFrame;

            this.defaultScaleX = defaultScaleX || 1;
            this.defaultScaleY = defaultScaleY || 1;

            this.defaultTextStyle = defaultTextStyle;

            this.menuBox = menuBounds || this.game.camera.bounds;

            if (backgroundSprite) {
                this.backgroundSprite = backgroundSprite;
                this.backgroundSprite.anchor.set(0.5, 0.5);
                this.backgroundSprite.position.setTo(menuBounds.centerX, menuBounds.centerY);

                if (stretchBackground) {
                    this.backgroundSprite.width = this.menuBox.width;
                    this.backgroundSprite.height = this.menuBox.height;
                }
            }

            this.spreadAlongY = spreadAlongY;
        }
        Object.defineProperty(PauseMenu.prototype, "paused", {
            get: function () {
                return this.phaserPause ? this.game.paused : this._paused;
            },
            set: function (value) {
                if (value === !this.paused) {
                    this.togglePause();
                }
            },
            enumerable: true,
            configurable: true
        });


        PauseMenu.prototype.addButton = function (text, callback, callbackContext, setButtonTextInContext, key, overFrame, outFrame, downFrame, upFrame, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultSpriteKey && !key) {
                if (this.defaultTextStyle && !textStyle) {
                    console.warn('No image key was given and no default has been specified, default to a text button');
                    return this.addTextAsButton(text, callback, null, null, null, null, setButtonTextInContext, scaleX, scaleY, textStyle);
                } else
                    throw Error("No image key was given and no default has been specified");
            }
            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            this.buttonsText.push(buttonText);

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            var button = new Phaser.Button(this.game, 0, 0, key || this.defaultSpriteKey, callback, callbackContext, overFrame || this.defaultSpriteOver, outFrame || this.defaultSpriteOut, downFrame || this.defaultSpriteDown, upFrame || this.defaultSpriteUp);
            button.anchor.set(0.5, 0.5);
            button.scale.setTo(scaleX, scaleY);
            this.buttons.push(button);

            this.updateButtonPositions();
            return;
        };

        PauseMenu.prototype.addTextAsButton = function (text, callback, onOverSize, onDownSize, onOutSize, callbackContext, setButtonTextInContext, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            buttonText.inputEnabled = true;
            if (callback) {
                buttonText.events.onInputUp.add(callback, callbackContext);
                if (onOverSize)
                    buttonText.events.onInputUp.add(function () {
                        this.scale.set(onOverSize);
                    }, buttonText);
            }
            if (onOverSize)
                buttonText.events.onInputOver.add(function () {
                    this.scale.set(onOverSize);
                }, buttonText);
            if (onDownSize)
                buttonText.events.onInputDown.add(function () {
                    this.scale.set(onDownSize);
                }, buttonText);
            if (onOutSize)
                buttonText.events.onInputOut.add(function () {
                    this.scale.set(onOutSize);
                }, buttonText);

            this.buttons.push(null);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
            return;
        };

        PauseMenu.prototype.addTextAsCustomizedButton = function (text, onUpCallback, onOverCallback, onDownCallback, onOutCallback, callbackContext, setButtonTextInContext, scaleX, scaleY, textStyle) {
            scaleX = scaleX || this.defaultScaleX || 1;
            scaleY = scaleY || this.defaultScaleY || 1;

            if (!this.defaultTextStyle && !textStyle)
                throw Error("No text style was given and no default has been specified");

            var buttonText = new Phaser.Text(this.game, 0, 0, text, textStyle || this.defaultTextStyle);
            buttonText.anchor.set(0.5, 0.5);
            buttonText.scale.setTo(scaleX, scaleY);

            if (callbackContext === 'self')
                callbackContext = buttonText;

            if (setButtonTextInContext)
                callbackContext['buttonText'] = buttonText;

            buttonText.inputEnabled = true;
            if (onUpCallback)
                buttonText.events.onInputUp.add(onUpCallback, callbackContext);
            if (onOverCallback)
                buttonText.events.onInputOver.add(onOverCallback, callbackContext);
            if (onDownCallback)
                buttonText.events.onInputDown.add(onDownCallback, callbackContext);
            if (onOutCallback)
                buttonText.events.onInputOut.add(onOutCallback, callbackContext);

            this.buttons.push(null);
            this.buttonsText.push(buttonText);

            this.updateButtonPositions();
            return;
        };

        PauseMenu.prototype.addExistingButton = function (buttonText, button) {
            button = button || null;
            this.buttons.push(button);

            this.buttonsText.push(buttonText);
            this.updateButtonPositions();
            return;
        };

        PauseMenu.prototype.showMenu = function () {
            if (this.backgroundSprite)
                this.game.add.existing(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.add.existing(this.buttons[i]);
                this.game.add.existing(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.hideMenu = function () {
            if (this.backgroundSprite)
                this.game.world.remove(this.backgroundSprite);

            for (var i = 0; i < this.buttons.length; i++) {
                if (this.buttons[i])
                    this.game.world.remove(this.buttons[i]);
                this.game.world.remove(this.buttonsText[i]);
            }
        };

        PauseMenu.prototype.updateButtonPositions = function () {
            var totalButtonHeight = 0;

            if (!this.spreadAlongY)
                for (var i = 0; i < this.buttons.length; i++) {
                    if (this.buttons[i])
                        totalButtonHeight += this.buttons[i].height;
                    else
                        totalButtonHeight += this.buttonsText[i].height;
                }

            var butHeightCumulative = 0;
            for (var i = 0; i < this.buttons.length; i++) {
                var workingElement;
                if (this.buttons[i])
                    workingElement = this.buttons[i];
                else
                    workingElement = this.buttonsText[i];

                workingElement.x = this.menuBox.centerX;

                if (this.spreadAlongY)
                    workingElement.y = this.menuBox.top + (i + 1) * this.menuBox.height / (this.buttons.length + 2);
                else {
                    workingElement.y = this.menuBox.centerY - totalButtonHeight / 2 + butHeightCumulative + workingElement.height / 2;
                }

                butHeightCumulative += workingElement.height;
                workingElement.fixedToCamera = true;

                //If the working element was the button, align the text on top of it
                if (this.buttons[i]) {
                    this.buttonsText[i].position.setTo(this.buttons[i].x, this.buttons[i].y);
                    this.buttonsText[i].fixedToCamera = true;
                }
            }
        };

        PauseMenu.prototype.togglePause = function () {
            if (this.phaserPause) {
                var oldMute = this.game.sound.mute;
                this.game.paused = !this.game.paused;
                this.game.sound.mute = oldMute;

                if (this.game.paused) {
                    this.game.input.onUp.add(this.handleClick, this);
                    this.showMenu();
                } else {
                    this.game.input.onUp.remove(this.handleClick, this);
                    this.hideMenu();
                }
            } else {
                this._paused = !this._paused;
                if (this._paused) {
                    //Show menu
                    this.showMenu();

                    //Pause game function
                    this.game.time.events.pause();
                    this.game.sound.pauseAll();
                    this.preUpdateFunction = this.game.stage.preUpdate;
                    this.game.stage.preUpdate = function () {
                    };
                    this.updateFunction = this.game.stage.update;
                    this.game.stage.update = function () {
                        this.game.time.events.pause();
                    };
                    this.tweenUpdate = this.game.tweens.update;
                    this.game.tweens.update = function () {
                        return false;
                    };
                    this.game.onPause.dispatch();
                } else {
                    //Resume game function
                    this.game.sound.resumeAll();
                    this.game.stage.preUpdate = this.preUpdateFunction;
                    this.game.stage.update = this.updateFunction;
                    this.game.tweens.update = this.tweenUpdate;
                    this.game.time.events.resume();
                    this.game.onResume.dispatch();

                    //Hide menu
                    this.hideMenu();
                }
            }
        };

        PauseMenu.prototype.handleClick = function (pointer) {
            this.buttons.forEach(function (button) {
                if (button.getBounds().contains(pointer.x, pointer.y)) {
                    button.onInputUpHandler(this, pointer, true);
                }
            }, this);
        };
        return PauseMenu;
    })();
    summ.PauseMenu = PauseMenu;
})(summ || (summ = {}));
//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var Preloader = (function () {
        function Preloader() {
        }
        Preloader.load = function (game, loadAssets, context, nextState) {
            game.state.add('gitbootload', {
                preload: function () {
                    game.load.image('gitpreloadbar', 'http://gitsumm.com/files/_/simon/Preloader/loader.png');
                    game.load.image('gitpreloadlogo', 'http://gitsumm.com/files/blk/img/logo.png');
                },
                create: function () {
                    game.state.start('gitpreload');
                }
            }, true);

            game.state.add('gitpreload', {
                preload: function () {
                    var logo = game.add.sprite(game.width / 2, game.height * 3 / 4, 'gitpreloadlogo');
                    logo.anchor.set(0.5, 1);

                    var bar = game.add.sprite(logo.x, logo.y, 'gitpreloadbar');
                    bar.x -= bar.width / 2;

                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context, this.game);
                },
                create: function () {
                    game.state.start(nextState);
                }
            });
        };

        Preloader.loadLocal = function (game, loadAssets, context, nextState) {
            game.state.add('gitbootload', {
                preload: function () {
                    game.load.image('gitpreloadbar', 'assets/loader.png');
                    game.load.image('gitpreloadlogo', 'assets/logo.png');
                },
                create: function () {
                    game.state.start('gitpreload');
                }
            }, true);

            game.state.add('gitpreload', {
                preload: function () {
                    var logo = game.add.sprite(game.width / 2, game.height * 3 / 4, 'gitpreloadlogo');
                    logo.anchor.set(0.5, 1);

                    var bar = game.add.sprite(logo.x, logo.y, 'gitpreloadbar');
                    bar.x -= bar.width / 2;

                    //bar.width = game.width - game.width / 8;
                    this.load.setPreloadSprite(bar);

                    loadAssets.call(context);
                },
                create: function () {
                    game.state.start(nextState);
                }
            });
        };
        return Preloader;
    })();
    summ.Preloader = Preloader;
})(summ || (summ = {}));
//#######################FullScreenSettings.ts###############################
/// <reference path="phaser.d.ts" />
var summ;
(function (summ) {
    var FullScreenSettings = (function () {
        function FullScreenSettings() {
        }
        FullScreenSettings.apply = function (game) {
            game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

            game.canvas.onresize = function () {
                game.scale.refresh();
            };

            if (game.device.desktop)
                game.scale.fullScreenTarget = document.getElementById('content');

            game.canvas.style.position = 'absolute';
            game.canvas.style.top = '0';
            game.canvas.style.left = '0';
            game.canvas.style.right = '0';
            game.canvas.style.bottom = '0';
            game.canvas.style.margin = 'auto';

            if (document.domain.indexOf("gitsumm.com") > -1) {
                if (game.width / game.height > document.documentElement.clientWidth / document.documentElement.clientHeight) {
                    game.canvas.style['width'] = '100%';
                    game.canvas.style['height'] = 'auto';
                } else {
                    game.canvas.style['width'] = 'auto';
                    game.canvas.style['height'] = '100%';
                    game.scale.fullScreenTarget.style['height'] = '100%';
                }
            }

            game.scale.refresh();

            document.body.style.margin = '0';

            game.scale.enterFullScreen.add(function () {
                /*if (this.device.firefox) {
                this.canvas.style.position = 'absolute';
                this.canvas.style.top = '0';
                this.canvas.style.left = '0';
                this.canvas.style.right = '0';
                this.canvas.style.bottom = '0';
                this.canvas.style.margin = 'auto';
                
                //this.canvas.style.width = 'auto !important';
                //this.canvas.style.height = '100% !important';
                }
                */
                if (this.width / this.height > this.scale.fullScreenTarget.clientWidth / this.scale.fullScreenTarget.clientHeight) {
                    this.canvas.style['width'] = '100%';
                    this.canvas.style['height'] = 'auto';
                } else {
                    this.canvas.style['width'] = 'auto';
                    this.canvas.style['height'] = '100%';
                }

                this.scale.refresh();
            }, game);

            game.scale.leaveFullScreen.add(function () {
                this.scale.fullScreenTarget.style.width = "";
                this.scale.fullScreenTarget.style.height = "";

                if (document.domain.indexOf("gitsumm.com") > -1) {
                    /*
                    game.canvas.style['width'] = '100%';
                    game.canvas.style['height'] = 'auto';
                    
                    if (game.canvas.clientHeight > document.documentElement.clientHeight) {
                    game.canvas.style['width'] = 'auto';
                    game.canvas.style['height'] = '100%';
                    }
                    */
                    if (game.width / game.height > document.documentElement.clientWidth / document.documentElement.clientHeight) {
                        game.canvas.style['width'] = '100%';
                        game.canvas.style['height'] = 'auto';
                    } else {
                        game.canvas.style['width'] = 'auto';
                        game.canvas.style['height'] = '100%';
                        game.scale.fullScreenTarget.style['height'] = '100%';
                    }
                }

                this.scale.refresh();
            }, game);
        };
        return FullScreenSettings;
    })();
    summ.FullScreenSettings = FullScreenSettings;
})(summ || (summ = {}));
//#######################Preloader.ts###############################
/// <reference path="phaser.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var summ;
(function (summ) {
    //Just a comment
    var DepthSprite = (function (_super) {
        __extends(DepthSprite, _super);
        function DepthSprite(game, x, y, key, frame) {
            _super.call(this, game, x, y, key, frame);
            this._depth = 1;
            this._lastDepth = 1;
            this.anchor.set(0.5);

            this.up = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
            this.down = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
            this.left = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
            this.right = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
            this.zoomIn = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
            this.zoomOut = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);

            this.game.physics.enable(this, Phaser.Physics.ARCADE);
        }
        DepthSprite.prototype.preUpdate = function () {
            this._halfWidth = this.game.width / 2;
            this._halfHeight = this.game.width / 2;
            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x *= this._lastDepth;
            this.y *= this._lastDepth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x * this._lastDepth, this.scale.y * this._lastDepth);
            _super.prototype.preUpdate.call(this);
        };

        DepthSprite.prototype.update = function () {
            if (this.up.isDown)
                this.body.velocity.y--;
            if (this.down.isDown)
                this.body.velocity.y++;
            if (this.left.isDown)
                this.body.velocity.x--;
            if (this.right.isDown)
                this.body.velocity.x++;
            if (this.zoomIn.isDown)
                this._depth -= 0.01;
            if (this.zoomOut.isDown)
                this._depth += 0.01;
        };

        DepthSprite.prototype.postUpdate = function () {
            _super.prototype.postUpdate.call(this);

            this._lastDepth = this._depth;

            this.x -= this._halfWidth;
            this.y -= this._halfHeight;
            this.x /= this._depth;
            this.y /= this._depth;
            this.x += this._halfWidth;
            this.y += this._halfHeight;

            this.scale.setTo(this.scale.x / this._depth, this.scale.y / this._depth);
        };
        return DepthSprite;
    })(Phaser.Sprite);
    summ.DepthSprite = DepthSprite;
})(summ || (summ = {}));
//# sourceMappingURL=summ-lib.js.map

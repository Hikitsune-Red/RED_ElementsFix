/*:
 * @plugindesc v1.00 A simple plug-in designed to adjust the sprite draw of Time Elements characters
 * @author Hikitsune-Red 火狐
 *
 * @help
 * ================================================================================
 * 
 * Just put a closing parentheses ")" at the start of an Elements character's
 * image's filename (much like "$" or "!" for other uses) and the system will
 * adjust on draw
 *
 * ================================================================================
 * TERMS OF USE
 * Free for any commercial or non-commercial project!
 * Just credit Hikitsune-Red 火狐 in your project
 * And let me know about your project! =^~^= Twitter: @hikitsune_red
 */

(function () {
	var oldisobject = ImageManager.isObjectCharacter;
	
	ImageManager.isObjectCharacter = function(filename) {
		var sign = filename.match(/^[\!\$\)]+/);
		return oldisobject.call(this, filename) || (sign && sign[0].contains('!'));
	};
	
	var oldisbig = ImageManager.isBigCharacter;

	ImageManager.isBigCharacter = function(filename) {
		var sign = filename.match(/^[\!\$\)]+/);
		return oldisbig.call(this, filename) || (sign && sign[0].contains('$'));
	};
	
	ImageManager.isElementsCharacter = function(filename) {
		var sign = filename.match(/^[\!\$\)]+/);
		return sign && sign[0].contains(')');
	};

	var oldsetbitmap = Sprite_Character.prototype.setCharacterBitmap;

	Sprite_Character.prototype.setCharacterBitmap = function() {
		oldsetbitmap.call(this);
		this._isElementsCharacter = ImageManager.isElementsCharacter(this._characterName);
	};

	var oldupdate = Sprite_Character.prototype.updatePosition;

	Sprite_Character.prototype.updatePosition = function() {
		oldupdate.call(this);
		if (this._isElementsCharacter) {
			this.y = this._character.screenY() + $gameMap.tileHeight();
		}
	};
	
	var oldupdatepos = Sprite_Actor.prototype.updatePosition;
	
	Sprite_Actor.prototype.updatePosition = function() {
		//Sprite_Battler.prototype.updatePosition.call(this);
		oldupdatepos.call(this);
		
		if (this._isElementsCharacter) {
			this.y += 48;
			this._shadowSprite.y = -48;
		}
	};
	
	var oldupdatebitmap = Sprite_Actor.prototype.updateBitmap;
	
	Sprite_Actor.prototype.updateBitmap = function() {
		var name = this._actor.battlerName();
		if (this._battlerName !== name) {
			this._isElementsCharacter = ImageManager.isElementsCharacter(name);
		}
		
		oldupdatebitmap.call(this);
	};
}) ();
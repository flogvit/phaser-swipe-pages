# phaser-swipe-pages
Phaser component to manage a state of pages

Can be useful for eg help screens etc. It will use the Phaser.Camera to move around, and take care of
positioning your objects

## Install

The easies way of using it is compiling your project with browerify and install it like:

```bash
  npm install phaser-swipe-pages
```

## Usage

```javascript
    var SwipePages = require('phaser-swipe-pages');
    
    // in create
    this.pages = new SwipePages(this.game, 3);
    
    // If you want standard menus. Else you can create your own and pages.addToStationary(obj);
    this.pages.createMenu({}, this.back, this);
    
    // Create your pages. All objects should be created as positioned on the primary screen. The component will
    // move them to correct place
    var text = this.game.add.text(0,0,'page 1');
    this.pages.addToPage(1, text);
    
    // Here we add a text to page 2. But the positioning is still 0,0
    var text2 = this.game.add.text(0,0,'page 2');
    this.pages.addToPage(2, text2);
    
    // Go to page 1
    this.pages.goPage(1);
    
    this.back = function() {
      // This.will be called when the user presses SKIP on the menu
    }
```
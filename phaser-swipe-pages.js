/**
 * Created by flogvit on 2015-12-02.
 *
 * @copyright Cellar Labs AS, 2015, www.cellarlabs.com, all rights reserved
 * @file
 * @license MIT
 * @author Vegard Hanssen <Vegard.Hanssen@cellarlabs.com>
 *
 */

var Swipe = require('phaser-swipe');
var extend = require('util')._extend;

var SwipePages = function (game, pages) {
  this.game = game;
  this.stationaryGroup = this.game.add.group();
  this.page = 1;
  this.pageMax = pages;
  this.pageText = null;
  this.game.world.setBounds(0, 0, this.pageMax * this.game.width, this.game.height);


  this.swipe = new Swipe(game, this);

  this.options = {
    style: {
      font: '30px Arial',
      fill: '#000000',
      align: 'center'
    },
    text: {
      skip: 'SKIP',
      previous: 'PREVIOUS',
      next: 'NEXT'
    }
  }
};

SwipePages.prototype = {
  addToStationary: function (obj) {
    this.stationaryGroup.add(obj);
    obj.X = obj.position.x;
    obj.Y = obj.position.y;
  },

  addToPage: function (page, obj) {
    if (page < 1) return;
    if (page > this.pageMax)  return;

    obj.position.x = obj.position.x + ((page - 1) * this.game.width);
  },

  goNextPage: function () {
    this.goPage(this.page + 1);
  },

  goPreviousPage: function () {
    this.goPage(this.page - 1);
  },

  goPage: function (page) {
    if (page < 1 || page > this.pageMax || page === this.page) return;

    this.bringStationaryTop();
    var self = this;
    this.page = page;
    var tween = this.game.add.tween(this.game.camera);
    tween.to({x: this.game.width * (page - 1)}, 200, Phaser.Easing.Cubic.Out);
    tween.start();
    tween.onUpdateCallback(function () {
      self.adjustStationary();
    });
    tween.onComplete.add(function () {
      self.updatePageNumber();
    });
  },

  adjustStationary: function () {
    var self = this;
    this.stationaryGroup.forEach(function (obj) {
      obj.position.x = self.game.camera.x + obj.X;
    }, this);
  },

  updatePageNumber: function () {
    if (this.pageText != null)
      this.pageText.text = this.page + '/' + this.pageMax;
  },

  left: function () {
    this.goPage(this.page + 1);
  },

  right: function () {
    this.goPage(this.page - 1);
  },

  update: function () {
    this.swipe.check();
  },

  createMenu: function (options, skip, context) {
    var self = this;
    var padding = 20;
    options = extend(this.options, options);
    this.skip = this.game.add.text(0, 0, options.text.skip, options.style);
    this.skip.anchor.setTo(0.5);
    this.skip.position.x = this.game.width - (this.skip.width / 2) - padding;
    this.skip.position.y = padding + (this.skip.height / 2);
    this.addToStationary(this.skip);
    this.skip.inputEnabled = true;
    this.skip.events.onInputDown.add(function () {
      skip.call(context);
    }, this);

    this.previous = this.game.add.text(0, 0, options.text.previous, options.style);
    this.previous.anchor.setTo(0.5);
    this.previous.position.x = padding + (this.previous.width / 2);
    this.previous.position.y = this.game.height - (this.previous.height / 2) - padding;
    this.addToStationary(this.previous);
    this.previous.inputEnabled = true;
    this.previous.events.onInputDown.add(function () {
      self.goPreviousPage();
    })

    this.next = this.game.add.text(0, 0, options.text.next, options.style);
    this.next.anchor.setTo(0.5);
    this.next.position.x = this.game.width - (this.next.width / 2) - padding;
    this.next.position.y = this.game.height - (this.next.height / 2) - padding;
    this.addToStationary(this.next);
    this.next.inputEnabled = true;
    this.next.events.onInputDown.add(function () {
      self.goNextPage();
    })

    this.pageText = this.game.add.text(this.game.width / 2, 0, '', options.style);
    this.pageText.anchor.setTo(0.5);
    this.pageText.position.y = this.game.height - (this.pageText.height / 2) - padding;
    this.addToStationary(this.pageText);

    this.updatePageNumber();
    this.bringStationaryTop();
  },

  bringStationaryTop: function() {
    this.game.world.bringToTop(this.stationaryGroup);
  }
}


if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = SwipePages;
  }
}
describe('Style', function() {
  beforeEach(function() {
    Marionette.Behaviors.behaviorsLookup = function() {
      return {
        Style: window.StyleBehavior
      };
    };
  });

  it('should set the style of a view', function() {
    var StyleView = Marionette.ItemView.extend({
      template: _.template('<div></div>'),
      behaviors: {
        Style: {}
      },
      style: {
        backgroundColor: '#000',
        color: 'white',
        fontSize: 14,
        position: 'absolute'
      }
    });
    var view = new StyleView();
    view.render();
    expect(view.$el.css('background-color')).to.equal('rgb(0, 0, 0)');
    expect(view.$el.css('color')).to.equal('white');
    expect(view.$el.css('font-size')).to.equal('14px');
    expect(view.$el.css('position')).to.equal('absolute');
  });

  it('should set the style of a view dynamic', function() {
    var StyleView = Marionette.ItemView.extend({
      template: _.template('<div></div>'),
      behaviors: {
        Style: {}
      },
      style: function(){
        return {
          backgroundColor: this.options.model.get('modelColor'),
        };
      }
    });
    var styleModel = new Backbone.Model({
      modelColor: '#000',
    });
    var view = new StyleView({
      model: styleModel
    });
    view.render();
    expect(view.$el.css('background-color')).to.equal('rgb(0, 0, 0)');
  });
});

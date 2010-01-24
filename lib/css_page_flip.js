
var CSSPageFlip = Class.create({
    initialize: function(container_id, options) {
        this.options = Object.extend({}, options || {});
        this.container = $(container_id);
        
        this.leaves = this.container.select('li');
        
        this.compileLeaves();
        this.setupEvents();
    },

    compileLeaves: function() {
        var first = true;
        var leaf_num = 0;
        
        // compile the ol into the leaf structure
        this.leaves.eachSlice(2, function(slice) {
            var right_page = new Element('div', { 'class': 'page right_page'}).update(slice[0].innerHTML);
            var right_page_next = new Element('div', { 'class': 'page right_page_next'}).update(slice[1].innerHTML);
            var new_leaf = new Element('li', { 'id': leaf_num }).insert({bottom: right_page}).insert({bottom: right_page_next});
            if(first) {
                new_leaf.addClassName('current');
                new_leaf.addClassName('first');
                first = false;
                this.current_leaf = new_leaf;
            }
            
            slice.invoke('remove');
            this.container.insert({bottom: new_leaf});
            
            leaf_num++;
        }.bind(this));
        
        this.leaves = this.container.select('li');
    },
    
    setupEvents: function() {
        this.last = false;            
        this.leaves.each(function(leaf) {
            leaf.down('.right_page').observe('click', function(e) {
                leaf.addClassName('turn');
                leaf.addClassName('current');

                if(this.prevLeaf())
                    this.prevLeaf().removeClassName('current');

                if(this.nextLeaf()) {
                    this.nextLeaf().addClassName('current');
                    this.current_leaf = this.nextLeaf();
                } else {
                    this.last = true;
                }
                
            }.bind(this));
            leaf.down('.right_page_next').observe('click', function(e) {
                leaf.removeClassName('turn');

                if(this.last) {
                    this.last = false
                } else {
                    this.current_leaf.removeClassName('current');                            
                    if(this.prevLeaf())
                        this.prevLeaf().addClassName('current');

                    this.current_leaf = this.prevLeaf();
                }
            }.bind(this))
        }.bind(this));
    },
    
    nextLeaf: function() {
        return $((parseFloat(this.current_leaf.id) + 1).toString());
    },

    nextnextLeaf: function() {
        return $((parseFloat(this.current_leaf.id) + 2).toString());
    },

    prevLeaf: function() {
        return $((parseFloat(this.current_leaf.id) - 1).toString());
    }
});


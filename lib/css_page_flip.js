if(typeof CSSPageFlip == "undefined" || !CSSPageFlip) {
    var CSSPageFlip = {};
}

CSSPageFlip = function() {
    
    var obj = {};

    obj.init = function(container_id, options) {
        this.options = Object.extend({}, options || {});
        this.container = $(container_id);
    
        this.leaves = this.container.select('li');
    
        compileLeaves();
        setupEvents();
    };
    
    // Private Methods
    
    var compileLeaves = function() {
        var first = true;
        var leaf_num = 0;
    
        // compile the ol into the leaf structure
        obj.leaves.eachSlice(2, function(slice) {
            var right_page = new Element('div', { 'class': 'page right_page'}).update(slice[0].innerHTML);
            var right_page_next = new Element('div', { 'class': 'page right_page_next'}).update(slice[1].innerHTML);
            var new_leaf = new Element('li', { 'id': leaf_num }).insert({bottom: right_page}).insert({bottom: right_page_next});
            if(first) {
                new_leaf.addClassName('current');
                new_leaf.addClassName('first');
                first = false;
                obj.current_leaf = new_leaf;
            }
        
            slice.invoke('remove');
            obj.container.insert({bottom: new_leaf});
        
            leaf_num++;
        });
    
        obj.leaves = obj.container.select('li');
    };
    
    var setupEvents = function() {
        obj.last = false;            
        obj.leaves.each(function(leaf) {
            leaf.down('.right_page').observe('click', function(e) {
                leaf.addClassName('turn');
                leaf.addClassName('current');

                if(prevLeaf())
                    prevLeaf().removeClassName('current');

                if(nextLeaf()) {
                    nextLeaf().addClassName('current');
                    obj.current_leaf = nextLeaf();
                } else {
                    obj.last = true;
                }
            
            });
            leaf.down('.right_page_next').observe('click', function(e) {
                leaf.removeClassName('turn');

                if(obj.last) {
                    obj.last = false
                } else {
                    obj.current_leaf.removeClassName('current');                            
                    if(prevLeaf())
                        prevLeaf().addClassName('current');

                    obj.current_leaf = prevLeaf();
                }
            })
        });
    };

    var nextLeaf = function() {
        return $((parseFloat(obj.current_leaf.id) + 1).toString());
    };

    var prevLeaf = function() {
        return $((parseFloat(obj.current_leaf.id) - 1).toString());
    };

    return obj;

}();


CSSPageFlip = function() {
    
    var obj = {};

    // Usage: CSSPageFlip.init(dom_id)
    // Call this method with the id of the <ol> you want to turn into a flippable interface

    obj.init = function(container_id, options) {
        this.options = options;
        this.container = $('#' + container_id);
        this.leaves = this.container.find('li');
        compileLeaves();
        setupEvents();
    };
    
    // Private Methods
    
    var compileLeaves = function() {
        var first = true;
        var leaf_num = 0;
    
        // compile the ol into the leaf structure
        obj.leaves.each(function(idx) {
            if(idx % 2 == 0) {
                var el = $(this);
                var next_el = $(obj.leaves[idx+1]);

                // compile the leaf structure
                var right_page = $("<div class='page right_page'></div>").html(el.html());
                var right_page_next = $("<div class='page right_page_next'></div>").html(next_el.html());
                var new_leaf = $("<li></li>").append(right_page).append(right_page_next);
                if(first) {
                    new_leaf.addClass('current');
                    new_leaf.addClass('first');
                    first = false;
                    obj.current_leaf = new_leaf;
                }
                
                // remove the old li's
                el.remove();
                next_el.remove();
                obj.container.append(new_leaf);
        
                leaf_num++;
            }
        });
    
        obj.leaves = obj.container.find('li');
    };
    
    var setupEvents = function() {
        obj.last = false;            
        obj.leaves.each(function() {
            var leaf = $(this);
            leaf.find('.right_page').click(function() {
                leaf.addClass('turn');
                leaf.addClass('current');
                
                if(prevLeaf())
                    prevLeaf().removeClass('current');

                if(nextLeaf()) {
                    nextLeaf().addClass('current');
                    obj.current_leaf = nextLeaf();
                } else {
                    obj.last = true;
                }
            });
            leaf.find('.right_page_next').click(function() {
                leaf.removeClass('turn');

                if(obj.last) {
                    obj.last = false
                } else {
                    obj.current_leaf.removeClass('current');                            
                    if(prevLeaf()[0])
                        prevLeaf().addClass('current');

                    obj.current_leaf = prevLeaf();
                }
            })
        });
    };

    var nextLeaf = function() {
        var el = obj.current_leaf.next();
        return el.length ? el : null
    };

    var prevLeaf = function() {
        var el = obj.current_leaf.prev();
        return el.length ? el : null
    };

    return obj;

}();


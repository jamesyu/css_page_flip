CSSPageFlip = function() {
    
    var obj = {};

    // Usage: CSSPageFlip.init(dom_id)
    // Call this method with the id of the <ol> you want to turn into a flippable interface

    obj.init = function(container_id, options) {
        this.options = options;
        this.container = $('#' + container_id);
        this.container.css('list-style-type', 'none');
        this.leaves = this.container.find('li');
        compileLeaves();
        sizePages();
        setupEvents();
        this.container.addClass('_css_page_flip');
        this.container.addClass('ready');
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
    
    var sizePages = function() {
        obj.container_width = obj.container.innerWidth();
        obj.page_width = Math.round(obj.container_width / 2);
        obj.container.find('li .page.right_page').each(function() {
            var padding = parseInt($(this).css('paddingLeft')) + parseInt($(this).css('paddingRight'));
            var border = parseInt($(this).css('borderLeftWidth'));
            $(this).css('width', obj.page_width - (padding + border));
        });
        
        obj.container.find('li .page.right_page_next').each(function() {
            var padding = parseInt($(this).css('paddingLeft')) + parseInt($(this).css('paddingRight'));
            if($(this).next('li').length) {
                var border = parseInt($(this).css('borderLeftWidth'))*2;
                $(this).css('borderRightWidth', 0);
            } else {
                var border = parseInt($(this).css('borderLeftWidth'));
            }
            
            $(this).css('width', obj.page_width - (padding + 2*border));
        });
        
    };
    
    var setupEvents = function() {
        obj.last = false;
        obj.first_interaction = true;
        obj.leaves.each(function() {
            var leaf = $(this);
            leaf.find('.right_page').click(function() {
                
                if(obj.first_interaction) {
                    // this enables animation upon first interaction, otherwise
                    // there is a chance for animation glitches when page loads
                    obj.container.addClass('first_touch');
                    obj.first_interaction = false;
                }
                
                if(leaf[0] == obj.current_leaf[0]) { // protects against multiple clicks
                    leaf.addClass('turn');

                    if(nextLeaf()) {
                        leaf.removeClass('current');
                        nextLeaf().addClass('current');
                        obj.current_leaf = nextLeaf();
                    } else {
                        // this is the last leaf to turn
                        // there is no next current leaf, but keep the current one visible
                        obj.last = true;
                    }
                }
            });
            leaf.find('.right_page_next').click(function() {
                if(leaf[0] != obj.current_leaf[0]) { // protects against multiple clicks
                    leaf.removeClass('turn');

                    if(obj.last) {
                        obj.last = false
                    } else {
                        obj.current_leaf.removeClass('current');                            
                        if(prevLeaf())
                            prevLeaf().addClass('current');

                        obj.current_leaf = prevLeaf();
                    }
                } else if(obj.last) {
                    obj.last = false;
                    leaf.removeClass('turn');
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


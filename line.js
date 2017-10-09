//line animation script

            
            var focus_image = document.getElementById("story_focus_pic");
            var focus_width = focus_image.offsetWidth();
            var focus_height = focus_image.offsetHeight();
            
            var focus_centerX = focus_image.left + focus_width / 2;
            var focus_centerY = focus_image.top + focus_height / 2;
            
            var first_ring_img = document.getElementById("student_vets");
            var first_ring_width = first_ring_img.offsetWidth();
            var first_ring_height = first_ring_img.offsetHeight();
            
            var first_centerX = first_ring_img.left + first_ring_width / 2;
            var first_centerY = first_ring_img.top + first_ring_height / 2; 
            
            stage = acgraph.create('story_visual');
        
            stage.path()
                .moveTo(focus_centerX,focus_centerY)
                .lineTo(first_centerX,first_centerY);

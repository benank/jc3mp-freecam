$(document).ready(function() 
{
    let old_x = 0;
    let old_y = 0;
    let init = false;
    
    document.addEventListener('mousemove', onMouseUpdate, false);
    document.addEventListener('mouseenter', onMouseUpdate, false);

    function onMouseUpdate(e) 
    {
        // so apparently this doesnt work right now
        if (!init)
        {
            old_x = e.pageX;
            old_y = e.pageY;
            init = true;
        }
        else
        {
            jcmp.CallEvent('freecam/mousemove', e.pageX - old_x, e.pageY - old_y);
            old_x = e.pageX;
            old_y = e.pageY;
        }
    }
    /*document.onmousemove = function(e)
    {
        if (!init)
        {
            old_x = e.pageX;
            old_y = e.pageY;
            init = true;
        }
        else
        {
            //jcmp.CallEvent('freecam/mousemove', e.pageX - old_x, e.pageY - old_y);
            jcmp.CallEvent('freecam/mousemove', 6, 6);
            old_x = e.pageX;
            old_y = e.pageY;
        }
    }*/
})

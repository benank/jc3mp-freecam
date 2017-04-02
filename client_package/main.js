const ui = new WebUIWindow('freecam', 'package://freecam/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));


let can_use = true;
let freecam = false;
let to_pos = new Vector3f(0,0,0);
let to_rot = new Vector3f(0,0,0);
let keys = [];
const speed = 1;
const rot_speed = Math.PI * 0.01;
let no_lerp = false;

jcmp.ui.AddEvent('KeyUp', key => {
    let myKey = "O".charCodeAt(0);
    if (can_use && key == myKey)
    {
        freecam = !freecam;
        jcmp.localPlayer.camera.attachedToPlayer = !freecam;
        //jcmp.debug('Freecam: ' + freecam);
        if (freecam)
        {
            to_pos = jcmp.localPlayer.camera.position;
            to_rot = jcmp.localPlayer.camera.rotation;
        }
    }
})

jcmp.ui.AddEvent('KeyDown', key => {
    if (freecam && can_use && keys.indexOf(key) == -1)
    {
        keys.push(key);
    }
    /*if (freecam)
    {
        ProcessKey(key);
    }*/
})

jcmp.ui.AddEvent('KeyUp', key => {
    if (freecam && can_use && keys.indexOf(key) > -1)
    {
        keys.splice(keys.indexOf(key), 1);
    }
})

function ProcessKey(key)
{
    switch(key)
    {
        // Position
        case 87: // W, Forward
        {
            to_pos = to_pos.add(vq(new Vector3f(0,0,speed), jcmp.localPlayer.camera.rotation));
            break;
        }
        case 65: // A, Left
        {
            to_pos = to_pos.add(vq(new Vector3f(-speed,0,0), jcmp.localPlayer.camera.rotation));
            break;
        }
        case 83: // S, Backward
        {
            to_pos = to_pos.add(vq(new Vector3f(0,0,-speed), jcmp.localPlayer.camera.rotation));
            break;
        }
        case 68: // D, Right
        {
            to_pos = to_pos.add(vq(new Vector3f(speed,0,0), jcmp.localPlayer.camera.rotation));
            break;
        }
        case 16: // Shift, Up
        {
            to_pos = to_pos.add(new Vector3f(0,speed,0));
            break;
        }
        case 17: // Ctrl, Down
        {
            to_pos = to_pos.add(new Vector3f(0,-speed,0));
            break;
        }

        // Rotation
        case 38: // Up Arrow, Look Up
        {
            to_rot = to_rot.add(new Vector3f(-rot_speed,0,0));
            to_rot.x = (to_rot.x <= -Math.PI / 2) ? -Math.PI / 2 : to_rot.x;
            if (to_rot.x == -Math.PI / 2) {no_lerp = true;}
            break;
        }
        case 37: // Left Arrow, Look Left
        {
            to_rot = to_rot.add(new Vector3f(0,-rot_speed,0));
            to_rot.y = (to_rot.y <= -Math.PI) ? Math.PI : to_rot.y;
            if (to_rot.y == -Math.PI) {no_lerp = true;}
            break;
        }
        case 40: // Down Arrow, Look Down
        {
            to_rot = to_rot.add(new Vector3f(rot_speed,0,0));
            to_rot.x = (to_rot.x >= Math.PI / 2) ? Math.PI / 2 : to_rot.x;
            if (to_rot.x == Math.PI / 2) {no_lerp = true;}
            break;
        }
        case 39: // Right Arrow, Look Right
        {
            to_rot = to_rot.add(new Vector3f(0,rot_speed,0));
            to_rot.y = (to_rot.y >= Math.PI) ? -Math.PI : to_rot.y;
            if (to_rot.y == Math.PI) {no_lerp = true;}
            break;
        }
    }
}


jcmp.events.Add('GameUpdateRender', (r) => {
    if (freecam)
    {
        keys.forEach(function(k) 
        {
            ProcessKey(k);
        });
        jcmp.localPlayer.camera.position = lerp(jcmp.localPlayer.camera.position, to_pos, 0.1);
        if (no_lerp)
        {
            jcmp.localPlayer.camera.rotation = to_rot;
        }
        else
        {
            jcmp.localPlayer.camera.rotation = lerp(jcmp.localPlayer.camera.rotation, to_rot, 0.25);
        }
        
    }
})

jcmp.ui.AddEvent('freecam/mousemove', (x, y) => {
    //jcmp.debug("x: " + x + " y: " + y);
})


jcmp.ui.AddEvent('chat_input_state', s => {
  can_use = !s;
});

function lerp(a,b,t)
{
    return (a.add( ( b.sub(a) ).mul(new Vector3f(t,t,t)) ));
}



function vq(v,q)
{
    return vx(vy(v, q), q);
}

function vx(v,q)
{
    return new Vector3f(v.x,
        v.y * Math.cos(q.x) + v.z * Math.sin(q.x),
        v.y * Math.sin(q.x) - v.z * Math.cos(q.x));
}

function vy(v,q)
{
    return new Vector3f(v.x * Math.cos(q.y) + v.z * Math.sin(q.y),
        v.y,
        -v.x * Math.sin(q.y) + v.z * Math.cos(q.y));
}

function vz(v,q)
{
    return new Vector3f(v.x * Math.cos(q.z) + v.y * Math.sin(q.z), 
        v.x * Math.sin(q.z) - v.y * Math.cos(q.z), 
        v.z);
}
const HEROMUSTER_API_URL = "https://openlegend.heromuster.com/api/"

function call_api(request, callback, error_callback=console.error)
{
    fetch(HEROMUSTER_API_URL+request).then(response => response.json())
        .then(data => {
            if(data.success)
                callback(data.success);
            else
                error_callback(data.error)
        });
}

function getStatsForCharacter(id, callback)
{
    call_api("character/"+id, (res) => {
        callback({
            agility: res.character.agility|0,
            fortitude: res.character.fortitude|0,
            might: res.character.might|0,

            learning: res.character.learning|0,
            logic: res.character.logic|0,
            perception: res.character.perception|0,
            will: res.character.will|0,

            deception: res.character.deception|0,
            persuasion: res.character.persuasion|0,
            presence: res.character.presence|0,

            alteration: res.character.alteration|0,
            creation: res.character.creation|0,
            energy: res.character.energy|0,
            entropy: res.character.entropy|0,
            influence: res.character.influence|0,
            movement: res.character.movement|0,
            prescience: res.character.prescience|0,
            protection: res.character.protection|0,

        });

    })


}
function randInt(min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function roll_1d(type, generation=0)
{
    let roll = randInt(1, type);
    return {
        roll,
        type,
        crit: roll==type,
        dropped: false,
        generation
    };
}

function sort_dice(dice)
{
    dice.sort((a,b)=>{
        if(a.generation != b.generation)
            return a.generation - b.generation;
        if(a.type != b.type)
            return b.type - a.type;
        if(a.dropped != b.dropped)
            return a.dropped?1:-1;
        return a.roll - b.roll;
    });
}

function roll_nd(n,d, generation = 0)
{
    let rolls = []
    for(let i = 0; i < n; i++)
    {
        rolls.push(roll_1d(d, generation));
    }
    return rolls;
}

function roll_nd_adv(n,d,adv)
{
    let rolls = roll_nd(n+Math.abs(adv), d);
    sort_dice(rolls);
    if(adv > 0)
    {
        for(let i = 0; i < adv; i++)
        {
            rolls[i].dropped = true;
        }
    }
    else
    {
        for(let i = 0; i < -adv; i++)
        {
            rolls[rolls.length-1-i].dropped = true;
        }
    }
    return rolls;    
}

function explode_dice(dice, generation = 0)
{
    let additional_rolls = [];
    for(let die of dice)
    {
        if(die.crit && !die.dropped)
            additional_rolls.push(roll_1d(die.type, generation));
    }
    return additional_rolls;
}

function explode_all_dice(dice)
{
    let all_rolls = [...dice];
    let left_to_explode = [...dice];

    let generation = 1;
    while(left_to_explode.length > 0)
    {
        left_to_explode = explode_dice(left_to_explode, generation++);
        all_rolls = all_rolls.concat(left_to_explode);
    }

    return all_rolls;
}

function total_of_dice(dice)
{
    let sum = 0;
    for(let die of dice)
    {
        if(!die.dropped)
            sum += die.roll;
    }
    return sum;
}

const ATTRIBUTE_DICE = [
    {n:0,d:0},
    {n:1,d:4},
    {n:1,d:6},
    {n:1,d:8},
    {n:1,d:10},
    {n:2,d:6},
    {n:2,d:8},
    {n:2,d:10},
    {n:3,d:8},
    {n:3,d:10},
    {n:4,d:8}
];

function ol_roll(attr, adv=0)
{
    if(attr > 0)
    {
        let attr_dice = ATTRIBUTE_DICE[attr];
        let attr_roll = explode_all_dice(roll_nd_adv(attr_dice.n, attr_dice.d, adv));
        let d20_roll = explode_all_dice(roll_nd(1,20));
        return d20_roll.concat(attr_roll);
    }
    else return explode_all_dice(roll_nd_adv(1, 20, Math.sign(adv)));
}

function make_roll()
{
    let attr = document.getElementById("roll_attr").value|0;
    let adv = document.getElementById("roll_adv").value|0;
    if(document.getElementById("roll_dis").checked)
        adv *= -1;
    
    let rolls = ol_roll(attr, adv);
    let total = total_of_dice(rolls);

    document.getElementById("total").innerText = total;

    console.log(rolls)
    // display the dice on a nice little table
    document.getElementById("dice_table").innerHTML = "";

    sort_dice(rolls);
    let generation = 0;
    let tr = document.createElement("tr");
    for(let die of rolls)
    {
        if(die.generation != generation)
        {
            // new row for every row of exploding dice
            document.getElementById("dice_table").appendChild(tr);
            tr = document.createElement("tr");
            generation = die.generation;
        }

        let td = document.createElement("td");
        td.innerText = die.roll;
        if(die.type==10 && die.roll == 10) // d10s are marked 0 instead of 10
            td.innerText = '0';
        td.classList.add("die");
        td.classList.add("d"+die.type);
        if(die.dropped)
            td.classList.add("dropped_die");
        else if(die.crit) // can't crit if it's dropped
            td.classList.add("crit_die");
        tr.appendChild(td)

    }
    // make sure to get the last row on there
    document.getElementById("dice_table").appendChild(tr);
}
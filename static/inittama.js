function newTama(name, user) {
    d = new Date();
    tama = user["habigotchi"];
    tama["owner"] = user["name"];
    tama["name"] = name;
    tama["date"] = d.getDate() - 1;
    tama["hp"]["total"] = 10;
    tama["hp"]["current"] = 10;
    tama["exp"]["current"] = 0;
    tama["exp"]["next_level"] = 10;
    tama["level"] = 1;
    tama["evolutionary_stage"] = 0;
    tama["alive"] = True;
    sendRequest("POST", "/update", tama);
}

function isAlive(user) {
    return user["habigotchi"]["alive"];
}

// Checks if the tama should be leveled up.  Levels up if it does, evolves
// as needed.  If not, returns false.
function levelUp(tama) {
    if (tama["exp"]["current"] >= tama["exp"]["total"]) {
        tama["level"] += 1;
        tama["exp"]["current"] = 0;
        tama["exp"]["total"] = tama["exp"]["total"] * 2;
        tama["hp"]["total"] += 5;
        tama["hp"]["current"] += 5;
        if (tama["level"] % 5 == 0) {
            tama["evolutionary_stage"] += 1;
        }
        return True;
    } else {
        return False;
    }
}

// Checks if it's been a month since the tama was born.
function endOfMonth(tama) {
    d = new Date();
    return (d.getDate() == tama["date"]);
}

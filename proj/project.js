async function fetchResponse(url){
    let response = await fetch(url);
    let res = await response.json();
    return res;
}

function forPeople(number){
    let myUrl = `https://swapi.dev/api/people/${number}/`;
    fetchResponse(myUrl).then(res=>{
        if(res['name']){localStorage.setItem(`name${number}`,res['name']);}        
        if(res['birth_year']) {localStorage.setItem(`birthdate${number}`,res['birth_year']);}
        if(res['gender']) {localStorage.setItem(`gender${number}`, res['gender']);}
        if(res['homeworld']){
            let planetNumber = res['homeworld'].match(/\d+/);
            let planet = localStorage.getItem(`planet${planetNumber}`);
            if (!planet){
                fetchResponse(res['homeworld']).then(res =>{
                    localStorage.setItem(`planet${planetNumber}`, res['name'])
                    planet = res['name'];
                    localStorage.setItem(`charPlanet${number}`, planet);
                })
            }
            else {
                localStorage.setItem(`charPlanet${number}`, planet);
            }  
        }
        if (res['species']) {
            let species = res['species']; 
            species.forEach(specie => {
                let specieNumber = specie.match(/\d+/)
                let specieItem = localStorage.getItem(`specie${specieNumber}`)
                if (!specieItem) {
                    fetchResponse(specie).then(res =>{
                        localStorage.setItem(`specie${specieNumber}`, res['name']);
                        specieItem = res['name'];
                        let speciesNow = localStorage.getItem(`charSpecies${number}`);
                        if (speciesNow){speciesNow+=`, "${specieItem}"`;}
                        else speciesNow = `"${specieItem}"`;
                        localStorage.setItem(`charSpecies${number}`, speciesNow);
                    })
                } else {
                    let speciesNow = localStorage.getItem(`charSpecies${number}`);
                    if (speciesNow){speciesNow+=`, "${specieItem}"`;}
                    else speciesNow = `"${specieItem}"`;
                    localStorage.setItem(`charSpecies${number}`, speciesNow);
                }     
            })
            
        }
        if (res['films']) {
            let films = res['films'];      
            films.forEach(film => {
                let filmNumber = film.match(/\d+/)
                let filmItem = localStorage.getItem(`film${filmNumber}`)
                if (!filmItem) {
                    fetchResponse(film).then(res =>{
                        localStorage.setItem(`film${filmNumber}`, res['title']);
                        filmItem = res['title'];
                        let filmsNow = localStorage.getItem(`charFilms${number}`);
                        if (filmsNow){filmsNow+=`, "${filmItem}"`;}
                        else filmsNow = `"${filmItem}"`;
                        localStorage.setItem(`charFilms${number}`, filmsNow);
                    })
                } else {
                    let filmsNow = localStorage.getItem(`charFilms${number}`);
                    if (filmsNow){filmsNow+=`, "${filmItem}"`;}
                    else filmsNow = `"${filmItem}"`;
                    localStorage.setItem(`charFilms${number}`, filmsNow);
                }     
            })
        }
    }); 
};
for(let i = 9; i<17; i++){
    forPeople(i)
}


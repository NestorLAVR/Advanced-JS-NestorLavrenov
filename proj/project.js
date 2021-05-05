async function fetchResponse(url){
    let response = await fetch(url);
    let res = await response.json();
    return res;
}

function forPeople(number, item){   
    if(!localStorage.getItem(`name${number}`)){
        let myUrl = `https://swapi.dev/api/people/${number}/`;
        fetchResponse(myUrl).then(res=> peopleData(res, number, item));
    } else {
        item.children[0].innerText = localStorage.getItem(`name${number}`);
    } 
};
function peopleData (res, number, item) {
    {
        if(res['name']){localStorage.setItem(`name${number}`,res['name']); item.children[0].innerText = res['name']}        
        if(res['birth_year']) {localStorage.setItem(`birthdate${number}`,res['birth_year']);}
        if(res['gender']) {localStorage.setItem(`gender${number}`, res['gender']);}
        if(res['homeworld']){
            if(!localStorage.getItem(`charPlanet${number}`)){
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
        }
        if (res['species']) {
            if(!localStorage.getItem(`charSpecies${number}`)){
                let species = res['species']; 
                species.forEach(specie => {
                    let specieNumber = specie.match(/\d+/)
                    let specieItem = localStorage.getItem(`specie${specieNumber}`)
                    if (!specieItem) {
                        fetchResponse(specie).then(res =>{
                            localStorage.setItem(`specie${specieNumber}`, res['name']);
                            specieItem = res['name'];
                            let speciesNow = localStorage.getItem(`charSpecies${number}`);
                            if (speciesNow){speciesNow+=`, ${specieItem}`;}
                            else speciesNow = `${specieItem}`;
                            localStorage.setItem(`charSpecies${number}`, speciesNow);
                        })
                    } else {
                        let speciesNow = localStorage.getItem(`charSpecies${number}`);
                        if (speciesNow){speciesNow+=`, ${specieItem}`;}
                        else speciesNow = `${specieItem}`;
                        localStorage.setItem(`charSpecies${number}`, speciesNow);
                    }     
                })
            }
        }
        if (res['films']) {
            if(!localStorage.getItem(`charFilms${number}`)){
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
        }
    }
}
// for(let i = 1; i<84; i++){
//     if(i!=17){
//     forPeople(i)
//     }
// }






const MAXPERSON = 83;
const modal = document.getElementById('modal');
const filter = document.getElementById('filter')
const persons = document.getElementById('persons').children;

fetchResponse("https://swapi.dev/api/people/?page=1").then(res => {
    const peopleArr = res.results;
    for(let i = 0; i < persons.length; i++) {
        peopleData(peopleArr[i], i+1, persons[i])
    }
})


document.getElementById('closeModal').addEventListener('click', function(){
    modal.style.display = "";
    filter.style.display = "";
})


for(let i = 0; i < persons.length; i++) {
    persons[i].addEventListener('click', function(){
        modal.style.display = "block";
        filter.style.display = "block";
        modal.children[0].children[0].innerText = window.localStorage[`name${persons[i].name}`];
        modal.children[1].children[0].children[0].children[1].children[0].innerText = window.localStorage[`birthdate${persons[i].name}`];
        modal.children[1].children[0].children[1].children[1].children[0].innerText = window.localStorage[`gender${persons[i].name}`];
        modal.children[1].children[0].children[2].children[1].children[0].innerText = window.localStorage[`charFilms${persons[i].name}`];
        modal.children[1].children[0].children[3].children[1].children[0].innerText = window.localStorage[`charPlanet${persons[i].name}`];
        let specie = window.localStorage[`charSpecies${persons[i].name}`];
        if (specie) {
            modal.children[1].children[0].children[4].children[1].children[0].innerText = specie;
        } else {
            modal.children[1].children[0].children[4].children[1].children[0].innerText = "not specified";
        }     
    })
}

const pages = document.getElementById('pagination').children;

for(let i = 0; i < pages.length; i++) {
    pages[i].addEventListener('click', function(){
        for(let i = 0; i < pages.length; i++){
            pages[i].classList.remove('active')
        }
        this.classList.toggle('active')
        const muliplier = +this.value - 1;
        let btnValue = 10*muliplier+1;
        for(let i = 0; i < persons.length; i++) {
            persons[i].children[0].innerText=""; 
        }
        for(let i = 0; i < persons.length; i++) {
            if(btnValue < MAXPERSON+1){
                persons[i].style.opacity = '';  
                persons[i].style.cursor = '';              
                persons[i].name = btnValue;
                forPeople(btnValue, persons[i])
                btnValue++;
            }
            else {
                persons[i].style.opacity = '0';
                persons[i].style.cursor = 'default';
            }
        }
    })
}
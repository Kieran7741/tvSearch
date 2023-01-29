const tvApiUrl = "https://api.tvmaze.com/search"
const searchQueryUrl = (searchQuery) => `${tvApiUrl}/shows?q=${searchQuery}`
const fallbackImage = "https://yt3.googleusercontent.com/RAa3CiOggg0SWJgItLSxAYFUyWZqTRt5zWcjgVvEeD-snnLqBPoAFGyKoCWK6R5Xa2gJNhRZ-g=s900-c-k-c0x00ffffff-no-rj"


// =========== Data fetching ===========

const fetchShowData = async (searchTerm) => {
    let results = []
    try{
        const url = searchQueryUrl(searchTerm)
        const res = await fetch(url)
        const json = await res.json()
        results = json
    }catch(e){
        window.alert('Could not retrieve search results')
    }
    return results
};

// =========== User input processing ===========

/**
 * Search button onClick Handler
 */
const searchOnClick = async () => {
    const searchString = getSearchInputString()
    await searchForShow(searchString)
};

/**
 * Handles the users search term.
 * @param {string} searchTerm 
 */
const searchForShow = async (searchTerm) => {    
    clearSearchResults()
    toggleLoading()

    const results = await fetchShowData(searchTerm)

    toggleLoading()
    populateSearchResults(results)
};


// =========== Dom manipulation ===========

const getSearchInputString = () => {
    const searchInput = document.getElementsByName('searchInput')[0]
    const searchString = searchInput.value
    return searchString
}

const toggleLoading = () => {
    document.getElementById('loading').classList.toggle('hidden')
}

/**
 * Clears results
 */
const clearSearchResults = () => {
    const resultsDiv = document.getElementById('results')
    resultsDiv.innerHTML = ''
}

const clearSearchInput = () => {
    document.getElementsByName('searchInput')[0].value = ''
}


/**
 * Creates a show card from a show object
 * @param show object returned by TV api
 */
const createShowCard = (show) => {
    const showCard = document.createElement('div')
    showCard.classList.add('card')
    showCard.classList.add('column')

    const title = document.createElement('h3')
    title.classList.add('cardTitle')
    title.innerText += show.show.name

    showCard.appendChild(title)

    const img = document.createElement('img')
    img.classList.add('showImage')
    if (show.show.image){
        img.src = show.show.image.original
    }else {
        img.src = fallbackImage
    }
    
    showCard.appendChild(img)
    const summaryDiv = document.createElement('div')
    summaryDiv.classList.add('summary')
    summaryDiv.innerHTML = show.show.summary
    showCard.appendChild(summaryDiv)
    
    return showCard
}

const populateSearchResults = (results) => {
    const resultsDiv = document.getElementById('results')
    if(results.length == 0){
        resultsDiv.innerHTML = `<h3>No search results for search term: "<i>${getSearchInputString()}</i>"</h3>`
        return
    }
    results.forEach(show => {
        const card = createShowCard(show)
        resultsDiv.appendChild(card)
    });
}

// ======== Listeners =========

const searchOnEnterListener = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("searchBtn").click();
    }
}
const addListeners = () => {
    const searchInput = document.getElementsByName('searchInput')[0]
    searchInput.addEventListener('keypress', searchOnEnterListener)
}

// ======== Page load actions =======

function main() {
    addListeners()
    clearSearchInput()
    clearSearchResults()
}

main()
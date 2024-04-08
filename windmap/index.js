if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./tmp');
  }

async function fetchPage(pageUrl) {
    let response = null, body=null
    console.log('fetching', pageUrl)
    try {
        response = await fetch(pageUrl)
        if (response.ok) {
            console.log('got page response', pageUrl)
            body = await response.text()
            console.log('got body', pageUrl)
        } else {
            throw new Error('Network response was not ok.')
        }
    }
    catch (error) {
        console.error('Error fetching', error)
    }
    finally {
        return body
    }
}

async function getPage(pageUrl) {
    console.log('getpage', pageUrl)
    let page=localStorage.getItem(pageUrl)
    if (page) {
        console.log('got page from local storage', pageUrl)
    } else {
        page = await fetchPage(pageUrl)
        localStorage.setItem(pageUrl, page)
        console.log('got page from fetch and saved to local storage', pageUrl)
    }
    return page
}


async function main() {
    // let response = await getpage('https://quotes.toscrape.com/random')
    let body = await getPage('https://tempestwx.com/station/105376/')
    console.log('Back from getPage')
}


// main()
console.log('windmap/index.js running!')
main()

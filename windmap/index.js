async function getpage(pageUrl) {
    let response = null, body=null
    console.log('fetching', pageUrl)
    try {
        response = await fetch(pageUrl)
        if (response.ok) {
            console.log('got page', pageUrl)
            body = await response.text()
            console.log('body', body)        
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

async function main() {
    let response = await getpage('https://tempestwx.com/station/105376/')
    // let response = await getpage('https://quotes.toscrape.com/random')
}


// main()
console.log('windmap/index.js running!')
main()

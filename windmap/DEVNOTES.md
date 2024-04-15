# DEVNOTES

## TODO

-   fetchpage - useCach - use global debug value or at least send parameter
-   switch from LocalStorage to somethign else
-   rename index.ts to main.ts
-   extract WindSite to its own file

## Typescript / VSCode debuging

-   Getting vscode to properly run and debug typescript was a huge pain!
-   [This](https://stackoverflow.com/a/74608156/1400991) solved it for me.
-   <https://www.npmjs.com/package/tsx>
-   `node-ts` did not work easily

## Why Node?

A mistake!

I thought I'd be able to do this in a browser.

But you can't scrape other pages from a different page - at least not easily. So I'm going to have to scrape on the server and render on a page. So I could have done it locally.

That said, it is somewhat fun and educational to use node and typescript. This isn't much harder than python.

I _might_ even be able to find a way to scrape on the client side. But I doubt it.

## New plan - server based system

-   WindSite[] list
-   Promise.all([processSite(site) for site in WindSite[]])
-   Then, separately a server to serve the data
-   Then a webpage that displays the data

## Javascript + Python

-   I'm going to leave the scraper in typescript.
-   Obviously front end code will be in javascript.
-   Everything else will be python. EG: the server.

## Scraper

```typescript
scraper.ts

runScraper() {
    window.setTimout(() => {
        processAll()
    }, 1000 * 60 * 5) // every 5 minutes
}

processAll() {
    for site in WindSite[] {
        processSite(site)
    }
}

processSite(site: WindSite) {
    // fetch the page
    // parse the page
    // store the data
}

class ProccessSite{
    handleSite(site: WindSite) {
        fetch(site)
        .then(parse)

    return data
    }
}
```

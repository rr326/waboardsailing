Title: Contributing

# Contributing

Are you an experienced WA sailor? If so, this website needs _your_ help.

If a lot of people contribute a little effort, we can create a great resource
for people getting started boardsailing in WA.

I (<a href="mailto:cab_mall0n@icloud.com" >Ross Rosen</a>)
can put the site together, but I do not have the expertise to build the content.
That's where the community steps in.

I'd like to have different people "own" different pages. For instance, someone
could "own" the [Sail Sand Point page](/sites/ssp). They would write
the content so someone new to sailing or new to Seattle would get a pretty good
idea of if they should try it, when to go (forecasting), and any tips.

These articles should _mostly_ be focused on beginners and interemediates. If
you want to put more info in for experts, put it at the bottom of the page in an
area labeled "Advanced Topics". Even there, try not to be too controversial.
If there is significant disagreement between experts, refer to it in the
"NW-Windtalk Threads" section.

## Where to Send Files

The easiest for me is if you drop them directly in my
[Dropbox Folder](https://www.dropbox.com/request/1VXxCyjf1txdRb2PPV9V).
Just click that link and you can drop files there.

Or you can <a href="mailto:cab_mall0n@icloud.com" >email me.</a>. But if
you have big files (like photos), please use the above Dropbox link.

## Technical Expertise

This site is written in a modified version of ["Markdown"](https://www.markdownguide.org/getting-started/).
It would be much easier for me if all contributors would spend a little time and learn Markdown.
But you don't have to. If you send me a plain text file, I will manually import it into Markdown.

[Dillinger](https://dillinger.io) is apparently a good WYSIWYG Markdown editor you can use. Note - it will NOT be able to process the meta data and create the table at the top of the site page. You'll just have to wait til I publish it for that.

If you are a developer you are welcome to submit PRs: [github](https://github.com/rr326/waboardsailing).

## How To

This website uses a website builder call [Pelican](https://getpelican.com). It uses
Markdown, with some "metadata" at the top, and with a custom theme that I built.
Below is an example of the Markdown for the Magnusson page.

```
template: site
Title: Mags
lat_lon: 47.675585, -122.251607
region: Lake Washington
best_wind: SE, S, SE (side offshore)
level: intermediate
fee: Free
parking: Ample
launch: Open grassy area followed by a small drop and rocky beach. Wind shadow when wind is westerly.
foiling: Good for foiling. No major hidden obstacles.
forecast: <a href="https://wx.ikitesurf.com/spot/116695" target="_blank">iWindsurf</a>
webcam:
author: Ross Rosen
author_email: cab_mall0n@icloud.com

# Magnusson Park
*(aka: Mags, Maggie )*

## Overview

There are two main launches in Seattle's Magnusson Park ..

![Mags_Launch](/images/mags_overview.jpg)

## Forecasting

TBD


## Advanced Topics

TBD

## NW-Windtalk Threads

TBD

```

### Metadata

Unfortunately, this stuff is a bit picky, so do your best but don't sweat
it.

- `template`
  - If a launch, set as `site`
  - Otherwise, **DELETE THE WHOLE LINE**
- `Title` - This determines the page name
  - Otherwise, **DELETE THE WHOLE LINE**
- `lat_lon`
  - Copy this from Google Maps. Point to the parking lot
  - The computer will automatically create a Google Map link.
- `forecast` and `webcam`
  - If you are technical, you can insert html links to the best
    forecast pages. Like this:
    `<a href="https://wx.ikitesurf.com/spot/116695" target="_blank">iWindsurf</a>`
  - If you are not, just paste the links and I'll deal with it.
- `author_email` - I used my mac to create a 'hide my email' email address, just
  in case it gets picked up by spam bots.

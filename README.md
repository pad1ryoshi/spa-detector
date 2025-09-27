# spa-detector
"An SPA (Single-page application) is a web app implementation that loads only a single web document, and then updates the body content of that single document via JavaScript APIs such as Fetch when different content is to be shown." - MDN

## Summary
Chrome extension to detect Single Page Applications.

## Demo

If you are using a Single Page Application, the extension will look like this:

<img width="253" height="268" alt="image" src="https://github.com/user-attachments/assets/29d03fb0-0ada-48cc-a37b-ad9d3a0dafc7" />

If you are not using a Single Page Application, the extension will look like this:

<img width="258" height="222" alt="image" src="https://github.com/user-attachments/assets/5007760a-6461-414d-8c96-85b22be47581" />

## Why?

I study web application security and also do Bug Bounty. One of the best communities I frequently participate is [Critical Thinking](https://www.criticalthinkingpodcast.io/). One of the things I learned most after getting to know this community was about client-side hacking, and obviously SPAs are a good place to practice and hunt with this style of hacking. [Check this about hacking SPAs](https://blog.criticalthinkingpodcast.io/p/hackernotes-ep-114-single-page-application-hacking-playbook). 

Identifying SPAs is not complicated, but with this extension, I can have something visual that triggers an “alert” in my mind. Just it.

Currently, the extension detects the following technologies: React, Angular, Vue, Svelte, Ember, Nextjs, Nuxt. 

## Features
If you think something needs to be added or improved, feel free to contact me or make a PR in this repository.

## Resources

[SPA - MDN](https://developer.mozilla.org/en-US/docs/Glossary/SPA) -
[Hacking SPA - CT (Youtube)](https://www.youtube.com/watch?v=OAKMnz7qnJE)


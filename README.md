# Reflect

An third-party [Revolt.chat](https://revolt.chat) client built with Next.js and Shadcn/ui

This is a monorepo which shares `apps` and `packages` folder.

## File Structures

```
├── apps
│   └── web
│       ├── postcss.config.mjs
│       ├── public
│       │   ├── file.svg
│       │   ├── globe.svg
│       │   ├── next.svg
│       │   ├── vercel.svg
│       │   └── window.svg
│       └── src
│           ├── app
│           │   ├── app
│           │   │   ├── debug
│           │   │   ├── dm
│           │   │   │   └── [id]
│           │   │   ├── home
│           │   │   └── server
│           │   │       └── [id]
│           │   │           └── channel
│           │   │               └── [channelId]
│           │   ├── favicon.ico
│           │   ├── globals.css
│           │   ├── hooks
│           │   └── login
│           ├── assets
│           ├── components
│           │   ├── hooks
│           │   ├── markdown
│           │   │   ├── components
│           │   │   └── plugins
│           │   ├── message
│           │   │   ├── components
│           │   │   ├── memoization
│           │   │   ├── utils
│           │   │   └── wrappers
│           │   └── ui
│           ├── hooks
│           └── lib
└── packages
```

## TODO

- [ ] Translation (via Paraglide)
- [ ] Improve System Messages
- [ ] All-new Compose
    - [ ] Composer feature
    - [ ] Better Attachment UI
- [ ] Mobile UI (Pain)
- [ ] Redo the whole Home page design (yes, it looked like shit)
- [ ] Proper Config Manager 
    - [ ] Make it modular
    - [ ] Design the configuration page/dialog
    - [ ] Fuzzy Search
    - [ ] Filtering
- [ ] Full markdown support
    - [ ] Fix custom emoji rendering
    - [ ] Feature packed codeblock
- [ ] Improved Message UI
    - [ ] Reply Support
    - [ ] Reaction Support
- [ ] Don't memoize Avatar component
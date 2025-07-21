import localforage from "localforage";

const sessionStorage = localforage.createInstance({
    name: "sessionStore",
    driver: localforage.LOCALSTORAGE,
})

export {sessionStorage};
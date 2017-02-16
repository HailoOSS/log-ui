**WARNING**
This branch is a wip and subject to changes!!!

Portal web-template
===================

An internal portal template using React/Flux.

## Setup

```
npm install
```

## Dev

```
./node_modules/.bin/gulp start
```

# Basics

You will need to have a basic understanding of the following libraries and pattern to efficiently build a portal:
- Reactjs http://facebook.github.io/react/docs/getting-started.html
- Flux https://facebook.github.io/flux/docs/overview.html

tl;dr

- Add the page you want to create into the router, see router.js, e.g:
```
<Route name={RouteNames.CRUFT} path="cruft" handler={Cruft}/>
```
- Create the component you need to for that route, see Cruft.js :)
- Add your business logic within a store.
- Listen to the relevant store within your component.
- Trigger actions (e.g. './actions/serviceActions.js') from your components.
- Use utils to handle the actions and manage async calls and the likes; and trigger actions when your data is ready.
- Listen to your actions from within the store and update your Immutable data structures as needed.
=> You components having been set as listener to store changes will update :D Taaaddaaa!

## Versions

### 0.12.x

- Uses React 0.12.x

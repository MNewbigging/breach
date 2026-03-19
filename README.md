# Developing

To get started:

- npm install
- npm run start

# Branching

There are two 'main' branches:

- master: anything pushed to master will be published to the Github Pages site, do this sparingly
- dev: our feature branches go into dev, not master, and then dev can be merged into master periodically or whenever publishing is required

For contributing:

- make your own feature branch (it can be long-lived under your name, or short-lived per feature)
- when ready, make a PR from your branch into dev (not master)

# Need to know

Some quick pointers:

- using framer-motion for animations; use this as much as possible when animating anything
- common-styles.scss holds any styling that would affect all/most components
- using css modules so that the same class name in two components doesn't cross over styles
- also using clsx to help with optional/multiple class names

# i18n gui :watch:

A tool which simplifies management of your translation files :godmode:

> Project made with ❤️, Electron and React. Contributions are welcome


# Table of Contents

* [How it works](#how-it-works)
* [Features](#features)
* [How to install](#how-to-install)
* [Development](#development)

# <a name="how-it-works"></a>How it works

### Create a project
Select json files and give a project a name. The project will appear in recent projects once created

![Blocking Window](https://raw.githubusercontent.com/DeH4er/i18n-gui/master/.github/recent-projects.png)

### Manage files
The app will merge each translation into a single view for a more simplistic workflow.

![Settings Window](https://raw.githubusercontent.com/DeH4er/i18n-gui/master/.github/main-view.png)

# <a name="features"></a>Features
### Search

Search matches translation node name as well as translation content itself.

It's also possible to search for paths with ".", ex. "grou.nes" will match nodes with path like "ROOT.GROUP.INSIDE.NESTED" or "GROUP.NESTED"

### Language generation

User can write language generation rules in case some language may be derived from another one. It might be useful ex. for en-US and en-UK or whenever your project needs a placeholder in place of a specific language to rewrite it later.

### Creation of translation nodes

It's possible to create a translation group or leaf not only within already existing translation group. Ex. creation of a node with path "A.B.C.D" will create A, B and C groups if these groups do not exist

# <a name="how-to-install"></a>How to install

Grab a latest exe installer under [releases page](https://github.com/DeH4er/i18n-gui/releases)

# <a name="development"><a/>Development

### How to run

```bash
npm run dev
```
  
### How to run tests
```bash
npm run test:watch
# or
npm run test
```


### How to make an installer

```bash
npm run build
```

You'll find an installer under `release` folder.

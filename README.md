#### About


#### Usage & Install

`yarn install`

#### Gulp Tasks

The tasks are divided in 3 groups: compile phase, watch phase, and run. these tasks make gulp more flexible depending on the requirements you're currently working on.

The `run:production` task, cleans the output dir, compile all src files, applies cache burst for css & js files, also copies the asset folder to the same dir, while optimizing images automatically.


###### [Compile] tasks
| Task              |  Description  |
| ---               |  ---          |
| compile:scss      |  Compiles the SCSS directory `src/scss`, minify, and copy its output to `public/css`   |
| compile:js        |  Compiles the JS directory `src/scripts`, bundle, and copy its output to `public/js`   |
| compile:pug       |  Compiles the Views directory `src/views` with Pug engine and copy its output to `public/`   |
| compile:assets    |  Copy all assets (fonts, images, icons) from `/assets` and copy its output to `public/assets`   |
| compile:default   |  Run all the above tasks in series |


###### [Watch] tasks
| Task | Description |
| --- | --- |
| watch:scss | - |
| watch:js | - |
| watch:pug | - |
| watch:assets | - |

  

###### [Development] Tasks
| Task | Description |
| ---           | --- |
| run:dev       | Runs the Browsersync server, compiles all sources, and watch changes for browser reloading |
| run:optimize  | - Not implemented - |
| run:clean     | Deletes the entire output dir `public` |

###### [Production] Tasks
| Task | Description |
| --- | --- |
| run:production | - |
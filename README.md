# My Akinator

## Overview

Sample web application for [Akinator API](https://github.com/jgoralcz/aki-api).


## How to setup

- Install Node.js and npm

- Git clone or Download this source code.

- Edit **settings.js** file, if you want:

  - exports.majin_img_url : URL of majin image

  - exports.eligible : number of percentage which is minimum confidence for stop guessing.

- Install dependencies

  - `$ npm install`


## How to use CLI files

### generate.js

- Generate IBM Watson NLC corpus.
- Run generate.js

  - `$ node generate.js`

### classsdify.js

- Test your corpus.

- Run classify.js

  - `$ node classify.js [俳句のテキスト]`

### delete.js

- Delete your corpus.

- Run delete.js

  - `$ node delete.js`


## How to run web application

- Run app.js

  - `$ node app.js`


## Reference

- aki-api(Akinator)

  - https://github.com/jgoralcz/aki-api

  - methods

    - Create object
    
      - `var { Aki } = require( 'aki-api' );`

    - Find available regions
    
      - `var { regions } = require( 'aki-api' );`

    - Instanciate object with region

      - `var aki = new Aki( 'jp' );`
    
    - Initialize(Start guessing)

      - `await aki.start();`

    - Retrieve current question

      - `aki.question`

    - Retrieve current answers

      - `aki.answers`  (`[ 'はい', 'いいえ', '分からない', 'たぶんそう 部分的にそう', 'たぶん違う そうでもない' ]`)
    
    - Input answer for current question

      - `await aki.step( 0 );` ( Input `0`(「はい」) for this case.)
    
    - Retrieve current progress (after step() )

      - `aki.progress`

    - Retrieve current step (after step() )

      - `aki.currentStep`

    - Finish guessing

      - `await aki.win();`

    - Find current guessings

      - `aki.answers`
    
    - Find current guess count

      - `aki.guessCount`
    


## Copyright

2020 [K.Kimura @ Juge.Me](https://github.com/dotnsf) all rights reserved.

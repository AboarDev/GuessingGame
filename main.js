Vue.component('chose-game', {
  template: `<div class='box'>
      <div class="jumbotron">
      <h4>Chose a Game! Selected: {{ chosen }}</h4>
      </div>
      <p><strong>Response Type</strong></p>
      
      <div class="custom-control custom-radio custom-control-inline">
      <input id='lowerHigher' type='radio' name='responseType' value='lowerHigher' v-model='selected[0]' class="custom-control-input">
      <label class="custom-control-label" for='lowerHigher'>Lower or Higher</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
      <input id='hotCold' type='radio' name='responseType' value='hotCold' v-model='selected[0]' class="custom-control-input">
      <label class="custom-control-label" for='hotCold'>Hot or Cold</label>
      </div>
      <p><strong>Guess By</strong></p>
      
      <div class="custom-control custom-radio custom-control-inline">
      <input id='userGuess' type='radio' name='guessType' value='userGuess' v-model='selected[1]' class="custom-control-input">
      <label class="custom-control-label" for='userGuess'>User will Guess</label>
      </div>
      <div class="custom-control custom-radio custom-control-inline">
      <input id='computerGuess' type='radio' name='guessType' value='computerGuess' v-model='selected[1]' class="custom-control-input">
      <label class="custom-control-label" for='computerGuess'>Computer will Guess</label>
      </div>
      <br>
      
      <input class="btn btn-primary" type='button' v-bind:disabled='chosen == 0' value='Select' v-on:click="$emit('selected',chosen)">
     </div>`,
  data: function () {
    return {
      games: [
        { text: 'Game 1', value: 1, responseType: 'lowerHigher', guessType: 'userGuess' },
        { text: 'Game 2', value: 2, responseType: 'hotCold', guessType: 'userGuess' },
        { text: 'Game 3', value: 3, responseType: 'lowerHigher', guessType: 'computerGuess' },
        { text: 'Game 4', value: 4, responseType: 'hotCold', guessType: 'computerGuess' }
      ],
      selected: []
    }
  },
  computed: {
    chosen: function () {
      const i = this.games.find(game => game.responseType === this.selected[0] && game.guessType === this.selected[1])
      if (i) {
        return i.value
      } else {
        return 0
      }
    }
  }
})

Vue.component('games-1-2', {
  props: {
    type: 0
  },
  template: `
    <div class='box'>
      <div class="jumbotron">
      <h4>Our Guess: <span>{{ userGuess }}</span></h4>
      </div>
      <p v-show='response' class="alert alert-info">{{ response }}</p>
      <input type='range' v-model.number="userGuess" max='99' class="custom-range">
      <input type='button' value='Input Guess' v-on:click='game' v-bind:disabled='inputDisabled' class="btn btn-primary">
      <br>
      <results v-show='inputDisabled' v-bind:input='inputLog'></results>
    </div>
  `,
  data: function () {
    return {
      userGuess: 50,
      response: null,
      guesses: [],
      guessCount: 0,
      inputDisabled: false,
      random: 0,
      inputLog: []
    }
  },
  methods: {
    game: function () {
      console.log(this.type)
      if (this.guessCount === 0) {
        this.random = Math.floor(Math.random() * 100)
        console.log(this.random)
      }
      this.guessCount += 1
      var difference = this.random - this.userGuess
      if (difference < 0) {
        difference = difference * -1
      }
      console.log(this.userGuess, this.guessCount, difference)
      if (this.userGuess === this.random) {
        this.response = `Correctly guessed in ${this.guessCount} trials`
        this.inputDisabled = true
      } else if (this.type === 1 && this.userGuess !== this.random) {
        if (this.userGuess > this.random) {
          this.response = 'Try Lower'
        } else if (this.userGuess < this.random) {
          this.response = 'Try Higher'
        }
      } else if (this.type === 2 && this.userGuess !== this.random) {
        const responses = { 9: 'HOT', 19: 'WARM', 39: 'COOL', 99: 'COLD' }
        let i = difference
        for (const aResponse in responses) {
          if (i <= aResponse) {
            i = aResponse
            break
          }
        }
        this.response = responses[i]
      }
      this.inputLog.push({ key: this.guessCount, guess: this.random, response: this.response })
    }
  }
})

Vue.component('games-3', {
  template: `
    <div class='box'>
      <p class="alert alert-info" v-if='guessCount < 1'>Think of a number</p>
      <div class="jumbotron">
      <h4 v-if='guessCount > 0'>Computer Guess: {{ random }}</h4>
      </div>
      <input type='button' value='OK' v-on:click='game' v-if='guessCount < 1' class="btn btn-primary">
      <div v-show='guessCount > 0'>
        <input type="button" value="Try Lower" v-on:click="input('lower')" class="btn btn-primary">
        <input type="button" value="Correct" v-on:click="input('correct')" class="btn btn-primary">
        <input type="button" value="Try Higher" v-on:click="input('higher')" class="btn btn-primary">
      </div>
      <p>{{ response }}</p>
      <results v-show='inputDisabled' v-bind:input='inputLog'></results>
    </div>
  `,
  data: function () {
    return {
      response: ' ',
      guesses: [],
      guessCount: 0,
      random: 0,
      min: 0,
      max: 99,
      inputLog: [],
      inputDisabled: false
    }
  },
  methods: {
    game: function () {
      if (this.guessCount === 0) {
        this.random = Math.floor(Math.random() * 100)
        console.log(this.random)
      }
      this.guessCount += 1
    },
    input: function (inp) {
      this.inputLog.push({ key: this.guessCount, guess: this.random, response: inp })
      if (inp === 'higher') {
        if (this.random === this.max) {
          window.alert('LIES')
          return
        }
        this.guessCount += 1
        this.min = this.random + 1
        this.getRandom()
      } else if (inp === 'lower') {
        if (this.random === this.min) {
          window.alert('LIES')
          return
        }
        this.guessCount += 1
        this.max = this.random - 1
        this.getRandom()
      } else if (inp === 'correct') {
        this.response = `Correctly guessed in ${this.guessCount} trials`
        this.inputDisabled = true
      }
    },
    getRandom: function () {
      this.random = Math.floor(Math.random() * this.difference(this.min, this.max)) + this.min
      console.log(this.min, this.max, this.random)
    },
    difference: function (a, b) {
      let difference = a - b
      if (difference < 0) {
        difference = difference * -1
      }
      return difference
    }
  }
})

Vue.component('games-4', {
  template: `
  <div class='box'>
    <div v-if='guessCount < 1'>
      <p class="alert alert-info">Enter of a number {{ toGuess }}</p>
      <input type='range' v-model.number="toGuess" max='99' class="custom-range">
      <input type="button" value="ok" v-on:click="game" class="btn btn-primary">
    </div>
    <div v-if='guessCount > 0'>
      <div class="jumbotron">
      <h4>Computer Guess: {{ theGuess }}</h4>
      </div>
      <input type="button" value="Correct" v-on:click="input('correct')" v-bind:disabled='response' class="btn btn-primary">
      <input type="button" value="Hot (0-9)" v-on:click="input('hot')" v-bind:disabled='response' class="btn btn-primary">
      <input type="button" value="Warm (10-19)" v-on:click="input('warm')" v-bind:disabled='response' class="btn btn-primary">
      <input type="button" value="Cool (20-39)" v-on:click="input('cool')" v-bind:disabled='response' class="btn btn-primary">
      <input type="button" value="Cold (40+)" v-on:click="input('cold')" v-bind:disabled='response' class="btn btn-primary">
    </div>
    <p v-show='response'>Correctly guessed in {{ guessCount }} trials</p>
    <results v-show='response' v-bind:input='inputLog'></results>
  </div>
  `,
  data: function () {
    return {
      guessCount: 0,
      theGuess: 50,
      theDifference: [0, 0],
      min: 0,
      max: 100,
      response: false,
      inputLog: [],
      toGuess: 0
    }
  },
  methods: {
    game: function (inp) {
      // const rand = this.getRandom(this.theDifference[0],this.theDifference[1])
      // 0 negative, 1 positive
      if (this.guessCount > 0) {
        this.theDifference = inp
        console.log(this.theGuess, 'a')
        const newMin = this.theGuess - inp[1]
        const newMax = this.theGuess + inp[1]
        if (newMin > this.min) {
          this.min = newMin
        }
        if (newMax < this.max) {
          this.max = newMax
        }
        // this.theGuess = this.getRandom(this.min,this.max) + this.min
        this.theGuess = this.getGuess(inp[0])
      }
      this.guessCount += 1
    },
    input: function (inp) {
      var aDifference = []
      switch (inp) {
        case 'hot':
          aDifference[0] = 0
          aDifference[1] = 9
          break
        case 'warm':
          aDifference[0] = 10
          aDifference[1] = 19
          break
        case 'cool':
          aDifference[0] = 20
          aDifference[1] = 39
          break
        case 'cold':
          aDifference[0] = 40
          aDifference[1] = 100
          break
        case 'correct':
          console.log('correct')
          this.inputLog.push({ key: this.guessCount, guess: this.theGuess, response: inp })
          this.response = true
          return
      }
      if (this.difference(this.theGuess, aDifference[0]) > this.difference(this.theGuess, this.toGuess) && this.inp === !'hot') {
        window.alert('LIES')
        return
      }
      this.inputLog.push({ key: this.guessCount, guess: this.theGuess, response: inp })
      this.game(aDifference)
    },
    difference: function (a, b) {
      let difference = a - b
      if (difference < 0) {
        difference = difference * -1
      }
      console.log(`difference ${difference}`)
      return difference
    },
    getRandom: function (min, max) {
      console.log(`min ${min}, max ${max}`)
      return Math.floor(Math.random() * this.difference(min, max)) + (min - 1)
    },
    getGuess: function (inp) {
      var min = this.min
      var max = this.max
      if (inp) {
        if (Math.floor(Math.random() * 2) === 0) {
          const i = this.theGuess - inp
          if (i < 97 && i > 3) {
            max = i
          }
        } else {
          const i = this.theGuess + inp
          if (i < 97 && i > 3) {
            min = i
          }
        }
      }
      return this.getRandom(min, max)
    }
  }
})

Vue.component('results', {
  props: ['input'],
  template: `
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>Guess</th>
          <th>Response</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for='input in input'>
          <td>{{ input.key }}</td>
          <td>{{ input.guess }}</td>
          <td>{{ input.response }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `,
  data: function () {
    return {

    }
  },
  computed: {

  },
  methods: {

  }
})

var app = new Vue({
  el: '#app',
  data: {
    guesses: [],
    guessCount: 0,
    inputDisabled: false,
    chosen: 0
  },
  methods: {
    reset: function () {
      this.guessCount = 0
      this.userGuess = 50
      this.response = ' '
      this.inputDisabled = false
      this.chosen = 0
    },
    input: function (input) {
      console.log(input)
      this.inputDisabled = true
      this.chosen = input
    }
  }
})

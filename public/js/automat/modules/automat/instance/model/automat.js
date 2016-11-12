define(['backbone'], function(Backbone){
    return Backbone.Model.extend({

        defaults: {
            totalWin: 50,
            roundWin: 0,
            bet: 1,
            roundResult: null,
            maxBet: 9,
            linecost: 5,
            winCostOverlap: 10, // don't use
            turnbet: null,
            isButtonDisable: false,
            speedRotate: 800,
            key: "keepSimple"
        },

        tableForGenerateResult: null, // [1, 2, 2, 3, 3, 3, 4, 4, 4, 4 ....]

        winnerTable: [
            {
                bit: 1,
                value: [2, 2, 2, 2, 2]
            },
            {
                bit: 2,
                value: [1, 1, 1, 1, 1]
            },
            {
                bit: 3,
                value: [3, 3, 3, 3, 3]
            },
            {
                bit: 4,
                value: [1, 2, 3, 2, 1]
            },
            {
                bit: 5,
                value: [3, 2, 1, 2, 3]
            },
            {
                bit: 6,
                value: [1, 1, 2, 1, 1]
            },
            {
                bit: 7,
                value: [3, 3, 2, 3, 3]
            },
            {
                bit: 8,
                value: [2, 3, 3, 3, 2]
            },
            {
                bit: 9,
                value: [2, 1, 1, 1, 2]
            }
        ],

        // win[key] - count of repetition
        // win[value] - count of money
        tableOfStars: [
            {
                percent: 1,
                id: 1,
                name: "10",
                win: {
                    2: 1,
                    3: 2,
                    4: 10,
                    5: 25
                }
            },
            {
                percent: 2,
                id: 2,
                name: "A",
                win: {
                    2: 5,
                    3: 10,
                    4: 20,
                    5: 100
                }
            },
            {
                percent: 3,
                id: 3,
                name: "beer",
                win: {
                    2: 5,
                    3: 10,
                    4: 50,
                    5: 200
                }
            },
            {
                percent: 4,
                id: 4,
                name: "gun",
                win: {
                    2: 10,
                    3: 20,
                    4: 100,
                    5: 750
                }
            },
            {
                percent: 5,
                id: 5,
                name: "hat",
                win: {
                    2: 10,
                    3: 15,
                    4: 75,
                    5: 400
                }
            },
            {
                percent: 6,
                id: 6,
                name: "J",
                win: {
                    2: 1,
                    3: 2,
                    4: 20,
                    5: 40
                }
            },
            {
                percent: 7,
                id: 7,
                name: "K",
                win: {
                    2: 2,
                    3: 5,
                    4: 15,
                    5: 75
                }
            },
            {
                percent: 8,
                id: 8,
                name: "Q",
                win: {
                    2: 2,
                    3: 4,
                    4: 12,
                    5: 50
                }
            },
            {
                percent: 9,
                id: 9,
                name: "shouse",
                win: {
                    2: 6,
                    3: 12,
                    4: 60,
                    5: 300
                }
            },
            {
                percent: 10,
                id: 10,
                name: "star",
                win: {
                    2: 10,
                    3: 20,
                    4: 125,
                    5: 1000
                }
            },
            {
                percent: 1,
                id: 11,
                name: "bull",
                any: true
            }
        ],

        initialize: function(){
            this.tableForGenerateResult = this.generateTableResult();
            this.setTurnbet();

            var coutBetBit1 = 0;
            var winnerStart = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10: 0,
                11: 0
            }

            /*var popitka = 100000;

            for(var i = 0; i < popitka; i++ ){
                this.set("roundResult", this.generateResult());
                var winnerBet = this.getAllWinnerBet();
                if( winnerBet.length ){
                    for( var k = 0; k < winnerBet.length; k++ ){

                        winnerStart[winnerBet[k]['winnerStar']]++;

                        if( winnerBet[k].bet_bit == 1 ||  winnerBet[k].bet_bit == 2  ){
                            coutBetBit1++;
                        }
                    }
                }
            }

            console.log(winnerStart);
            console.log("countBetBit: " + (coutBetBit1*100)/popitka + "%");
*/
        },

        // launch once
        setTurnbet: function(){
            var turnbet = this.get('bet') *  this.get('linecost');
            this.set('turnbet', turnbet);
        },

        /**
         * Генерирует один массив куда входят все id звезд.
         * Чем больше pecent тем больше звезд с одинаковым id будет в массиве
         * */
        generateTableResult: function(){
            var result = []
                , percent;
            for( var i = 0; i < this.tableOfStars.length; i++ ){
                percent = this.tableOfStars[i].percent;
                for( var j = 0; j < percent; j++ ){
                    result.push(this.tableOfStars[i]['id']);
                }
            }

            return this.shuffleArray(result);
        },

        shuffleArray: function(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        },

        getRandomStarts: function(count){
            var result = [];
            for( var i = 0; i < count; i++ ){
                result.push(this.tableOfStars[this.getRandomValue(0, 10)]);
            }
            return result;
        },

        getStarsByIds: function(stars){
            var result = [];
            for( var i = 0; i < stars.length; i++ ){
                for( var k = 0; k < this.tableOfStars.length; k++ ){
                    if( stars[i] == this.tableOfStars[k]['id'] ){
                        result.push(this.tableOfStars[k]);
                    }
                }
            }
            return result;
        },

        /**
         * Generate round result after player press play btn
         * */
        generateResult: function(options){
            var result = [];
            for( var i = 0; i < 5; i++ ){
                result.push( this.generateOneLine() );
            }

            this.set('roundResult',result);
            return result;
        },

        // generate result for one vertical line
        generateOneLine: function(){
            var line = [];
            for( var i = 0 ; i < 3 ; i++ ){
                line.push( this.generateOneBit() )
            }
            return line;
        },

        /**
         * рандомно выбирает из таблицы с id, один id
         * */
        generateOneBit: function(){
            var index = this.getRandomValue(0, this.tableForGenerateResult.length-1);
            return this.tableForGenerateResult[index];
        },

        getRandomValue: function(min, max){
            var rand = min - 0.5 + Math.random()*(max-min+1)
            return Math.round(rand);
        },

        getUserWinnerBet: function(){
            var roundResult = this.get("roundResult")
                , bet = this.get('bet')
                , result = []
                , currentBet
                , betResult;

            for( var i = 0; i < this.winnerTable.length; i++ ){
                currentBet = this.winnerTable[i];
                if( currentBet['bit'] <= bet ){
                    betResult = this.isBetWinner(currentBet, roundResult);
                    if( !betResult ) continue;
                    result.push(betResult);
                }
            }
            return result;
        },

        getAllWinnerBet: function(){
            var roundResult = this.get("roundResult")
                , bet = this.get('bet')
                , result = []
                , currentBet
                , betResult;

            for( var i = 0; i < this.winnerTable.length; i++ ){
                currentBet = this.winnerTable[i];
                betResult = this.isBetWinner(currentBet, roundResult);
                if( !betResult ) continue;
                result.push(betResult);
            }
            return result;
        },

        isBetWinner: function(bet, roundResult){
            var winnerValues = []
                , prevValue
                , nextValue
                , overlap = 0
                , lastOverlap = 0
                , winnerStar = null
                , lastWinnerStar;

            //collect winner values
            for(var i = 0; i < bet.value.length; i++){
                winnerValues.push(roundResult[i][ bet.value[i]-1 ]);
            }

            //transform 11 star to sublings star
            winnerValues = this.transform11ToSublings(winnerValues);

            for( i = 0; i < winnerValues.length; i++ ){
                if( i == 0 ){
                    prevValue = winnerValues[i];
                }
                nextValue = winnerValues[i];

                if( prevValue != nextValue ){
                    prevValue = nextValue;
                    if( overlap == 0 ){
                        winnerStar = null;
                    }else if( overlap <= 1 ){
                        //если уже были совпадения, запоминаем их
                        overlap = 1;
                        winnerStar = null;
                    } else{
                        lastWinnerStar = winnerStar;
                        lastOverlap = overlap;
                        overlap = 1;
                        winnerStar = null;
                        break;
                    }
                }else{
                    //есть совпадение с предыдущем
                    winnerStar = winnerValues[i];
                    overlap += 1;
                }
            }

            if( lastOverlap ){
                if( lastOverlap > overlap ){
                    overlap = lastOverlap;
                    winnerStar = lastWinnerStar;
                }else if( lastOverlap == overlap ){
                    if( lastWinnerStar > winnerStar ){
                        overlap = lastOverlap;
                        winnerStar = lastWinnerStar;
                    }
                }
            }

            if( overlap > 1 ){

                 /*console.log('-----------------------------')
                 console.log("winner star: " + winnerStar);
                 console.log("winnerValues: " + winnerValues);
                 console.log("overlap: " + overlap);
                 console.log('-----------------------------')*/

                return {
                    bet_bit: bet.bit,
                    overlap: overlap,
                    winnerStar: winnerStar
                }
            }else{
                return false;
            }
        },

        transform11ToSublings: function(winnerValues){
            var result = [];

            if( this.isOnlyAny(winnerValues) ){
                return [1, 1, 1, 1, 1];
            }




            for( var i = 0; i < winnerValues.length; i++ ){
                if( winnerValues[i] != 11 ){
                    result.push(winnerValues[i]);
                }else{
                    if( i == 0 ){
                        for( var k = i+1; k < winnerValues.length; k++ ){
                            if( winnerValues[k] != 11 ){
                                result.push(winnerValues[k]);
                                winnerValues[i] = winnerValues[k];
                                break;
                            }
                        }
                    }else{
                        winnerValues[i] = winnerValues[i-1];
                        result.push( winnerValues[i-1] );
                    }
                }
            }

            return result;
        },

        isOnlyAny: function(winnerValues){
            var result = true;

            for( var i = 0; i < winnerValues.length; i++ ){
                if( winnerValues[i] != 11 ){
                    result = false;
                    break;
                }
            }

            return result;
        },

        isHasAny: function(winnerValues){
            var result = false;

            for( var i = 0; i < winnerValues.length; i++ ){
                if( winnerValues[i] == 11 ){
                    result = true;
                    break;
                }
            }

            return result;
        },

        calculateLost: function(){
            var bet = this.get('bet')
                , lostRound = -bet * this.get('linecost')
                , totalWin = this.get('totalWin');
            this.set('roundWin', lostRound);
            this.set('totalWin', totalWin + lostRound);
        },

        calculateSuccess: function(){
            var  lostMoney = this.get('bet') * this.get('linecost')
                , winMoney = this.calculateWinMoney()
                , totalWin = this.get('totalWin')
                , total = winMoney - lostMoney;

            this.set('roundWin', total);
            this.set('totalWin', totalWin + total);
        },

        calculateWinMoney: function(){
            var winnerBet = this.getUserWinnerBet()
                , bet = this.get('bet')
                , winCostOverlap = this.get('winCostOverlap')
                , result = 0
                , winnerStar
                , star
                , currentOverlap;

            for( var i = 0; i < bet; i++ ){
                for( var k = 0; k < winnerBet.length; k++ ){
                    currentOverlap = winnerBet[k]['overlap'];
                    winnerStar = winnerBet[k]['winnerStar'];

                    if( winnerBet[k]['bet_bit'] == i+1 ){
                        star = this.findStarById(winnerStar);
                        if(star){
                            result += star.win[currentOverlap];
                        }
                        //result += winnerBet[k]['overlap'] * winCostOverlap;
                    }
                }
            }

            return result;
        },

        findStarById: function(id){
            var result;
            for( var i = 0; i < this.tableOfStars.length; i++ ){
                if( this.tableOfStars[i].id == id ){
                    result = this.tableOfStars[i];
                    break;
                }
            }
            return result;
        }
    })
});
define(['backbone'], function(Backbone){

    return Backbone.Model.extend({
        defaults: {
            score: 100,
            bet: 1,
            roundResult: null
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

        initialize: function(){
            this.tableForGenerateResult = this.generateTableResult();

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

            var popitka = 100000;

            for(var i = 0; i < popitka; i++ ){
                this.set("roundResult", this.generateResult());
                var winnerBet = this.isWinner();
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

        },

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

        tableOfStars: [
            {
                percent: 1,
                id: 1
            },
            {
                percent: 2,
                id: 2
            },
            {
                percent: 3,
                id: 3
            },
            {
                percent: 4,
                id: 4
            },
            {
                percent: 5,
                id: 5
            },
            {
                percent: 6,
                id: 6
            },
            {
                percent: 7,
                id: 7
            },
            {
                percent: 8,
                id: 8
            },
            {
                percent: 9,
                id: 9
            },
            {
                percent: 10,
                id: 10
            },
            {
                percent: 3,
                id: 11,
                any: true
            }
        ],

        /*tableOfStars: [
            {
                percent: 1,
                id: 1
            },
            {
                percent: 2,
                id: 2
            },
            {
                percent: 3,
                id: 3
            },
            {
                percent: 4,
                id: 4
            },
            {
                percent: 5,
                id: 5
            },
            {
                percent: 6,
                id: 6
            },
            {
                percent: 7,
                id: 7
            },
            {
                percent: 8,
                id: 8
            },
            {
                percent: 9,
                id: 9
            },
            {
                percent: 10,
                id: 10
            }
        ],*/

        generateResult: function(options){
            var result = [];
            for( var i = 0; i < 5; i++ ){
                result.push( this.generateOneLine() );
            }
            return result;
        },

        generateOneLine: function(){
            var line = [];
            for( var i = 0 ; i < 3 ; i++ ){
                line.push( this.generateOneBit() )
            }
            return line;
        },

        generateOneBit: function(){
            var index = this.getRandomValue(0, this.tableForGenerateResult.length-1);
            return this.tableForGenerateResult[index];
        },

        getRandomValue: function(min, max){
            var rand = min - 0.5 + Math.random()*(max-min+1)
            return Math.round(rand);
        },

        isWinner: function(){
            var roundResult = this.get("roundResult")
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
                        overlap = 0;
                        winnerStar = null;
                    } else{
                        lastWinnerStar = winnerStar;
                        lastOverlap = overlap;
                        overlap = 0;
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

               /* console.log('-----------------------------')
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
        }
    })

})


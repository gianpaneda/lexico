window.onload = function() {

    function scrollDown() {
        window.scrollTo(0, 420);
    }

    function analyze() {

        let commonWords = ["the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us", "since", "am", "are", "was", "were", "did", "has", "is", "i'm"]

        let wordCount = [];
        let wordFreq = [];

        let words = document.getElementById("input").value.toLowerCase()
            .replace(/[\".,-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')

        let wordStr = words.replace(/\s/g, "")

        let wordArr = words.replace(/ +/g, " ")
            .replace(/\s{2,100}/g, " ")
            .replace(/\n/g, " ")
            .trim()
            .split(" ")
            .sort()

        function filterCommonWords(element) {
            return commonWords.indexOf(element) === -1;
        }

        if (document.getElementById('removeCommonWords').checked == true) {
            filterCommonWords();
            console.log(lexicalDensity)
            wordArr = wordArr.filter(filterCommonWords);
        }

        let wordLengths = [];
        let wordLengthCount = {};
        let wordCountData = [];

        function compare(a, b) {
            if (a.y < b.y)
                return 1;
            if (a.y > b.y)
                return -1;
            return 0;
        }

        function sortAscending(a, b) {
            return b - a;
        }

        function getWordLengths() {

            wordArr.forEach(function(element, index) {
                //get the length of each word, count how much each number occurs = how much of each length there is
                wordLengths.push(element.length);
                wordLengths.sort(sortAscending);
            });

            wordLengths.forEach(function(element, index) {
                if (wordLengthCount[wordLengths[index]]) {
                    wordLengthCount[wordLengths[index]]++;

                } else {
                    wordLengthCount[wordLengths[index]] = 1;
                }
            });

            let lengthFreq = Object.values(wordLengthCount);
            let differentLengths = Object.keys(wordLengthCount); //arr

            lengthFreq.forEach(function(element, index) {
                wordCountData.push({
                    y: lengthFreq[index],
                    indexLabel: differentLengths[index] + " letter"
                });
            });

        }

        function getFrequentWords() {

            let uniqueWords = wordArr.filter((element, index, arr) => index == arr.indexOf(element));
            uniqueWords.forEach((element) => wordCount.push(0));

            wordArr.forEach(function(element, index) {
                if (uniqueWords.indexOf(element) !== -1) {
                    let i = uniqueWords.indexOf(element);
                    wordCount[i] = wordCount[i] + 1
                };
            });

            uniqueWords.forEach((element, index) => wordFreq.push({
                label: element,
                y: wordCount[index]
            }));

            wordFreq = wordFreq.sort(compare).reverse();

            const rawTable = document.getElementById("rawData");

            rawTable.innerHTML = "";

            let firstRowRaw = rawTable.insertRow(0);
            let columnTitleOneRaw = firstRowRaw.insertCell(0);
            let columnTitleTwoRaw = firstRowRaw.insertCell(1);
            let columnTitleThreeRaw = firstRowRaw.insertCell(2);

            columnTitleOneRaw.innerHTML = "WORD";
            columnTitleTwoRaw.innerHTML = "OCCURENCES";
            columnTitleThreeRaw.innerHTML = "PERCENTAGE";

            const uniqueTable = document.getElementById("uniqueWords");

            uniqueTable.innerHTML = "";

            let firstRowUnique = uniqueTable.insertRow(0);
            let columnTitleUnique = firstRowUnique.insertCell(0);

            columnTitleUnique.innerHTML = "UNIQUE WORDS";

            uniqueWords.forEach(function(element, index) {

                let row = rawTable.insertRow(1)

                let cellOneRaw = row.insertCell(0)
                let cellTwoRaw = row.insertCell(1)
                let cellThreeRaw = row.insertCell(2)

                cellOneRaw.innerHTML = wordFreq[index].label;
                cellTwoRaw.innerHTML = wordFreq[index].y;
                cellThreeRaw.innerHTML = (wordFreq[index].y / (wordArr.length) * 100).toFixed(2);

                if (wordFreq[index].y === 1) {
                    uniqueTable.insertRow(1).insertCell(0).innerHTML = wordFreq[index].label;
                }

            });
        }

        function generateChart(id, data, title, chartType, tooltip) {

            CanvasJS.addColorSet("blueGreenShades", [ //colorSet Array
                "#EC6F78",
                "#FCAEB3",
                "#A8DADC",
                "#457B9D",
                "#1D3557"
            ]);

            let chart = new CanvasJS.Chart(id, {
                backgroundColor: "#FFD79F",
                colorSet: "blueGreenShades",
                theme: "theme5",
                animationEnabled: "true",
                animationDuration: "2000",
                title: {
                    text: title, //change
                    fontFamily: "Helvetica",
                    fontColor: "#313131",
                    fontSize: 32,
                    fontWeight: "bold",
                    margin: 20,
                },
                axisX: {
                    interval: 1,
                    labelFontFamily: "Helvetica",
                    margin: 15,
                    lineThickness: 1,
                    // labelAngle: -20,
                },

                data: [{
                    type: chartType,
                    dataPoints: data,
                    toolTipContent: tooltip,
                }]
            });
            chart.render();
        }

        function displayData() {

            const lastTwenty = wordFreq.slice(0, 19);
            const topTwenty = wordFreq.slice(wordFreq.length - 19, wordFreq.length);

            document.getElementById('wordCount').innerHTML = "Word Count: " + wordArr.length + " ";
            document.getElementById('characterCountWithSpaces').innerHTML = "Character Count (including spaces): " + words.length;
            document.getElementById('characterCountNoSpaces').innerHTML = "Character Count (no spaces): " + wordStr.length;
            document.getElementById('averageLength').innerHTML = "Average Word Length: ~" + (wordStr.length / wordArr.length).toFixed(2);

            document.getElementById('lexicalDensity').innerHTML = "Lexical Density: " + ((wordArr.filter(filterCommonWords).length / wordArr.length) * 100).toFixed(2) + "%"

            generateChart("wordLengths", wordCountData, "WORD LENGTH FREQUENCY", "pie", "{y} - #percent %");
            generateChart("commonWords", topTwenty, "MOST USED WORDS", "bar");

        }

        getWordLengths();
        getFrequentWords();
        displayData();

    } //analyze


    document.getElementById("analyze").onclick = function() {
        document.getElementById('input').style.height = "50px";
        scrollDown();
        analyze();
    }

    document.getElementById("input").onclick = function() {
        document.getElementById('input').style.height = "250px"
    }

    function transitionTextArea() {
        document.getElementById("input").style.background = "#FCAEB3";

        setTimeout(function() {
            document.getElementById("input").style.background = "#ECECEC";
        }, 400)
    }

    document.getElementById("preset1").onclick = function() {
        document.getElementById("input").value = bohemianRhapsody;
        transitionTextArea();
    }

    document.getElementById("preset2").onclick = function() {
        document.getElementById("input").value = fluorescentAdolescent;
        transitionTextArea();
    }

    document.getElementById("preset3").onclick = function() {
        document.getElementById("input").value = iHaveADream;
        transitionTextArea();
    }


    let bohemianRhapsody = "Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality Open your eyes, look up to the skies and see I'm just a poor boy, I need no sympathy Because I'm easy come, easy go, little high, little low Any way the wind blows doesn't really matter to me, to me Mama, just killed a man Put a gun against his head Pulled my trigger, now he's dead Mama, life had just begun But now I've gone and thrown it all away Mama, ooh, didn't mean to make you cry If I'm not back again this time tomorrow Carry on, carry on as if nothing really matters Too late, my time has come Sends shivers down my spine, body's aching all the time Goodbye, everybody, I've got to go Gotta leave you all behind and face the truth Mama, ooh, I don't want to die I sometimes wish I'd never been born at all I see a little silhouetto of a man Scaramouche, Scaramouche, will you do the Fandango Thunderbolt and lightning, very, very fright'ning me (Galileo) Galileo, (Galileo) Galileo, Galileo figaro magnifico (I'm just a poor boy, nobody loves me) He's just a poor boy from a poor family Spare him his life from this monstrosity Easy come, easy go, will you let me go? Bismillah! No, we will not let you go (Let him go) Bismillah! We will not let you go (Let him go) Bismillah! We will not let you go (Let me go) Will not let you go (Let me go) Will not let you go (Let me go) Ah, no, no, no, no, no, no, no (Oh mamma mia, mamma mia) Mama mia, let me go Beelzebub has a devil put aside for me, for me, for me So you think you can stone me and spit in my eye? So you think you can love me and leave me to die? Oh, baby, can't do this to me, baby! Just gotta get out, just gotta get right outta here! Nothing really matters, anyone can see Nothing really matters Nothing really matters to me Any way the wind blows";

    let fluorescentAdolescent = "I thought I saw you in The Battleship But it was only a look-a-like She was nothing but a vision trick Under the warning light She was close, close enough to be your ghost But my chances turned to toast When I asked her if I could call her your name I thought I saw you in the Rusty Hook Huddled up in a wicker chair I wandered over for a closer look And kissed whoever was sitting there She was close, and she held me very tightly 'Til I asked awfully politely Please, can I call you her name? And I elongated my lift home Yeah, I let him go the long way round I smelt your scent on the seatbelt And kept my shortcuts to myself I thought I saw you in The Parrot's Beak Messing with the smoke alarm It was too loud for me to hear her speak And she had a broken arm It was close, so close that the walls were wet And she wrote it out in letraset No, you can't call me her name Tell me, where's your hiding place? I'm worried I'll forget your face And I've asked everyone I'm beginning to think I imagined you all along I elongated my lift home Yeah, I let him go the long way round I smelt your scent on the seatbelt And kept my shortcuts to myself I saw your sister in the Cornerstone On the phone to the middle man When I saw that she was on her own I thought she might understand She was close, well you couldn't get much closer She said I'm really not supposed to but yes You can call me anything you want";

    let iHaveADream = "I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation. Five score years ago, a great American, in whose symbolic shadow we stand today, signed the Emancipation Proclamation. This momentous decree came as a great beacon light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity. But one hundred years later, the Negro still is not free. One hundred years later, the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination. One hundred years later, the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity. One hundred years later, the Negro is still languished in the corners of American society and finds himself an exile in his own land. And so we've come here today to dramatize a shameful condition. In a sense we've come to our nation's capital to cash a check. When the architects of our republic wrote the magnificent words of the Constitution and the Declaration of Independence, they were signing a promissory note to which every American was to fall heir. This note was a promise that all men, yes, black men as well as white men, would be guaranteed the unalienable Rights of Life, Liberty and the pursuit of Happiness. It is obvious today that America has defaulted on this promissory note, insofar as her citizens of color are concerned. Instead of honoring this sacred obligation, America has given the Negro people a bad check, a check which has come back marked insufficient funds. But we refuse to believe that the bank of justice is bankrupt. We refuse to believe that there are insufficient funds in the great vaults of opportunity of this nation. And so, we've come to cash this check, a check that will give us upon demand the riches of freedom and the security of justice. We have also come to this hallowed spot to remind America of the fierce urgency of Now. This is no time to engage in the luxury of cooling off or to take the tranquilizing drug of gradualism. Now is the time to make real the promises of democracy. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to lift our nation from the quicksands of racial injustice to the solid rock of brotherhood. Now is the time to make justice a reality for all of God's children. It would be fatal for the nation to overlook the urgency of the moment. This sweltering summer of the Negro's legitimate discontent will not pass until there is an invigorating autumn of freedom and equality. Nineteen sixty-three is not an end, but a beginning. And those who hope that the Negro needed to blow off steam and will now be content will have a rude awakening if the nation returns to business as usual. And there will be neither rest nor tranquility in America until the Negro is granted his citizenship rights. The whirlwinds of revolt will continue to shake the foundations of our nation until the bright day of justice emerges. But there is something that I must say to my people, who stand on the warm threshold which leads into the palace of justice: In the process of gaining our rightful place, we must not be guilty of wrongful deeds. Let us not seek to satisfy our thirst for freedom by drinking from the cup of bitterness and hatred. We must forever conduct our struggle on the high plane of dignity and discipline. We must not allow our creative protest to degenerate into physical violence. Again and again, we must rise to the majestic heights of meeting physical force with soul force. The marvelous new militancy which has engulfed the Negro community must not lead us to a distrust of all white people, for many of our white brothers, as evidenced by their presence here today, have come to realize that their destiny is tied up with our destiny. And they have come to realize that their freedom is inextricably bound to our freedom. We cannot walk alone. And as we walk, we must make the pledge that we shall always march ahead. We cannot turn back. There are those who are asking the devotees of civil rights, When will you be satisfied? We can never be satisfied as long as the Negro is the victim of the unspeakable horrors of police brutality. We can never be satisfied as long as our bodies, heavy with the fatigue of travel, cannot gain lodging in the motels of the highways and the hotels of the cities. *We cannot be satisfied as long as the negro's basic mobility is from a smaller ghetto to a larger one. We can never be satisfied as long as our children are stripped of their self-hood and robbed of their dignity by signs stating: For Whites Only.* We cannot be satisfied as long as a Negro in Mississippi cannot vote and a Negro in New York believes he has nothing for which to vote. No, no, we are not satisfied, and we will not be satisfied until justice rolls down like waters, and righteousness like a mighty stream.¹ I am not unmindful that some of you have come here out of great trials and tribulations. Some of you have come fresh from narrow jail cells. And some of you have come from areas where your quest -- quest for freedom left you battered by the storms of persecution and staggered by the winds of police brutality. You have been the veterans of creative suffering. Continue to work with the faith that unearned suffering is redemptive. Go back to Mississippi, go back to Alabama, go back to South Carolina, go back to Georgia, go back to Louisiana, go back to the slums and ghettos of our northern cities, knowing that somehow this situation can and will be changed. Let us not wallow in the valley of despair, I say to you today, my friends. And so even though we face the difficulties of today and tomorrow, I still have a dream. It is a dream deeply rooted in the American dream. I have a dream that one day this nation will rise up and live out the true meaning of its creed: We hold these truths to be self-evident, that all men are created equal. I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood. I have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice. I have a dream that my four little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character. I have a dream today! I have a dream that one day, down in Alabama, with its vicious racists, with its governor having his lips dripping with the words of interposition and nullification -- one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers. I have a dream today! I have a dream that one day every valley shall be exalted, and every hill and mountain shall be made low, the rough places will be made plain, and the crooked places will be made straight;and the glory of the Lord shall be revealed and all flesh shall see it together.2 This is our hope, and this is the faith that I go back to the South with. With this faith, we will be able to hew out of the mountain of despair a stone of hope. With this faith, we will be able to transform the jangling discords of our nation into a beautiful symphony of brotherhood. With this faith, we will be able to work together, to pray together, to struggle together, to go to jail together, to stand up for freedom together, knowing that we will be free one day. And this will be the day -- this will be the day when all of God's children will be able to sing with new meaning: My country 'tis of thee, sweet land of liberty, of thee I sing. Land where my fathers died, land of the Pilgrim's pride, From every mountainside, let freedom ring! And if America is to be a great nation, this must become true. And so let freedom ring from the prodigious hilltops of New Hampshire. Let freedom ring from the mighty mountains of New York. Let freedom ring from the heightening Alleghenies of Pennsylvania. Let freedom ring from the snow-capped Rockies of Colorado. Let freedom ring from the curvaceous slopes of California. But not only that: Let freedom ring from Stone Mountain of Georgia. Let freedom ring from Lookout Mountain of Tennessee. Let freedom ring from every hill and molehill of Mississippi. From every mountainside, let freedom ring. And when this happens, and when we allow freedom ring, when we let it ring from every village and every hamlet, from every state and every city, we will be able to speed up that day when all of God's children, black men and white men, Jews and Gentiles, Protestants and Catholics, will be able to join hands and sing in the words of the old Negro spiritual: Free at last! Free at last! Thank God Almighty, we are free at last!";


}

import processor from '@pdchen/markdown-processor';

const text = `|t1|t2|t3|
        |---|---|---|
        |a|b|c|
        
        - 1
        - 2
        - 3
        - 4
        
        1. For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.
        2. 2
        3. 3
        4. 4
        
        ![image](https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=465&dpr=1&s=none)`

const tree = processor.parse(text);


console.log(tree)

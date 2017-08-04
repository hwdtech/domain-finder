# domain-finder
## Basic set up (via cloning this repository)
1. Install docker and docker-compose according to your OS;
2. Clone this project to your machine.
3. Enter the directory you just cloned and run `npm i`.
4. Now you need to start *postgreSQL* and *RabbitMQ* containers:
    1. Run in your terminal `docker-compose -f script/local.yml up -d`. If it succeeds you'll see **done** in terminal.
    2. Run in your terminal `node script/domainFinder.js`. Wait till it finishes.
    3. Run in your terminal `node script/domainFinderReceiver.js`. You'll see it work.
5. Results:
    1.  Open another terminal;
    2.  Run in terminal: `docker ps`. You are interested in **container_id** with name **nodeapps_db_1**, copy this value;
    3.  Run in terminal: `docker exec - it [container_id] bash`. Now you must be inside of postgres container;
    4.  Run `psql -U postgres`. Now you must be in postgres;
    5.  Work with table *FreeDomains* the way you want using postgreSQL syntax.
  
## Basic set up (via docker-compose.yml) 
1. Install docker and docker-compose according to your OS;
2. Download file docker-compose.yml from [here](https://github.com/danieljust/domain-finder/blob/master/readme/docker-compose.yml);
3. Enter directory with this file;
4. Run in terminal: 
    `docker-compose up -d`;
If this step succeeds you'll see **done** in terminal;
5. Run in terminal:
    `docker ps`;
You are interested in **container_id** with image danieljust/domain-finder-v1, copy it's **container_id**;
6. Run in terminal:
    `docker exec -it container_id bash`.
  
Now you must be inside of container with path */opt/domainFinder*.
### Looking for domains with ru tld
If you want to look for free ru domains:
1. You need to have mashape key for this [api](http://www.domaininformation.de);
2. If you have it use: 
`nano services/domainInformation_DE/fetchers.js`. Enter your API key where it is needed;
3. Running scripts
  1. You need to run sender first:
`node ruZone/russianSender.js`.
        Wait till it finished;
  2. Run receiver:
            `node ruZone/russianReceiver.js`.
        You'll see output in terminal;
    3. Results:
        1.  Open another terminal;
        2.  Run in terminal `docker ps`.
            You are interested in **container_id** with name **nodeapps_db_1**, copy this value;
        3.  Run in terminal:
            `docker exec - it [container_id] bash`.
        Now you must be inside of postgres container;
        4. Type `psql -U postgres`.
        Now you must be in postgres;
        5. Work with table *RussianDomains* the way you want using postgreSQL syntax;
### Looking for domains with other tld
If you want to look for other free domains with other tlds:
1. Type in terminal:
            `node script/domainFinder.js`.
        Wait till it finished;
2. Type in terminal 
            `node script/domainFinderReceiver.js`.
        You'll see output in terminal;
3. Results:
    1.  Open another terminal;
    2.  Run in terminal: `docker ps`. You are interested in **container_id** with name **nodeapps_db_1**, copy this value;
    3.  Run in terminal: `docker exec - it [container_id] bash`. Now you must be inside of postgres container;
    4.  Run `psql -U postgres`. Now you must be in postgres;
    5.  Work with table *FreeDomains* the way you want using postgreSQL syntax.

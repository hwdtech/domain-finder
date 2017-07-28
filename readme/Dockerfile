# start from base
FROM ubuntu:16.04
MAINTAINER Daniel Safonov <dsafonov@hwdtech.com>

RUN apt-get -yqq update
RUN apt-get -yqq install curl sudo bash git
RUN curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
# RUN git clone https://github.com/danieljust/domainFinder.git

# copy our application code
ADD domainFinder /opt/domainFinder
WORKDIR /opt/domainFinder

RUN npm i
# expose port
EXPOSE 3000

# start app

/home/osboxes/Documents/nodeApps/domainFinder/domainFinder/readme/Dockerfile

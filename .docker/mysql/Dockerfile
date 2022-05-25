FROM mysql:5.7

# change timezone on debian
RUN rm -f /etc/localtime && ln -s /usr/share/zoneinfo/Europe/Rome /etc/localtime

COPY .docker/mysql/conf /etc/mysql/conf.d
COPY .docker/mysql/fixtures /fixtures
COPY .docker/mysql/load-fixtures.sh /load-fixtures.sh

RUN /load-fixtures.sh common /fixtures
RUN /load-fixtures.sh dev /fixtures

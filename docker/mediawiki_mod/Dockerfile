# syntax=docker/dockerfile:1

#
# This adds customizations on top of the mediawiki image
#

FROM mediawiki:stable

# Install php composer: https://getcomposer.org/download/
# RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
# RUN php -r "if (hash_file('sha384', 'composer-setup.php') === '55ce33d7678c5a611085589f1f3ddf8b3c52d662cd01d4ba75c0ee0459970c2200a51f492d557530c71c15d8dba01eae') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); exit('Failed to install composer. Exiting.'); } echo PHP_EOL;"
# RUN php composer-setup.php
# RUN php -r "unlink('composer-setup.php');"
# RUN mv composer.phar /usr/local/bin/composer
# https://getcomposer.org/doc/00-intro.md#globally
COPY --from=composer/composer:latest-bin /composer /usr/bin/composer

# Install chameleon skin: https://github.com/ProfessionalWiki/chameleon/blob/master/docs/installation.md
RUN COMPOSER_ALLOW_SUPERUSER=1 composer config --no-plugins allow-plugins.wikimedia/composer-merge-plugin true
RUN COMPOSER_ALLOW_SUPERUSER=1 composer require --no-update mediawiki/chameleon-skin:~4.0
RUN COMPOSER_ALLOW_SUPERUSER=1 composer update
RUN COMPOSER_ALLOW_SUPERUSER=1 composer update mediawiki/chameleon-skin --no-dev -o


# Taken from mediawiki Dockerfile
# https://github.com/wikimedia/mediawiki-docker/blob/aa07f326d2719366125551213a2a9be8801aa773/1.39/apache/Dockerfile
CMD ["apache2-foreground"]

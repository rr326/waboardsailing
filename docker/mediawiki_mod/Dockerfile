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

# Widgets: https://www.mediawiki.org/wiki/Extension:Widgets
# TODO - Delete??
RUN git clone https://gerrit.wikimedia.org/r/mediawiki/extensions/Widgets.git /var/www/html/extensions/Widgets
RUN chown -R www-data:www-data /var/www/html/extensions/Widgets
RUN COMPOSER_ALLOW_SUPERUSER=1 composer update --no-dev

# iFramePage
# Odd - piping from curl to tar isn't working
RUN curl https://extdist.wmflabs.org/dist/extensions/IframePage-REL1_39-f333755.tar.gz > /var/www/html/extensions/tmp.txt
RUN cat /var/www/html/extensions/tmp.txt | tar -xzf -C /var/www/html/extensions
RUN rm /var/www/html/extensions/tmp.txt


# Taken from mediawiki Dockerfile
# https://github.com/wikimedia/mediawiki-docker/blob/aa07f326d2719366125551213a2a9be8801aa773/1.39/apache/Dockerfile
CMD ["apache2-foreground"]

install:
	@cp docker-compose.override.yml.dist docker-compose.override.yml
	@cp .env.dist .env
	@docker-compose build
	@docker-compose run --rm node yarn install

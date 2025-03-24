# Development environment
.PHONY: development development-build development-up development-up-d development-down development-logs development-shell \
	development-lint development-test development-format development-env development-env-setup

development-build:
	docker compose -f docker/development/compose.yaml --env-file .env.development build --no-cache

development-up:
	docker compose -f docker/development/compose.yaml --env-file .env.development up

development-up-d:
	docker compose -f docker/development/compose.yaml --env-file .env.development up -d

development-down:
	docker compose -f docker/development/compose.yaml --env-file .env.development down

development-logs:
	docker compose -f docker/development/compose.yaml --env-file .env.development logs -f

development-shell:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development sh

development-lint:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run lint

development-test:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run test

development-format:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run format

development-env:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development env

development-env-setup:
	@if [ ! -f .env.development ]; then \
		cp .env.development.sample .env.development; \
		echo "Created .env.development file. Please update the values."; \
	fi

development: development-env-setup development-up

# Production environment
.PHONY: production production-build production-up production-down production-logs production-prune production-deploy production-health production-env-setup

production-build:
	docker compose -f docker/production/compose.yaml --env-file .env.production build --no-cache

production-env-setup:
	@if [ ! -f .env.production ]; then \
		cp .env.production.sample .env.production; \
		echo "Created .env.production file. Please update the values."; \
	fi

production-up: production-env-setup
	docker compose -f docker/production/compose.yaml --env-file .env.production up -d

production-down:
	docker compose -f docker/production/compose.yaml --env-file .env.production down

production-logs:
	docker compose -f docker/production/compose.yaml --env-file .env.production logs -f

production-prune:
	docker system prune -f

production-deploy: production-env-setup production-build production-up

production-health:
	@curl -s http://localhost:3000/api/health || echo "Service is not responding"

# Testing and code quality
.PHONY: test test-coverage test-e2e lint format type-check

test:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run test

test-coverage:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run test:coverage

test-e2e:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run test:e2e

lint:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run lint

format:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run format

type-check:
	docker compose -f docker/development/compose.yaml --env-file .env.development exec personal-development npm run type-check

# Cleanup
.PHONY: clean
clean:
	docker system prune -f
	docker volume prune -f

# Help
.PHONY: help
help:
	@echo "Available commands:"
	@echo ""
	@echo "Development:"
	@echo "  development         - Set up development environment and start"
	@echo "  development-build   - Build development environment"
	@echo "  development-up      - Start development environment"
	@echo "  development-down    - Stop development environment"
	@echo "  development-logs    - View development logs"
	@echo "  development-shell   - Open shell in container"
	@echo ""
	@echo "Production:"
	@echo "  production-deploy   - Deploy to production"
	@echo "  production-logs     - View production logs"
	@echo "  production-health   - Check production health"
	@echo ""
	@echo "Testing:"
	@echo "  test               - Run tests"
	@echo "  test-coverage      - Run tests with coverage"
	@echo "  test-e2e          - Run end-to-end tests"
	@echo ""
	@echo "Code quality:"
	@echo "  lint              - Run linter"
	@echo "  format           - Format code"
	@echo "  type-check       - Run TypeScript type checking"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean            - Remove unused Docker resources"

.DEFAULT_GOAL := help
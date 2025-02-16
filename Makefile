# Development environment
development-build:
	docker compose -f docker/development/compose.yaml build --no-cache

development-up:
	docker compose -f docker/development/compose.yaml up

development-up-d:
	docker compose -f docker/development/compose.yaml up -d

# Add a new target to create development env file if it doesn't exist
development-env-setup:
	@if [ ! -f .env.development ]; then \
		cp .env.development.sample .env.development; \
		echo "Created .env.development file. Please update the values."; \
	fi

# Update the development-up target to depend on env setup
development: development-env-setup development-up

development-down:
	docker compose -f docker/development/compose.yaml down

development-logs:
	docker compose -f docker/development/compose.yaml logs -f

development-shell:
	docker compose -f docker/development/compose.yaml exec personal-development sh

development-lint:
	docker compose -f docker/development/compose.yaml exec personal-development npm run lint

development-test:
	docker compose -f docker/development/compose.yaml exec personal-development npm run test

development-format:
	docker compose -f docker/development/compose.yaml exec personal-development npm run format

development-env:
	docker compose -f docker/development/compose.yaml exec personal-development env

# Staging environment
staging-build:
	docker compose -f docker/staging/compose.yaml build

staging-up:
	docker compose -f docker/staging/compose.yaml up

staging-up-d:
	docker compose -f docker/staging/compose.yaml up -d

staging-down:
	docker compose -f docker/staging/compose.yaml down

staging-logs:
	docker compose -f docker/staging/compose.yaml logs -f

staging-lint:
	docker compose -f docker/staging/compose.yaml exec web npm run lint

# Production environment
production-build:
	docker compose -f docker/production/compose.yaml build --no-cache

production-env-setup:
	@if [ ! -f .env.production ]; then \
		cp .env.production.sample .env.production; \
		echo "Created .env.production file. Please update the values."; \
	fi

production-up: production-env-setup
	docker compose -f docker/production/compose.yaml up -d

production-down:
	docker compose -f docker/production/compose.yaml down

production-logs:
	docker compose -f docker/production/compose.yaml logs -f

production-prune:
	docker system prune -f

# Combined commands
production-deploy: production-env-setup production-build production-up

# Health check
production-health:
	@curl -s http://localhost:3000/api/health || echo "Service is not responding"

# Testing
test:
	docker compose -f docker/development/compose.yaml exec web npm run test

test-coverage:
	docker compose -f docker/development/compose.yaml exec web npm run test:coverage

test-e2e:
	docker compose -f docker/development/compose.yaml exec web npm run test:e2e

# Code quality
lint:
	docker compose -f docker/development/compose.yaml exec web npm run lint

format:
	docker compose -f docker/development/compose.yaml exec web npm run format

type-check:
	docker compose -f docker/development/compose.yaml exec web npm run type-check

# Cleanup
clean:
	docker system prune -f
	docker volume prune -f

# Help
help:
	@echo "Available commands:"
	@echo "Development:"
	@echo "  development-build    - Build development environment"
	@echo "  development-up      - Start development environment"
	@echo "  development-up-d    - Start development environment in detached mode"
	@echo "  development-down    - Stop development environment"
	@echo "  development-logs    - View development logs"
	@echo "  development-shell   - Open shell in web container"
	@echo "  development-lint    - Run linter in development"
	@echo "  development-test    - Run tests in development"
	@echo "  development-format  - Format code in development"
	@echo "  development-env     - View development environment variables"
	@echo ""
	@echo "Staging:"
	@echo "  staging-build      - Build staging environment"
	@echo "  staging-up        - Start staging environment"
	@echo "  staging-up-d      - Start staging environment in detached mode"
	@echo "  staging-down      - Stop staging environment"
	@echo "  staging-logs      - View staging logs"
	@echo "  staging-lint      - Run linter in staging"
	@echo ""
	@echo "Production:"
	@echo "  production-build  - Build production environment"
	@echo "  production-up    - Start production environment"
	@echo "  production-down  - Stop production environment"
	@echo "  production-logs  - View production logs"
	@echo ""
	@echo "Testing:"
	@echo "  test            - Run tests"
	@echo "  test-coverage   - Run tests with coverage"
	@echo "  test-e2e       - Run end-to-end tests"
	@echo ""
	@echo "Code quality:"
	@echo "  lint           - Run linter"
	@echo "  format         - Format code"
	@echo "  type-check    - Run TypeScript type checking"
	@echo ""
	@echo "Cleanup:"
	@echo "  clean          - Remove unused Docker resources"

.PHONY: development-build development-up development-up-d development-down development-logs development-shell \
	development-lint development-test development-format development-env \
	staging-build staging-up staging-up-d staging-down staging-logs staging-lint \
	production-build production-env-setup production-up production-down production-logs production-prune production-deploy production-health \
	test test-coverage test-e2e lint format type-check clean help

.DEFAULT_GOAL := help
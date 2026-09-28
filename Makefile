.PHONY: help install dev build start lint db-generate db-push db-seed db-studio docker-up docker-down docker-logs clean

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install: ## Install dependencies
	npm install

dev: ## Start development server
	npm run dev

build: ## Build for production
	npm run build

start: ## Start production server
	npm run start

lint: ## Run ESLint
	npm run lint

db-generate: ## Generate Prisma client
	npx prisma generate

db-push: ## Push schema to database
	npx prisma db push

db-seed: ## Seed database with sample data
	npx prisma db seed

db-studio: ## Open Prisma Studio
	npx prisma studio

docker-up: ## Start Docker containers
	docker-compose up -d

docker-down: ## Stop Docker containers
	docker-compose down

docker-logs: ## View Docker logs
	docker-compose logs -f app

clean: ## Clean build artifacts
	rm -rf .next node_modules

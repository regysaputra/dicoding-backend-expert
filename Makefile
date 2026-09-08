.PHONY: psql create-db create-db-test drop-db drop-db-test reset-db-migrate reset-db-migrate-test ssh-ec2

psql:
	psql -U developer -d postgres -h localhost

create-db:
	createdb -U developer -h localhost -O developer forumapi

create-db-test:
	createdb -U developer -h localhost -O developer forumapitest

drop-db:
	dropdb -U developer -h localhost forumapi

drop-db-test:
	dropdb -U developer -h localhost forumapitest

reset-db-migrate: drop-db create-db
	npm run migrate up

reset-db-migrate-test: drop-db-test create-db-test
	npm run migrate:test up

psql-rds:
	psql "postgresql://postgres:1717171717qQ@forumapitest.c9842y0a6scj.ap-southeast-3.rds.amazonaws.com:5432/forumapitest"

ssh-ec2:
	ssh -i "forum-api.pem" ubuntu@108.136.74.167
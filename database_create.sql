CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255),
    "cohort_id" INTEGER NOT NULL
);

CREATE TABLE "cohorts"(
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255),
    "number" INTEGER NOT NULL
);

CREATE TABLE "events"(
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "start_time" TIMESTAMP,
    "end_time" TIMESTAMP
);

CREATE TABLE "users_events"(
    "user_id" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,
    "room_id" INTEGER NOT NULL,
    PRIMARY KEY ("event_id", "user_id")
);

CREATE TABLE "rooms"(
    "id" SERIAL PRIMARY KEY,
    "zoom_url" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255)
);

ALTER TABLE
    "users" ADD CONSTRAINT "users_cohort_id_foreign" FOREIGN KEY("cohort_id") REFERENCES "cohorts"("id");

ALTER TABLE
    "users_events" ADD CONSTRAINT "users_events_room_id_foreign" FOREIGN KEY("room_id") REFERENCES "rooms"("id");

ALTER TABLE "users_events" ADD FOREIGN KEY ("event_id") REFERENCES "events" ("id");

ALTER TABLE "users_events" ADD FOREIGN KEY ("room_id") REFERENCES "rooms" ("id");

ALTER TABLE "users_events" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
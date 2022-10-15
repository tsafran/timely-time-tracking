create table if not exists work_session (
    id int generated always as identity,
    name varchar(255) unique not null,
    start_time datetime not null,
    end_time datetime not null
);
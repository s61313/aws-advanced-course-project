
DROP DATABASE IF EXISTS ticketsystem;
CREATE DATABASE IF NOT EXISTS ticketsystem;
USE ticketsystem;

SELECT 'CREATING DATABASE STRUCTURE' as 'INFO';

DROP TABLE IF EXISTS ticket, agenda;

/*!50503 set default_storage_engine = InnoDB */;
/*!50503 select CONCAT('storage engine: ', @@default_storage_engine) as INFO */;

CREATE TABLE ticket (
    ticket_id      INT             NOT NULL AUTO_INCREMENT,
    ticket_type  VARCHAR(256)            NOT NULL
    PRIMARY KEY (ticket_id)
);

CREATE TABLE agenda (
    agenda_id      INT             NOT NULL AUTO_INCREMENT,
    agenda_type  VARCHAR(256)            NOT NULL,
    agenda_startendtime  VARCHAR(256)            NOT NULL,
    agenda_topic  VARCHAR(256)            NOT NULL,
    agenda_speaker  VARCHAR(256)            NOT NULL,
    PRIMARY KEY (agenda_id)
);

SELECT 'LOADING agenda' as 'INFO';
source agenda.dump ;
SELECT * FROM agenda;

flush /*!50503 binary */ logs;

-- source show_elapsed.sql ;
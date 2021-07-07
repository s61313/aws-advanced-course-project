SET @@auto_increment_increment=1;
CREATE TABLE user (
    userid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username varchar(255) UNIQUE,
    password varchar(1000),
    isonline varchar(20) DEFAULT "0",
    status varchar(255) DEFAULT NULL
);

CREATE TABLE msg (
    msgid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content varchar(255),
    sendername varchar(255) NOT NULL,
    senderstatus varchar(255),
    senderisonline varchar(255),
    receivername varchar(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE privatemsg (
    msgid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    content varchar(255),
    senderName varchar(255) NOT NULL,
    senderStatus varchar(255),
    receiverName varchar(255) NOT NULL,
    receiverStatus varchar(255),
    isRead varchar(255) DEFAULT "unread",
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE status (
    idstatus int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    username varchar(255),
    status varchar(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity (
    activityid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    organizer varchar(255),
    activityName varchar(255),
    activityTime varchar(255),
    activityAddr varchar(255),
    activityStatus varchar(255) DEFAULT "WAITING",
    numOfPeopleNeeded int,
    numOfPeopleRegistered int DEFAULT 0,
    numOfHour int,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activityuser (
    activityuserid int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    activityid varchar(255),
    username varchar(255),
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
}

CREATE TABLE firereport (
    fireReportId int AUTO_INCREMENT NOT NULL PRIMARY KEY,
    reporterUsername varchar(255) NOT NULL,
    fireReportLocation varchar(255),
    fireReportStatus varchar(255),
    adminCheck varchar(255),
    citizenCheck varchar(255),
    fireReportTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
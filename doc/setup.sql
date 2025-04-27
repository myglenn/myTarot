-- 타로 카드 정보
CREATE TABLE TAROT_CARDS (
  ID INT UNSIGNED PRIMARY KEY,
  NAME_KR VARCHAR(20) NOT NULL,
  NAME_EN VARCHAR(40) NOT NULL,
  IMG VARCHAR(50) NOT NULL
);

-- 타로 카드 상세 정보 (정방향, 역방향, 각 의미)
CREATE TABLE CARD_MEANINGS (
  ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  CARD_ID INT UNSIGNED NOT NULL,
  IS_REVERSED BOOLEAN NOT NULL,
  MEANING TEXT NOT NULL,
  FOREIGN KEY (CARD_ID) REFERENCES TAROT_CARDS(ID)
);

CREATE INDEX idx_NAME_EN ON TAROT_CARDS(NAME_EN);

-- 타로 테이터베이스 캐릭터셋 변경
ALTER DATABASE TAROT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci;

-- 타로 카드 기본 정보
INSERT into `TAROT_CARDS` (`ID`,`NAME_KR`,`NAME_EN`,`IMG`) VALUES
(1,'광대','The Fool','The_Fool.png'),
(2,'마법사','The Magician','The_Magician.png'),
(3,'여사제','The High Priestess','The_High_Priestess.png'),
(4,'여황제','The Empress','The_Empress.png'),
(5,'황제','The Emperor','The_Emperor.png'),
(6,'교황','The Hierophant','The_Hierophant.png'),
(7,'연인','The Lovers','The_Lovers.png'),
(8,'전차','The Chariot','The_Chariot.png'),
(9,'힘','Strength','Strength.png'),
(10,'은둔자','The Hermit','The_Hermit.png'),
(11,'운명의 수레바퀴','Wheel of Fortune','Wheel_of_Fortune.png'),
(12,'정의','Justice','Justice.png'),
(13,'매달린 사람','The Hanged Man','The_Hanged_Man.png'),
(14,'죽음','Death','Death.png'),
(15,'절제','Temperance','Temperance.png'),
(16,'악마','The Devil','The_Devil.png'),
(17,'탑','The Tower','The_Tower.png'),
(18,'별','The Star','The_Star.png'),
(19,'달','The Moon','The_Moon.png'),
(20,'태양','The Sun','The_Sun.png'),
(21,'심판','Judgement','Judgement.png'),
(22,'세계','The World','The_World.png'),
(23,'완드 에이스','Ace of Wands','Ace_of_Wands.png'),
(24,'완드 2','Two of Wands','Two_of_Wands.png'),
(25,'완드 3','Three of Wands','Three_of_Wands.png'),
(26,'완드 4','Four of Wands','Four_of_Wands.png'),
(27,'완드 5','Five of Wands','Five_of_Wands.png'),
(28,'완드 6','Six of Wands','Six_of_Wands.png'),
(29,'완드 7','Seven of Wands','Seven_of_Wands.png'),
(30,'완드 8','Eight of Wands','Eight_of_Wands.png'),
(31,'완드 9','Nine of Wands','Nine_of_Wands.png'),
(32,'완드 10','Ten of Wands','Ten_of_Wands.png'),
(33,'완드 페이지','Page of Wands','Page_of_Wands.png'),
(34,'완드 기사','Knight of Wands','Knight_of_Wands.png'),
(35,'완드 여왕','Queen of Wands','Queen_of_Wands.png'),
(36,'완드 왕','King of Wands','King_of_Wands.png'),
(37,'컵 에이스','Ace of Cups','Ace_of_Cups.png'),
(38,'컵 2','Two of Cups','Two_of_Cups.png'),
(39,'컵 3','Three of Cups','Three_of_Cups.png'),
(40,'컵 4','Four of Cups','Four_of_Cups.png'),
(41,'컵 5','Five of Cups','Five_of_Cups.png'),
(42,'컵 6','Six of Cups','Six_of_Cups.png'),
(43,'컵 7','Seven of Cups','Seven_of_Cups.png'),
(44,'컵 8','Eight of Cups','Eight_of_Cups.png'),
(45,'컵 9','Nine of Cups','Nine_of_Cups.png'),
(46,'컵 10','Ten of Cups','Ten_of_Cups.png'),
(47,'컵 페이지','Page of Cups','Page_of_Cups.png'),
(48,'컵 기사','Knight of Cups','Knight_of_Cups.png'),
(49,'컵 여왕','Queen of Cups','Queen_of_Cups.png'),
(50,'컵 왕','King of Cups','King_of_Cups.png'),
(51,'소드 에이스','Ace of Swords','Ace_of_Swords.png'),
(52,'소드 2','Two of Swords','Two_of_Swords.png'),
(53,'소드 3','Three of Swords','Three_of_Swords.png'),
(54,'소드 4','Four of Swords','Four_of_Swords.png'),
(55,'소드 5','Five of Swords','Five_of_Swords.png'),
(56,'소드 6','Six of Swords','Six_of_Swords.png'),
(57,'소드 7','Seven of Swords','Seven_of_Swords.png'),
(58,'소드 8','Eight of Swords','Eight_of_Swords.png'),
(59,'소드 9','Nine of Swords','Nine_of_Swords.png'),
(60,'소드 10','Ten of Swords','Ten_of_Swords.png'),
(61,'소드 페이지','Page of Swords','Page_of_Swords.png'),
(62,'소드 기사','Knight of Swords','Knight_of_Swords.png'),
(63,'소드 여왕','Queen of Swords','Queen_of_Swords.png'),
(64,'소드 왕','King of Swords','King_of_Swords.png'),
(65,'펜타클 에이스','Ace of Pentacles','Ace_of_Pentacles.png'),
(66,'펜타클 2','Two of Pentacles','Two_of_Pentacles.png'),
(67,'펜타클 3','Three of Pentacles','Three_of_Pentacles.png'),
(68,'펜타클 4','Four of Pentacles','Four_of_Pentacles.png'),
(69,'펜타클 5','Five of Pentacles','Five_of_Pentacles.png'),
(70,'펜타클 6','Six of Pentacles','Six_of_Pentacles.png'),
(71,'펜타클 7','Seven of Pentacles','Seven_of_Pentacles.png'),
(72,'펜타클 8','Eight of Pentacles','Eight_of_Pentacles.png'),
(73,'펜타클 9','Nine of Pentacles','Nine_of_Pentacles.png'),
(74,'펜타클 10','Ten of Pentacles','Ten_of_Pentacles.png'),
(75,'펜타클 페이지','Page of Pentacles','Page_of_Pentacles.png'),
(76,'펜타클 기사','Knight of Pentacles','Knight_of_Pentacles.png'),
(77,'펜타클 여왕','Queen of Pentacles','Queen_of_Pentacles.png'),
(78,'펜타클 왕','King of Pentacles','King_of_Pentacles.png');


-- 시퀀스 테이블
CREATE TABLE MONTH_SEQ (
    K CHAR(6) PRIMARY KEY,
    V BIGINT NOT NULL
);

DROP PROCEDURE IF EXISTS MK_SEQ;



--  SEQ 생성 프로시저
DELIMITER $$


CREATE PROCEDURE MK_SEQ(
    IN YM CHAR(6),
    OUT YMV VARCHAR(20)
)
BEGIN
    DECLARE N_SQ BIGINT DEFAULT 1;

    IF EXISTS (SELECT 1 FROM MONTH_SEQ WHERE K = YM) THEN
        UPDATE MONTH_SEQ
        SET V = V + 1
        WHERE K = YM;

        SELECT V INTO N_SQ
        FROM MONTH_SEQ
        WHERE K = YM;
    ELSE
        INSERT INTO MONTH_SEQ (K, V) VALUES (YM, 1);
        SET N_SQ = 1;
    END IF;

    SET YMV = CONCAT(YM, LPAD(N_SQ, 11, '0'));
END$$

DELIMITER ;


drop table TOKEN_LOGS;
DROP TRIGGER BEFORE_INST_TOKEN_LOG_ID;

-- 토큰 로그 테이블
CREATE TABLE TOKEN_LOGS (
    C_ID VARCHAR(20) DEFAULT NULL,
    RQ_TOKEN INT DEFAULT 0,
    RS_TOKEN INT DEFAULT 0,
    CREATE_AT DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_token_created (CREATE_AT)
) ENGINE=InnoDB;


-- 로그 SEQ 트리거
DELIMITER $$

CREATE TRIGGER BEFORE_INST_TOKEN_LOG_ID
BEFORE INSERT ON TOKEN_LOGS
FOR EACH ROW
BEGIN
    DECLARE N_C_ID VARCHAR(20);
    DECLARE YM CHAR(6);

    SET YM = DATE_FORMAT(NOW(), '%Y%m');

    CALL MK_SEQ(YM, N_C_ID);

    SET NEW.C_ID = N_C_ID;
END$$

DELIMITER ;

SHOW TRIGGERS;
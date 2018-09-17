-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Creato il: Set 11, 2018 alle 03:18
-- Versione del server: 10.1.32-MariaDB
-- Versione PHP: 5.6.36

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `HEBDB`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `Admins`
--

CREATE TABLE `Admins` (
  `ID` int(200) NOT NULL,
  `Email` text NOT NULL,
  `Password` varchar(150) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Cognome` varchar(100) NOT NULL,
  `Level` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELAZIONI PER TABELLA `Admins`:
--

--
-- Dump dei dati per la tabella `Admins`
--

INSERT INTO `Admins` (`ID`, `Email`, `Password`, `Nome`, `Cognome`, `Level`) VALUES
(1, 'admin@admin.it', 'admin', 'federico', 'viola', 100),
(2, 'user@user.it', 'user', 'user', 'admin2', 100),
(4, 'sec@sec.it', 'secondo', 'Admin2', 'Secondo', 100),
(5, 'ter@ter.com', 'terzo', 'admin3', 'terzo', 100),
(6, 'fedev93@gmail.com', 'wwacez7nbg', 'admin4', 'quarto', 100);

-- --------------------------------------------------------

--
-- Struttura della tabella `Booking`
--

CREATE TABLE `Booking` (
  `ID` int(200) NOT NULL,
  `ID_Events` int(200) NOT NULL,
  `ID_Scheduling` int(200) NOT NULL,
  `Data` date NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Cognome` varchar(150) NOT NULL,
  `Email` text NOT NULL,
  `Telefono` int(11) NOT NULL,
  `NomeAcc` varchar(50) DEFAULT NULL,
  `CognomeAcc` varchar(100) DEFAULT NULL,
  `TelefonoAcc` int(11) DEFAULT NULL,
  `EmailAcc` text,
  `Num_Partecipanti` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELAZIONI PER TABELLA `Booking`:
--   `ID_Events`
--       `Events` -> `ID`
--   `ID_Scheduling`
--       `Scheduling` -> `ID`
--

--
-- Dump dei dati per la tabella `Booking`
--

INSERT INTO `Booking` (`ID`, `ID_Events`, `ID_Scheduling`, `Data`, `Nome`, `Cognome`, `Email`, `Telefono`, `NomeAcc`, `CognomeAcc`, `TelefonoAcc`, `EmailAcc`, `Num_Partecipanti`) VALUES
(1, 1, 1, '2018-09-28', 'fede', 'vio', 'fedev93@gmail.it', 13354792, '', '', 0, '', 2),
(2, 1, 1, '2018-09-28', 'marco', 'giallo', 'fe.viola1993@libero.it', 747964847, '', '', 0, '', 2),
(7, 3, 6, '2018-09-28', 'ggggg', 'aaaaa', 'aaa@dddd', 1111, '', '', 0, '', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `Events`
--

CREATE TABLE `Events` (
  `ID` int(200) NOT NULL,
  `Nome` varchar(50) NOT NULL,
  `Descrizione` longtext NOT NULL,
  `Foto` longtext NOT NULL COMMENT 'URL',
  `Luogo` text NOT NULL,
  `Coordinate` text NOT NULL,
  `Data_Inizio` date NOT NULL,
  `Data_Fine` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELAZIONI PER TABELLA `Events`:
--

--
-- Dump dei dati per la tabella `Events`
--

INSERT INTO `Events` (`ID`, `Nome`, `Descrizione`, `Foto`, `Luogo`, `Coordinate`, `Data_Inizio`, `Data_Fine`) VALUES
(1, 'Laboratorio per Bambini', 'Questo laboratorio da al possibilità ai bambini di avvicinarsi alla scienza divertendosi ed imparando allo stesso tempo.\nPer accedere a questo evento i bambini avranno bisogno di un accompagnatore. \nSpecificare i dati dell\'accompagnatore al momento dell\'iscrizione.', 'Immagini_Eventi/EventImage-1536506402563.jpg', 'Dipartimento di Fisica - Cittadella Universitaria - Catania - Via S. Sofia, 175', '', '2018-09-28', '0000-00-00'),
(2, 'Visita laboratori INFN', 'Vi è la possibilità di visitare i laboratori del INFN.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 'Immagini_Eventi/EventImage-1536506482033.jpg', 'Catania - Via S. Sofia, 145', '', '2018-09-28', '0000-00-00'),
(3, 'Visita Museo della Scienza', 'Vi è la possibilità di visitare i i musei della scienza a Catania.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 'Immagini_Eventi/EventImage-1536506562768.jpg', 'Catania - Via Etnea, 145', '', '2018-09-28', '0000-00-00');

-- --------------------------------------------------------

--
-- Struttura della tabella `Scheduling`
--

CREATE TABLE `Scheduling` (
  `ID` int(200) NOT NULL,
  `ID_Events` int(200) NOT NULL,
  `Descrizione` text NOT NULL,
  `Limite_Users` tinyint(1) NOT NULL,
  `Num_part` int(200) NOT NULL DEFAULT '0',
  `Ora_Inizio` time NOT NULL,
  `Ora_Fine` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- RELAZIONI PER TABELLA `Scheduling`:
--   `ID_Events`
--       `Events` -> `ID`
--

--
-- Dump dei dati per la tabella `Scheduling`
--

INSERT INTO `Scheduling` (`ID`, `ID_Events`, `Descrizione`, `Limite_Users`, `Num_part`, `Ora_Inizio`, `Ora_Fine`) VALUES
(1, 1, 'Questo laboratorio da al possibilità ai bambini di avvicinarsi alla scienza divertendosi ed imparando allo stesso tempo.\nPer accedere a questo evento i bambini avranno bisogno di un accompagnatore. \nSpecificare i dati dell\'accompagnatore al momento dell\'iscrizione.', 1, 3, '08:30:00', '09:00:00'),
(2, 1, 'Questo laboratorio da al possibilità ai bambini di avvicinarsi alla scienza divertendosi ed imparando allo stesso tempo.\nPer accedere a questo evento i bambini avranno bisogno di un accompagnatore. \nSpecificare i dati dell\'accompagnatore al momento dell\'iscrizione.', 0, 30, '09:00:00', '09:30:00'),
(3, 1, 'Questo laboratorio da al possibilità ai bambini di avvicinarsi alla scienza divertendosi ed imparando allo stesso tempo.\nPer accedere a questo evento i bambini avranno bisogno di un accompagnatore. \nSpecificare i dati dell\'accompagnatore al momento dell\'iscrizione.', 0, 40, '21:00:00', '22:00:00'),
(4, 2, 'Vi è la possibilità di visitare i laboratori del INFN.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 1, 45, '20:00:00', '21:00:00'),
(5, 2, 'Vi è la possibilità di visitare i laboratori del INFN.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 1, 50, '21:00:00', '22:00:00'),
(6, 3, 'Vi è la possibilità di visitare i i musei della scienza a Catania.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 0, 45, '22:00:00', '22:45:00'),
(7, 3, 'Vi è la possibilità di visitare i i musei della scienza a Catania.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 0, 30, '23:00:00', '23:30:00'),
(8, 3, 'Vi è la possibilità di visitare i i musei della scienza a Catania.\nSe si è minorenni è necessario specificare i dati dell\'accompagnatore.', 0, 40, '23:30:00', '00:00:00');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `Admins`
--
ALTER TABLE `Admins`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `Booking`
--
ALTER TABLE `Booking`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Esterna` (`ID_Events`),
  ADD KEY `Esterna3` (`ID_Scheduling`);

--
-- Indici per le tabelle `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`ID`);

--
-- Indici per le tabelle `Scheduling`
--
ALTER TABLE `Scheduling`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `Esterna2` (`ID_Events`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `Admins`
--
ALTER TABLE `Admins`
  MODIFY `ID` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT per la tabella `Booking`
--
ALTER TABLE `Booking`
  MODIFY `ID` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT per la tabella `Events`
--
ALTER TABLE `Events`
  MODIFY `ID` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `Scheduling`
--
ALTER TABLE `Scheduling`
  MODIFY `ID` int(200) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `Booking`
--
ALTER TABLE `Booking`
  ADD CONSTRAINT `Esterna` FOREIGN KEY (`ID_Events`) REFERENCES `Events` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `Esterna3` FOREIGN KEY (`ID_Scheduling`) REFERENCES `Scheduling` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limiti per la tabella `Scheduling`
--
ALTER TABLE `Scheduling`
  ADD CONSTRAINT `Esterna2` FOREIGN KEY (`ID_Events`) REFERENCES `Events` (`ID`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

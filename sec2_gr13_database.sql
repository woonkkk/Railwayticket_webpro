-- https://www.phpmyadmin.net/

DROP DATABASE IF EXISTS sec2_gr13_database;
CREATE DATABASE IF NOT EXISTS sec2_gr13_database;
USE sec2_gr13_database;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `railwayticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `adminlogin`
--

CREATE TABLE `adminlogin` (
  `adminID` int(50) NOT NULL,
  `admin_username` varchar(50) NOT NULL,
  `admin_password` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adminlogin`
--

INSERT INTO `adminlogin` (`adminID`, `admin_username`, `admin_password`) VALUES
(1, 'foxzfoxzfoxz', '08041999'),
(2, 'kageyama', '22101996'),
(3, 'toruoikawa', '20071994'),
(4, 'garnets', '07072004'),
(5, 'tsukishima', '27091996'),
(6, 'tetsurokuroo', '17111994'),
(7, 'hinata', '21061996'),
(8, 'nishinoya', '10101995');

-- --------------------------------------------------------

--
-- Table structure for table `adminregister`
--

CREATE TABLE `adminregister` (
  `adminID` int(11) NOT NULL,
  `admin_fullname` varchar(50) NOT NULL,
  `admin_username` varchar(50) NOT NULL,
  `admin_email` varchar(100) NOT NULL,
  `admin_phonenum` varchar(50) NOT NULL,
  `admin_role` varchar(50) NOT NULL,
  `admin_address` varchar(300) NOT NULL,
  `admin_password` varchar(8) NOT NULL,
  `admin_confpassword` varchar(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adminregister`
--

INSERT INTO `adminregister` (`adminID`, `admin_fullname`, `admin_username`, `admin_email`, `admin_phonenum`, `admin_role`, `admin_address`, `admin_password`, `admin_confpassword`) 
VALUES
(99, 'Sasasuang Pattanakitjaroenchai', 'Sasasuang', 'Sasasuang.pat@student.mahidol.edu', '0830753204', 'manager', '229/33', '12345678', '12345678'),
(100, 'Kanita Karunkittikun', 'Kanita', 'Kanita.kar@student.mahidol.edu', '0923345656', 'creator', '229/23', '12343478', '12343478'),
(101, 'Supithcha Jongphoemwatthanaphon', 'Supithcha', 'Supithcha.jon@student.mahidol.edu', '0846975159', 'manager', '229/11', '11113478', '11113478'),
(102, 'Nisakorn Ngaosri', 'Nisakorn', 'Nisakorn.nga@student.mahidol.edu', '0818214137', 'creator', '229/17', '11143478', '11143478'),
(111, 'Manee Meethong', 'Manee', 'Manee.mee@student.mahidol.edu', '0800751590', 'admin', '229/11', '11113888', '11113478');

-- --------------------------------------------------------

--
-- Table structure for table `new_tickets`
--

CREATE TABLE `new_tickets` (
  `id` int(11) NOT NULL,
  `departure_station` varchar(255) NOT NULL,
  `terminal_station` varchar(255) NOT NULL,
  `ticket_type` varchar(255) NOT NULL,
  `train_number` varchar(255) NOT NULL,
  `available_date` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `new_tickets`
--

INSERT INTO `new_tickets` (`id`, `departure_station`, `terminal_station`, `ticket_type`, `train_number`, `available_date`) VALUES
(2, 'Chiang Mai', 'Kra bi', 'test', '5', '2014-04-04'),
(5, 'Chiang Mai', 'Chang Rai', 'asd', '555', '2023-04-15'),
(6, 'Kra Bi', 'Bangkok', 'SDA', '4', '2023-04-19'),
(7, 'Kra Bi', 'Chiang Mai', 'KAS', '6', '2023-04-23'),
(8, 'Kra Bi', 'Bangkok', 'SDA', '4', '2023-04-22'),
(9, 'Kra Bi', 'Bangkok', 'SAD', '6', '2023-04-22'),
(10, 'Bangkok', 'Kra Bi', 'FAS', '6', '2023-04-23');

-- --------------------------------------------------------

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adminregister`
--
ALTER TABLE `adminregister`
  ADD PRIMARY KEY (`adminID`);

--
-- Indexes for table `new_tickets`
--
ALTER TABLE `new_tickets`
  ADD PRIMARY KEY (`id`);
  
--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adminregister`
--
ALTER TABLE `adminregister`
  MODIFY `adminID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `new_tickets`
--
ALTER TABLE `new_tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

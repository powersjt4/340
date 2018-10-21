/*
	Jacob Powers
	10/14/18
	Project Step 2 Final Version: ERD, Schema & DDQ
*/


--
-- Table structure for table `meal`
--

DROP TABLE IF EXISTS `meal`;
CREATE TABLE `meal` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `meal`
--

LOCK TABLES `meal` WRITE;
INSERT INTO `meal` VALUES (1,'breakfast'),(2,'brunch'),(3,'lunch'),(4,'dinner');
UNLOCK TABLES;

--
-- Table structure for table `primary_ingredient`
--

DROP TABLE IF EXISTS `primary_ingredient`;
CREATE TABLE `primary_ingredient` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `primary_ingredient`
--

LOCK TABLES `primary_ingredient` WRITE;
INSERT INTO `primary_ingredient` VALUES (1,'pork'),(2,'beef'),(3,'chicken'),(4,'flour');
UNLOCK TABLES;

--
-- Table structure for table `menu`
--

DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `restaurant_name` varchar(255) NOT NULL,
  `menu_meal` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `menu_meal` (`menu_meal`),
  CONSTRAINT `menu_ibfk_1` FOREIGN KEY (`menu_meal`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menu`
--

LOCK TABLES `menu` WRITE;
INSERT INTO `menu` VALUES (1,'murphys',1),(2,'murphys',2),(3,'murphys',3),(4,'murphys',4),(5,'Dots Diner',1);
UNLOCK TABLES;


--
-- Table structure for table `items`
--

DROP TABLE IF EXISTS `items`;
CREATE TABLE `items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` float(5,2) NOT NULL,
  `description` varchar(255) NOT NULL,
  `item_meal` int(11) NOT NULL, 
  `primary_ingredient` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `item_meal` (`item_meal`),
  CONSTRAINT `items_ibfk_1` FOREIGN KEY (`item_meal`) REFERENCES `meal` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  KEY `primary_ingredient` (`primary_ingredient`),
  CONSTRAINT `items_ibfk_2` FOREIGN KEY (`primary_ingredient`) REFERENCES `primary_ingredient` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `items`
--

LOCK TABLES `items` WRITE;
INSERT INTO `items` (`id`, `name`, `price`, `description`, `item_meal`, `primary_ingredient`) VALUES
	(1, 'Chicken Salad', 2.99, 'It is a salad made with chickens', 3, 3),
	(2, 'Pancakes', 5.99, 'Cakes made out of pans', 1, 4),
	(3, 'Monte Cristo', 4.99, 'Weird Sandwich', 1, 1),
	(4, 'Monte Cristo', 5.99, 'Weird Sandwich', 2, 1),
	(5, 'Monte Cristo', 6.99, 'Weird Sandwich', 3, 1),
	(6, 'Roast Beast', 12.99, 'A cooked animal', 4, 2),
	(7, 'Eggs', 1.99, 'Fried chicken embryos', 1, 3);
UNLOCK TABLES;




--
-- Table structure for table `menu_items`
--

DROP TABLE IF EXISTS `menu_items`;
CREATE TABLE `menu_items` (
  `mid` int(11) NOT NULL DEFAULT '0',
  `iid` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`mid`,`iid`),
  KEY `iid` (`iid`),
  CONSTRAINT `menu_items_ibfk_1` FOREIGN KEY (`mid`) REFERENCES `menu` (`id`),
  CONSTRAINT `menu_items_ibfk_2` FOREIGN KEY (`iid`) REFERENCES `items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `menu_items`
--

LOCK TABLES `menu_items` WRITE;
INSERT INTO `menu_items` VALUES (1,7),(1,3),(2,4),(2,2),(3,1),(3,4),(4,5),(4,6),(5,7),(5,2);
UNLOCK TABLES;
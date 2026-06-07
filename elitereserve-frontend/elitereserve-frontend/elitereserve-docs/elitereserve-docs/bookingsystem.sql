/*
Navicat MySQL Data Transfer

Source Server         : SOA-Project
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : bookingsystem

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2026-03-24 18:07:44
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `bookings`
-- ----------------------------
DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `check_in_date` date NOT NULL,
  `check_out_date` date NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) DEFAULT NULL,
  `modification_paid` bit(1) NOT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `payment_received` bit(1) NOT NULL,
  `price_difference` decimal(10,2) DEFAULT NULL,
  `quoted_price` decimal(10,2) NOT NULL,
  `refund_amount` double DEFAULT NULL,
  `requested_check_in` date DEFAULT NULL,
  `requested_check_out` date DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','CANCELLED','EXPIRED','COMPLETED','REFUNDED') NOT NULL,
  `total_paid` decimal(10,2) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  `version` bigint(20) NOT NULL,
  `assigned_room_id` bigint(20) DEFAULT NULL,
  `hotel_id` bigint(20) NOT NULL,
  `room_type_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf4m8ctp66phl5me8o3d5i2b11` (`assigned_room_id`),
  KEY `FK7y09f5lun38jnooaw2hch0ke9` (`hotel_id`),
  KEY `FKgxj821at0er9dtw7wtyc05ni1` (`room_type_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FK7y09f5lun38jnooaw2hch0ke9` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKf4m8ctp66phl5me8o3d5i2b11` FOREIGN KEY (`assigned_room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `FKgxj821at0er9dtw7wtyc05ni1` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of bookings
-- ----------------------------

-- ----------------------------
-- Table structure for `booking_extensions`
-- ----------------------------
DROP TABLE IF EXISTS `booking_extensions`;
CREATE TABLE `booking_extensions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `additional_cost` decimal(10,2) NOT NULL,
  `amount_paid` decimal(10,2) NOT NULL,
  `completed_at` datetime(6) DEFAULT NULL,
  `extended_nights` bigint(20) NOT NULL,
  `new_check_out` date NOT NULL,
  `previous_check_out` date NOT NULL,
  `requested_at` datetime(6) NOT NULL,
  `status` enum('PENDING','PAID','COMPLETED','CANCELLED') NOT NULL,
  `original_booking_id` bigint(20) NOT NULL,
  `payment_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_rs2c628pibys1pj41qagcvmmb` (`payment_id`),
  KEY `FK6hv1mg5r3ylis8jdydf3keis8` (`original_booking_id`),
  CONSTRAINT `FK4xopi77bj10hwnbj71138hxpw` FOREIGN KEY (`payment_id`) REFERENCES `payment` (`id`),
  CONSTRAINT `FK6hv1mg5r3ylis8jdydf3keis8` FOREIGN KEY (`original_booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of booking_extensions
-- ----------------------------

-- ----------------------------
-- Table structure for `hotels`
-- ----------------------------
DROP TABLE IF EXISTS `hotels`;
CREATE TABLE `hotels` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `average_rating` double DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `rating_badge` varchar(255) DEFAULT NULL,
  `total_reviews` int(11) DEFAULT NULL,
  `manager_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKaq04sfgwojtl4faui62h7my9n` (`manager_id`),
  CONSTRAINT `FKaq04sfgwojtl4faui62h7my9n` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of hotels
-- ----------------------------
INSERT INTO `hotels` VALUES ('0', null, null, null, null, null, null, null, null, null, null, null);
INSERT INTO `hotels` VALUES ('1', 'Corniche El Manara, Beirut, Lebanon', '8.2', 'Beirut', '2026-03-24 11:27:30.000000', 'Luxury beachfront hotel with stunning Mediterranean Sea views, private beach access, and world-class dining experiences. Features an infinity pool overlooking the sea and a state-of-the-art spa.', '/images/hotels/h1.avif', '', 'Oceano Hotel', 'Very Good', '10', '4');
INSERT INTO `hotels` VALUES ('2', 'Jaffa Street 23, Jerusalem, Palestine', '7.5', 'Jerusalem', '2026-03-24 11:27:30.000000', 'Modern hotel in city center, minutes from Old City and religious sites.', '/images/hotels/h2.jpg', '', 'White Arena', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('3', 'Manger Street 45, Bethlehem, Palestine', '7.8', 'Bethlehem', '2026-03-24 11:27:30.000000', 'Historic hotel near Church of Nativity with traditional Palestinian charm.', '/images/hotels/h3.webp', '', 'Douglas Hotel', 'Good', '10', '4');
INSERT INTO `hotels` VALUES ('4', 'Al-Mina Street, Lathiqia, Syria', '8.1', 'Lathiqia', '2026-03-24 11:27:30.000000', 'Premier seaside resort with private beach and water sports facilities.', '/images/hotels/h4.jpg', '', 'Royal Sea', 'Very Good', '10', '7');
INSERT INTO `hotels` VALUES ('5', 'Al-Hammamat Al-Tunisiyya Street, Aqaba, Jordan', '7.2', 'Aqaba', '2026-03-24 11:27:30.000000', 'Comfortable Red Sea hotel perfect for diving and beach activities.', '/images/hotels/h5.jpg', '', 'Loyal Hotel', 'Good', '10', '4');
INSERT INTO `hotels` VALUES ('6', 'Al-Jazzar Street, Acre, Palestine', '8.7', 'Akka', '2026-03-24 11:27:30.000000', 'Luxury accommodations with panoramic views of ancient port city.', '/images/hotels/h6.jpeg', '', 'Holy Sky Hotels', 'Exceptional', '10', '7');
INSERT INTO `hotels` VALUES ('7', 'Al-Maliki Street, Damascus, Syria', '6.8', 'Damascus', '2026-03-24 11:27:30.000000', 'Budget-friendly hotel in historic center with traditional Syrian breakfast.', '/images/hotels/h7.webp', '', 'Sunrise Hotel', 'Average', '10', '4');
INSERT INTO `hotels` VALUES ('8', 'Al-Madina Al-Munawwara Street, Amman, Jordan', '7.4', 'Amman', '2026-03-24 11:27:30.000000', 'Elegant hotel in business district with authentic Jordanian cuisine.', '/images/hotels/h8.jpg', '', 'Karmel Hotel', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('9', 'Hamra Street, Beirut, Lebanon', '8', 'Beirut', '2026-03-24 11:27:31.000000', 'Iconic tower in vibrant Hamra district with rooftop bar and city views.', '/images/hotels/h9.png', '', 'Grand Tower', 'Very Good', '10', '4');
INSERT INTO `hotels` VALUES ('10', 'Old City, Sidon, Lebanon', '7.7', 'Saida', '2026-03-24 11:27:31.000000', 'Boutique hotel in Old City with personalized service and sea views.', '/images/hotels/h10.jpg', '', 'Louis V Hotel', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('11', 'Mount Gerizim Road, Nablus, Palestine', '8.1', 'Nablus', '2026-03-24 11:27:31.000000', 'Palatial hotel with mountain views and famous Nabulsi cuisine.', '/images/hotels/h11.jpg', '', 'Hilly Palace', 'Very Good', '10', '4');
INSERT INTO `hotels` VALUES ('12', 'Tel Al-Rabie Main Road, Palestine', '8.9', 'Tel Al-Rabie', '2026-03-24 11:27:31.000000', '5-star luxury resort with full-service spa and fine dining.', '/images/hotels/h12.jpg', '', 'Al-Sheikh Hotel', 'Exceptional', '10', '7');
INSERT INTO `hotels` VALUES ('13', 'Achrafieh, Beirut, Lebanon', '7', 'Beirut', '2026-03-24 11:27:31.000000', 'Unique circular architecture with panoramic revolving restaurant.', '/images/hotels/h13.jpg', '', 'Round Palace', 'Good', '10', '4');
INSERT INTO `hotels` VALUES ('14', 'Star Street, Bethlehem, Palestine', '7.2', 'Bethlehem', '2026-03-24 11:27:31.000000', 'Contemporary design hotel near pilgrimage route and local artisans.', '/images/hotels/h14.jpg', '', 'White Blocks', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('15', 'Mount of Olives, Jerusalem, Palestine', '8.5', 'Jerusalem', '2026-03-24 11:27:31.000000', 'Spiritual retreat on Mount of Olives with Old City views.', '/images/hotels/h15.jpg', '', 'Holy TalaHotel', 'Very Good', '10', '4');
INSERT INTO `hotels` VALUES ('16', 'Al-Qaymariya District, Damascus, Syria', '7.8', 'Damascus', '2026-03-24 11:27:31.000000', 'Restored historic house with traditional Damascene architecture.', '/images/hotels/h16.jpg', '', 'Sham House', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('17', 'Al-Masyoun, Ramallah, Palestine', '7.2', 'Rammallah', '2026-03-24 11:27:31.000000', 'Elegant hotel with art gallery and rooftop café in city center.', '/images/hotels/h17.jpg', '', 'Royal Samiramis', 'Good', '10', '4');
INSERT INTO `hotels` VALUES ('18', 'Coastal Road, Urgit, Syria', '8.1', 'Urgit', '2026-03-24 11:27:31.000000', 'Panoramic Mediterranean views with private beach access.', '/images/hotels/h18.jpg', '', 'See Wide Hotel', 'Very Good', '10', '7');
INSERT INTO `hotels` VALUES ('19', 'King Hussein Street, Amman, Jordan', '7.7', 'Amman', '2026-03-24 11:27:31.000000', 'Royal treatment with luxurious accommodations and premium service.', '/images/hotels/h19.jpg', '', 'Al-Malaki Hotel', 'Good', '10', '4');
INSERT INTO `hotels` VALUES ('20', 'German Colony, Haifa, Palestine', '8.5', 'Haifa', '2026-03-24 11:27:31.000000', 'Artistic hotel in German Colony with Baháʼí Gardens views.', '/images/hotels/h20.webp', '', 'Outsider House', 'Very Good', '10', '7');
INSERT INTO `hotels` VALUES ('21', 'City Center, Om Al-Fahim, Palestine', '8', 'Om Al-Fahim', '2026-03-24 11:27:31.000000', 'Landmark twin towers with business center and shopping arcade.', '/images/hotels/h21.jpg', '', 'Twin Tower Palace', 'Very Good', '10', '4');
INSERT INTO `hotels` VALUES ('22', 'Manger Square, Bethlehem, Palestine', '7.1', 'Bethlehem', '2026-03-24 11:27:31.000000', 'Boutique hotel at Manger Square with local art and culture.', '/images/hotels/h22.avif', '', 'Hotel Indigo', 'Good', '10', '7');
INSERT INTO `hotels` VALUES ('23', 'Al-Shuhada Street, Hebron, Palestine', '6.8', 'Hebron', '2026-03-24 11:27:31.000000', 'Cozy hotel in Old City with traditional decor and warm hospitality.', '/images/hotels/h23.avif', '', 'Hotel Hebron', 'Average', '10', '4');
INSERT INTO `hotels` VALUES ('24', 'Beit Jala Road, Bethlehem, Palestine', '6', 'Bethlehem', '2026-03-24 11:27:31.000000', 'Family-friendly hotel with garden setting and swimming pool.', '/images/hotels/h24.jpg', '', 'Middle Park Hotel', 'Fair', '10', '7');

-- ----------------------------
-- Table structure for `hotel_base_prices`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_base_prices`;
CREATE TABLE `hotel_base_prices` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `end_date` date NOT NULL,
  `is_active` bit(1) NOT NULL,
  `price_per_night` decimal(10,2) NOT NULL,
  `season_name` varchar(255) DEFAULT NULL,
  `start_date` date NOT NULL,
  `hotel_id` bigint(20) NOT NULL,
  `room_type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4mhk3nd6xhjtlsgjrc6hx9qj7` (`hotel_id`,`room_type_id`,`start_date`),
  KEY `FKhsuyuxqe6liy7tw289v2p42lt` (`room_type_id`),
  CONSTRAINT `FKhsuyuxqe6liy7tw289v2p42lt` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`),
  CONSTRAINT `FKl5uma22rs0r9ld09f477f03of` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of hotel_base_prices
-- ----------------------------
INSERT INTO `hotel_base_prices` VALUES ('25', '2027-03-24', '', '0.00', 'Regular Season', '2026-03-24', '0', '25');
INSERT INTO `hotel_base_prices` VALUES ('26', '2027-03-24', '', '0.00', 'Regular Season', '2026-03-24', '0', '26');
INSERT INTO `hotel_base_prices` VALUES ('27', '2027-03-24', '', '0.00', 'Regular Season', '2026-03-24', '0', '27');
INSERT INTO `hotel_base_prices` VALUES ('28', '2027-03-24', '', '0.00', 'Regular Season', '2026-03-24', '0', '28');
INSERT INTO `hotel_base_prices` VALUES ('29', '2027-03-24', '', '0.00', 'Regular Season', '2026-03-24', '0', '29');
INSERT INTO `hotel_base_prices` VALUES ('30', '2027-03-24', '', '112.00', 'Regular Season', '2026-03-24', '1', '30');
INSERT INTO `hotel_base_prices` VALUES ('31', '2027-03-24', '', '168.00', 'Regular Season', '2026-03-24', '1', '31');
INSERT INTO `hotel_base_prices` VALUES ('32', '2027-03-24', '', '179.20', 'Regular Season', '2026-03-24', '1', '32');
INSERT INTO `hotel_base_prices` VALUES ('33', '2027-03-24', '', '224.00', 'Regular Season', '2026-03-24', '1', '33');
INSERT INTO `hotel_base_prices` VALUES ('34', '2027-03-24', '', '280.00', 'Regular Season', '2026-03-24', '1', '34');
INSERT INTO `hotel_base_prices` VALUES ('35', '2027-03-24', '', '105.00', 'Regular Season', '2026-03-24', '2', '35');
INSERT INTO `hotel_base_prices` VALUES ('36', '2027-03-24', '', '157.50', 'Regular Season', '2026-03-24', '2', '36');
INSERT INTO `hotel_base_prices` VALUES ('37', '2027-03-24', '', '168.00', 'Regular Season', '2026-03-24', '2', '37');
INSERT INTO `hotel_base_prices` VALUES ('38', '2027-03-24', '', '210.00', 'Regular Season', '2026-03-24', '2', '38');
INSERT INTO `hotel_base_prices` VALUES ('39', '2027-03-24', '', '262.50', 'Regular Season', '2026-03-24', '2', '39');
INSERT INTO `hotel_base_prices` VALUES ('40', '2027-03-24', '', '108.00', 'Regular Season', '2026-03-24', '3', '40');
INSERT INTO `hotel_base_prices` VALUES ('41', '2027-03-24', '', '162.00', 'Regular Season', '2026-03-24', '3', '41');
INSERT INTO `hotel_base_prices` VALUES ('42', '2027-03-24', '', '172.80', 'Regular Season', '2026-03-24', '3', '42');
INSERT INTO `hotel_base_prices` VALUES ('43', '2027-03-24', '', '216.00', 'Regular Season', '2026-03-24', '3', '43');
INSERT INTO `hotel_base_prices` VALUES ('44', '2027-03-24', '', '270.00', 'Regular Season', '2026-03-24', '3', '44');
INSERT INTO `hotel_base_prices` VALUES ('45', '2027-03-24', '', '111.00', 'Regular Season', '2026-03-24', '4', '45');
INSERT INTO `hotel_base_prices` VALUES ('46', '2027-03-24', '', '166.50', 'Regular Season', '2026-03-24', '4', '46');
INSERT INTO `hotel_base_prices` VALUES ('47', '2027-03-24', '', '177.60', 'Regular Season', '2026-03-24', '4', '47');
INSERT INTO `hotel_base_prices` VALUES ('48', '2027-03-24', '', '222.00', 'Regular Season', '2026-03-24', '4', '48');
INSERT INTO `hotel_base_prices` VALUES ('49', '2027-03-24', '', '277.50', 'Regular Season', '2026-03-24', '4', '49');
INSERT INTO `hotel_base_prices` VALUES ('50', '2027-03-24', '', '102.00', 'Regular Season', '2026-03-24', '5', '50');
INSERT INTO `hotel_base_prices` VALUES ('51', '2027-03-24', '', '153.00', 'Regular Season', '2026-03-24', '5', '51');
INSERT INTO `hotel_base_prices` VALUES ('52', '2027-03-24', '', '163.20', 'Regular Season', '2026-03-24', '5', '52');
INSERT INTO `hotel_base_prices` VALUES ('53', '2027-03-24', '', '204.00', 'Regular Season', '2026-03-24', '5', '53');
INSERT INTO `hotel_base_prices` VALUES ('54', '2027-03-24', '', '255.00', 'Regular Season', '2026-03-24', '5', '54');
INSERT INTO `hotel_base_prices` VALUES ('55', '2027-03-24', '', '117.00', 'Regular Season', '2026-03-24', '6', '55');
INSERT INTO `hotel_base_prices` VALUES ('56', '2027-03-24', '', '175.50', 'Regular Season', '2026-03-24', '6', '56');
INSERT INTO `hotel_base_prices` VALUES ('57', '2027-03-24', '', '187.20', 'Regular Season', '2026-03-24', '6', '57');
INSERT INTO `hotel_base_prices` VALUES ('58', '2027-03-24', '', '234.00', 'Regular Season', '2026-03-24', '6', '58');
INSERT INTO `hotel_base_prices` VALUES ('59', '2027-03-24', '', '292.50', 'Regular Season', '2026-03-24', '6', '59');
INSERT INTO `hotel_base_prices` VALUES ('60', '2027-03-24', '', '98.00', 'Regular Season', '2026-03-24', '7', '60');
INSERT INTO `hotel_base_prices` VALUES ('61', '2027-03-24', '', '147.00', 'Regular Season', '2026-03-24', '7', '61');
INSERT INTO `hotel_base_prices` VALUES ('62', '2027-03-24', '', '156.80', 'Regular Season', '2026-03-24', '7', '62');
INSERT INTO `hotel_base_prices` VALUES ('63', '2027-03-24', '', '196.00', 'Regular Season', '2026-03-24', '7', '63');
INSERT INTO `hotel_base_prices` VALUES ('64', '2027-03-24', '', '245.00', 'Regular Season', '2026-03-24', '7', '64');
INSERT INTO `hotel_base_prices` VALUES ('65', '2027-03-24', '', '104.00', 'Regular Season', '2026-03-24', '8', '65');
INSERT INTO `hotel_base_prices` VALUES ('66', '2027-03-24', '', '156.00', 'Regular Season', '2026-03-24', '8', '66');
INSERT INTO `hotel_base_prices` VALUES ('67', '2027-03-24', '', '166.40', 'Regular Season', '2026-03-24', '8', '67');
INSERT INTO `hotel_base_prices` VALUES ('68', '2027-03-24', '', '208.00', 'Regular Season', '2026-03-24', '8', '68');
INSERT INTO `hotel_base_prices` VALUES ('69', '2027-03-24', '', '260.00', 'Regular Season', '2026-03-24', '8', '69');
INSERT INTO `hotel_base_prices` VALUES ('70', '2027-03-24', '', '110.00', 'Regular Season', '2026-03-24', '9', '70');
INSERT INTO `hotel_base_prices` VALUES ('71', '2027-03-24', '', '165.00', 'Regular Season', '2026-03-24', '9', '71');
INSERT INTO `hotel_base_prices` VALUES ('72', '2027-03-24', '', '176.00', 'Regular Season', '2026-03-24', '9', '72');
INSERT INTO `hotel_base_prices` VALUES ('73', '2027-03-24', '', '220.00', 'Regular Season', '2026-03-24', '9', '73');
INSERT INTO `hotel_base_prices` VALUES ('74', '2027-03-24', '', '275.00', 'Regular Season', '2026-03-24', '9', '74');
INSERT INTO `hotel_base_prices` VALUES ('75', '2027-03-24', '', '107.00', 'Regular Season', '2026-03-24', '10', '75');
INSERT INTO `hotel_base_prices` VALUES ('76', '2027-03-24', '', '160.50', 'Regular Season', '2026-03-24', '10', '76');
INSERT INTO `hotel_base_prices` VALUES ('77', '2027-03-24', '', '171.20', 'Regular Season', '2026-03-24', '10', '77');
INSERT INTO `hotel_base_prices` VALUES ('78', '2027-03-24', '', '214.00', 'Regular Season', '2026-03-24', '10', '78');
INSERT INTO `hotel_base_prices` VALUES ('79', '2027-03-24', '', '267.50', 'Regular Season', '2026-03-24', '10', '79');
INSERT INTO `hotel_base_prices` VALUES ('80', '2027-03-24', '', '111.00', 'Regular Season', '2026-03-24', '11', '80');
INSERT INTO `hotel_base_prices` VALUES ('81', '2027-03-24', '', '166.50', 'Regular Season', '2026-03-24', '11', '81');
INSERT INTO `hotel_base_prices` VALUES ('82', '2027-03-24', '', '177.60', 'Regular Season', '2026-03-24', '11', '82');
INSERT INTO `hotel_base_prices` VALUES ('83', '2027-03-24', '', '222.00', 'Regular Season', '2026-03-24', '11', '83');
INSERT INTO `hotel_base_prices` VALUES ('84', '2027-03-24', '', '277.50', 'Regular Season', '2026-03-24', '11', '84');
INSERT INTO `hotel_base_prices` VALUES ('85', '2027-03-24', '', '119.00', 'Regular Season', '2026-03-24', '12', '85');
INSERT INTO `hotel_base_prices` VALUES ('86', '2027-03-24', '', '178.50', 'Regular Season', '2026-03-24', '12', '86');
INSERT INTO `hotel_base_prices` VALUES ('87', '2027-03-24', '', '190.40', 'Regular Season', '2026-03-24', '12', '87');
INSERT INTO `hotel_base_prices` VALUES ('88', '2027-03-24', '', '238.00', 'Regular Season', '2026-03-24', '12', '88');
INSERT INTO `hotel_base_prices` VALUES ('89', '2027-03-24', '', '297.50', 'Regular Season', '2026-03-24', '12', '89');
INSERT INTO `hotel_base_prices` VALUES ('90', '2027-03-24', '', '100.00', 'Regular Season', '2026-03-24', '13', '90');
INSERT INTO `hotel_base_prices` VALUES ('91', '2027-03-24', '', '150.00', 'Regular Season', '2026-03-24', '13', '91');
INSERT INTO `hotel_base_prices` VALUES ('92', '2027-03-24', '', '160.00', 'Regular Season', '2026-03-24', '13', '92');
INSERT INTO `hotel_base_prices` VALUES ('93', '2027-03-24', '', '200.00', 'Regular Season', '2026-03-24', '13', '93');
INSERT INTO `hotel_base_prices` VALUES ('94', '2027-03-24', '', '250.00', 'Regular Season', '2026-03-24', '13', '94');
INSERT INTO `hotel_base_prices` VALUES ('95', '2027-03-24', '', '102.00', 'Regular Season', '2026-03-24', '14', '95');
INSERT INTO `hotel_base_prices` VALUES ('96', '2027-03-24', '', '153.00', 'Regular Season', '2026-03-24', '14', '96');
INSERT INTO `hotel_base_prices` VALUES ('97', '2027-03-24', '', '163.20', 'Regular Season', '2026-03-24', '14', '97');
INSERT INTO `hotel_base_prices` VALUES ('98', '2027-03-24', '', '204.00', 'Regular Season', '2026-03-24', '14', '98');
INSERT INTO `hotel_base_prices` VALUES ('99', '2027-03-24', '', '255.00', 'Regular Season', '2026-03-24', '14', '99');
INSERT INTO `hotel_base_prices` VALUES ('100', '2027-03-24', '', '115.00', 'Regular Season', '2026-03-24', '15', '100');
INSERT INTO `hotel_base_prices` VALUES ('101', '2027-03-24', '', '172.50', 'Regular Season', '2026-03-24', '15', '101');
INSERT INTO `hotel_base_prices` VALUES ('102', '2027-03-24', '', '184.00', 'Regular Season', '2026-03-24', '15', '102');
INSERT INTO `hotel_base_prices` VALUES ('103', '2027-03-24', '', '230.00', 'Regular Season', '2026-03-24', '15', '103');
INSERT INTO `hotel_base_prices` VALUES ('104', '2027-03-24', '', '287.50', 'Regular Season', '2026-03-24', '15', '104');
INSERT INTO `hotel_base_prices` VALUES ('105', '2027-03-24', '', '108.00', 'Regular Season', '2026-03-24', '16', '105');
INSERT INTO `hotel_base_prices` VALUES ('106', '2027-03-24', '', '162.00', 'Regular Season', '2026-03-24', '16', '106');
INSERT INTO `hotel_base_prices` VALUES ('107', '2027-03-24', '', '172.80', 'Regular Season', '2026-03-24', '16', '107');
INSERT INTO `hotel_base_prices` VALUES ('108', '2027-03-24', '', '216.00', 'Regular Season', '2026-03-24', '16', '108');
INSERT INTO `hotel_base_prices` VALUES ('109', '2027-03-24', '', '270.00', 'Regular Season', '2026-03-24', '16', '109');
INSERT INTO `hotel_base_prices` VALUES ('110', '2027-03-24', '', '102.00', 'Regular Season', '2026-03-24', '17', '110');
INSERT INTO `hotel_base_prices` VALUES ('111', '2027-03-24', '', '153.00', 'Regular Season', '2026-03-24', '17', '111');
INSERT INTO `hotel_base_prices` VALUES ('112', '2027-03-24', '', '163.20', 'Regular Season', '2026-03-24', '17', '112');
INSERT INTO `hotel_base_prices` VALUES ('113', '2027-03-24', '', '204.00', 'Regular Season', '2026-03-24', '17', '113');
INSERT INTO `hotel_base_prices` VALUES ('114', '2027-03-24', '', '255.00', 'Regular Season', '2026-03-24', '17', '114');
INSERT INTO `hotel_base_prices` VALUES ('115', '2027-03-24', '', '111.00', 'Regular Season', '2026-03-24', '18', '115');
INSERT INTO `hotel_base_prices` VALUES ('116', '2027-03-24', '', '166.50', 'Regular Season', '2026-03-24', '18', '116');
INSERT INTO `hotel_base_prices` VALUES ('117', '2027-03-24', '', '177.60', 'Regular Season', '2026-03-24', '18', '117');
INSERT INTO `hotel_base_prices` VALUES ('118', '2027-03-24', '', '222.00', 'Regular Season', '2026-03-24', '18', '118');
INSERT INTO `hotel_base_prices` VALUES ('119', '2027-03-24', '', '277.50', 'Regular Season', '2026-03-24', '18', '119');
INSERT INTO `hotel_base_prices` VALUES ('120', '2027-03-24', '', '107.00', 'Regular Season', '2026-03-24', '19', '120');
INSERT INTO `hotel_base_prices` VALUES ('121', '2027-03-24', '', '160.50', 'Regular Season', '2026-03-24', '19', '121');
INSERT INTO `hotel_base_prices` VALUES ('122', '2027-03-24', '', '171.20', 'Regular Season', '2026-03-24', '19', '122');
INSERT INTO `hotel_base_prices` VALUES ('123', '2027-03-24', '', '214.00', 'Regular Season', '2026-03-24', '19', '123');
INSERT INTO `hotel_base_prices` VALUES ('124', '2027-03-24', '', '267.50', 'Regular Season', '2026-03-24', '19', '124');
INSERT INTO `hotel_base_prices` VALUES ('125', '2027-03-24', '', '115.00', 'Regular Season', '2026-03-24', '20', '125');
INSERT INTO `hotel_base_prices` VALUES ('126', '2027-03-24', '', '172.50', 'Regular Season', '2026-03-24', '20', '126');
INSERT INTO `hotel_base_prices` VALUES ('127', '2027-03-24', '', '184.00', 'Regular Season', '2026-03-24', '20', '127');
INSERT INTO `hotel_base_prices` VALUES ('128', '2027-03-24', '', '230.00', 'Regular Season', '2026-03-24', '20', '128');
INSERT INTO `hotel_base_prices` VALUES ('129', '2027-03-24', '', '287.50', 'Regular Season', '2026-03-24', '20', '129');
INSERT INTO `hotel_base_prices` VALUES ('130', '2027-03-24', '', '110.00', 'Regular Season', '2026-03-24', '21', '130');
INSERT INTO `hotel_base_prices` VALUES ('131', '2027-03-24', '', '165.00', 'Regular Season', '2026-03-24', '21', '131');
INSERT INTO `hotel_base_prices` VALUES ('132', '2027-03-24', '', '176.00', 'Regular Season', '2026-03-24', '21', '132');
INSERT INTO `hotel_base_prices` VALUES ('133', '2027-03-24', '', '220.00', 'Regular Season', '2026-03-24', '21', '133');
INSERT INTO `hotel_base_prices` VALUES ('134', '2027-03-24', '', '275.00', 'Regular Season', '2026-03-24', '21', '134');
INSERT INTO `hotel_base_prices` VALUES ('135', '2027-03-24', '', '101.00', 'Regular Season', '2026-03-24', '22', '135');
INSERT INTO `hotel_base_prices` VALUES ('136', '2027-03-24', '', '151.50', 'Regular Season', '2026-03-24', '22', '136');
INSERT INTO `hotel_base_prices` VALUES ('137', '2027-03-24', '', '161.60', 'Regular Season', '2026-03-24', '22', '137');
INSERT INTO `hotel_base_prices` VALUES ('138', '2027-03-24', '', '202.00', 'Regular Season', '2026-03-24', '22', '138');
INSERT INTO `hotel_base_prices` VALUES ('139', '2027-03-24', '', '252.50', 'Regular Season', '2026-03-24', '22', '139');
INSERT INTO `hotel_base_prices` VALUES ('140', '2027-03-24', '', '98.00', 'Regular Season', '2026-03-24', '23', '140');
INSERT INTO `hotel_base_prices` VALUES ('141', '2027-03-24', '', '147.00', 'Regular Season', '2026-03-24', '23', '141');
INSERT INTO `hotel_base_prices` VALUES ('142', '2027-03-24', '', '156.80', 'Regular Season', '2026-03-24', '23', '142');
INSERT INTO `hotel_base_prices` VALUES ('143', '2027-03-24', '', '196.00', 'Regular Season', '2026-03-24', '23', '143');
INSERT INTO `hotel_base_prices` VALUES ('144', '2027-03-24', '', '245.00', 'Regular Season', '2026-03-24', '23', '144');
INSERT INTO `hotel_base_prices` VALUES ('145', '2027-03-24', '', '90.00', 'Regular Season', '2026-03-24', '24', '145');
INSERT INTO `hotel_base_prices` VALUES ('146', '2027-03-24', '', '135.00', 'Regular Season', '2026-03-24', '24', '146');
INSERT INTO `hotel_base_prices` VALUES ('147', '2027-03-24', '', '144.00', 'Regular Season', '2026-03-24', '24', '147');
INSERT INTO `hotel_base_prices` VALUES ('148', '2027-03-24', '', '180.00', 'Regular Season', '2026-03-24', '24', '148');
INSERT INTO `hotel_base_prices` VALUES ('149', '2027-03-24', '', '225.00', 'Regular Season', '2026-03-24', '24', '149');

-- ----------------------------
-- Table structure for `hotel_pricing_rules`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_pricing_rules`;
CREATE TABLE `hotel_pricing_rules` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `adjustment_percent` decimal(5,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `max_days_before_checkin` int(11) DEFAULT NULL,
  `min_days_before_checkin` int(11) DEFAULT NULL,
  `min_stay_days` int(11) DEFAULT NULL,
  `priority` int(11) NOT NULL,
  `rule_name` varchar(255) NOT NULL,
  `rule_type` enum('OCCUPANCY_BASED','SEASONAL','LAST_MINUTE','LENGTH_OF_STAY','SPECIAL','WEEKEND','LONG_STAY','EARLY_BIRD','HOLIDAY') NOT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `hotel_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb5kdrn18mgpqoc3i84kh1jw5n` (`hotel_id`),
  CONSTRAINT `FKb5kdrn18mgpqoc3i84kh1jw5n` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=205 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of hotel_pricing_rules
-- ----------------------------
INSERT INTO `hotel_pricing_rules` VALUES ('25', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', '', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('26', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Oceano Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('27', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - White Arena', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('28', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Douglas Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('29', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Royal Sea', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('30', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Loyal Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('31', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Holy Sky Hotels', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('32', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Sunrise Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('33', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Karmel Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('34', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Grand Tower', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('35', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Louis V Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('36', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Hilly Palace', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('37', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Al-Sheikh Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('38', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Round Palace', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('39', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - White Blocks', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('40', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Holy TalaHotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('41', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Sham House', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('42', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Royal Samiramis', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('43', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - See Wide Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('44', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Al-Malaki Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('45', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Outsider House', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('46', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Twin Tower Palace', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('47', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Hotel Indigo', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('48', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Hotel Hebron', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('49', '-10.00', 'Book 30+ days in advance and get 10% discount', '', null, '30', null, '100', 'Early Bird - Middle Park Hotel', 'EARLY_BIRD', '2026-03-24', '2027-03-24', '24');
INSERT INTO `hotel_pricing_rules` VALUES ('56', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', '', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('57', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Oceano Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('58', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - White Arena', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('59', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Douglas Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('60', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Royal Sea', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('61', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Loyal Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('62', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Holy Sky Hotels', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('63', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Sunrise Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('64', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Karmel Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('65', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Grand Tower', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('66', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Louis V Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('67', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Hilly Palace', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('68', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Al-Sheikh Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('69', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Round Palace', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('70', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - White Blocks', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('71', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Holy TalaHotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('72', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Sham House', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('73', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Royal Samiramis', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('74', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - See Wide Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('75', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Al-Malaki Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('76', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Outsider House', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('77', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Twin Tower Palace', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('78', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Hotel Indigo', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('79', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Hotel Hebron', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('80', '-5.00', 'Book within 3 days for 5% discount', '', null, '3', null, '90', 'Last Minute - Middle Park Hotel', 'LAST_MINUTE', '2026-03-24', '2027-03-24', '24');
INSERT INTO `hotel_pricing_rules` VALUES ('87', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', '', 'LONG_STAY', '2026-03-24', '2027-03-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('88', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Oceano Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('89', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - White Arena', 'LONG_STAY', '2026-03-24', '2027-03-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('90', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Douglas Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('91', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Royal Sea', 'LONG_STAY', '2026-03-24', '2027-03-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('92', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Loyal Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('93', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Holy Sky Hotels', 'LONG_STAY', '2026-03-24', '2027-03-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('94', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Sunrise Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('95', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Karmel Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('96', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Grand Tower', 'LONG_STAY', '2026-03-24', '2027-03-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('97', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Louis V Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('98', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Hilly Palace', 'LONG_STAY', '2026-03-24', '2027-03-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('99', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Al-Sheikh Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('100', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Round Palace', 'LONG_STAY', '2026-03-24', '2027-03-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('101', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - White Blocks', 'LONG_STAY', '2026-03-24', '2027-03-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('102', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Holy TalaHotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('103', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Sham House', 'LONG_STAY', '2026-03-24', '2027-03-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('104', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Royal Samiramis', 'LONG_STAY', '2026-03-24', '2027-03-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('105', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - See Wide Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('106', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Al-Malaki Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('107', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Outsider House', 'LONG_STAY', '2026-03-24', '2027-03-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('108', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Twin Tower Palace', 'LONG_STAY', '2026-03-24', '2027-03-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('109', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Hotel Indigo', 'LONG_STAY', '2026-03-24', '2027-03-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('110', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Hotel Hebron', 'LONG_STAY', '2026-03-24', '2027-03-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('111', '-15.00', 'Stay 7+ nights and get 15% discount', '', null, null, '7', '85', 'Long Stay - Middle Park Hotel', 'LONG_STAY', '2026-03-24', '2027-03-24', '24');
INSERT INTO `hotel_pricing_rules` VALUES ('118', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', '', 'WEEKEND', '2026-03-24', '2027-03-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('119', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Oceano Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('120', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - White Arena', 'WEEKEND', '2026-03-24', '2027-03-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('121', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Douglas Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('122', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Royal Sea', 'WEEKEND', '2026-03-24', '2027-03-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('123', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Loyal Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('124', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Holy Sky Hotels', 'WEEKEND', '2026-03-24', '2027-03-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('125', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Sunrise Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('126', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Karmel Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('127', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Grand Tower', 'WEEKEND', '2026-03-24', '2027-03-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('128', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Louis V Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('129', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Hilly Palace', 'WEEKEND', '2026-03-24', '2027-03-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('130', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Al-Sheikh Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('131', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Round Palace', 'WEEKEND', '2026-03-24', '2027-03-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('132', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - White Blocks', 'WEEKEND', '2026-03-24', '2027-03-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('133', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Holy TalaHotel', 'WEEKEND', '2026-03-24', '2027-03-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('134', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Sham House', 'WEEKEND', '2026-03-24', '2027-03-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('135', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Royal Samiramis', 'WEEKEND', '2026-03-24', '2027-03-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('136', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - See Wide Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('137', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Al-Malaki Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('138', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Outsider House', 'WEEKEND', '2026-03-24', '2027-03-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('139', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Twin Tower Palace', 'WEEKEND', '2026-03-24', '2027-03-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('140', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Hotel Indigo', 'WEEKEND', '2026-03-24', '2027-03-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('141', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Hotel Hebron', 'WEEKEND', '2026-03-24', '2027-03-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('142', '10.00', 'Weekend stays have 10% surcharge', '', null, null, null, '50', 'Weekend Surcharge - Middle Park Hotel', 'WEEKEND', '2026-03-24', '2027-03-24', '24');
INSERT INTO `hotel_pricing_rules` VALUES ('149', '10.00', 'Summer peak season surcharge', '', null, null, null, '60', '', 'SEASONAL', '2026-06-24', '2026-09-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('150', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Oceano Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('151', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - White Arena', 'SEASONAL', '2026-06-24', '2026-09-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('152', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Douglas Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('153', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Royal Sea', 'SEASONAL', '2026-06-24', '2026-09-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('154', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Loyal Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('155', '25.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Holy Sky Hotels', 'SEASONAL', '2026-06-24', '2026-09-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('156', '10.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Sunrise Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('157', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Karmel Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('158', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Grand Tower', 'SEASONAL', '2026-06-24', '2026-09-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('159', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Louis V Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('160', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Hilly Palace', 'SEASONAL', '2026-06-24', '2026-09-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('161', '25.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Al-Sheikh Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('162', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Round Palace', 'SEASONAL', '2026-06-24', '2026-09-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('163', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - White Blocks', 'SEASONAL', '2026-06-24', '2026-09-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('164', '25.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Holy TalaHotel', 'SEASONAL', '2026-06-24', '2026-09-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('165', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Sham House', 'SEASONAL', '2026-06-24', '2026-09-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('166', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Royal Samiramis', 'SEASONAL', '2026-06-24', '2026-09-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('167', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - See Wide Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('168', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Al-Malaki Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('169', '25.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Outsider House', 'SEASONAL', '2026-06-24', '2026-09-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('170', '20.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Twin Tower Palace', 'SEASONAL', '2026-06-24', '2026-09-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('171', '15.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Hotel Indigo', 'SEASONAL', '2026-06-24', '2026-09-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('172', '10.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Hotel Hebron', 'SEASONAL', '2026-06-24', '2026-09-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('173', '10.00', 'Summer peak season surcharge', '', null, null, null, '60', 'Summer Peak - Middle Park Hotel', 'SEASONAL', '2026-06-24', '2026-09-24', '24');
INSERT INTO `hotel_pricing_rules` VALUES ('180', '30.00', 'Holiday season surcharge', '', null, null, null, '95', '', 'HOLIDAY', '2026-11-24', '2026-12-24', '0');
INSERT INTO `hotel_pricing_rules` VALUES ('181', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Oceano Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '1');
INSERT INTO `hotel_pricing_rules` VALUES ('182', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - White Arena', 'HOLIDAY', '2026-11-24', '2026-12-24', '2');
INSERT INTO `hotel_pricing_rules` VALUES ('183', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Douglas Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '3');
INSERT INTO `hotel_pricing_rules` VALUES ('184', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Royal Sea', 'HOLIDAY', '2026-11-24', '2026-12-24', '4');
INSERT INTO `hotel_pricing_rules` VALUES ('185', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Loyal Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '5');
INSERT INTO `hotel_pricing_rules` VALUES ('186', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Holy Sky Hotels', 'HOLIDAY', '2026-11-24', '2026-12-24', '6');
INSERT INTO `hotel_pricing_rules` VALUES ('187', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Sunrise Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '7');
INSERT INTO `hotel_pricing_rules` VALUES ('188', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Karmel Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '8');
INSERT INTO `hotel_pricing_rules` VALUES ('189', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Grand Tower', 'HOLIDAY', '2026-11-24', '2026-12-24', '9');
INSERT INTO `hotel_pricing_rules` VALUES ('190', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Louis V Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '10');
INSERT INTO `hotel_pricing_rules` VALUES ('191', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Hilly Palace', 'HOLIDAY', '2026-11-24', '2026-12-24', '11');
INSERT INTO `hotel_pricing_rules` VALUES ('192', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Al-Sheikh Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '12');
INSERT INTO `hotel_pricing_rules` VALUES ('193', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Round Palace', 'HOLIDAY', '2026-11-24', '2026-12-24', '13');
INSERT INTO `hotel_pricing_rules` VALUES ('194', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - White Blocks', 'HOLIDAY', '2026-11-24', '2026-12-24', '14');
INSERT INTO `hotel_pricing_rules` VALUES ('195', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Holy TalaHotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '15');
INSERT INTO `hotel_pricing_rules` VALUES ('196', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Sham House', 'HOLIDAY', '2026-11-24', '2026-12-24', '16');
INSERT INTO `hotel_pricing_rules` VALUES ('197', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Royal Samiramis', 'HOLIDAY', '2026-11-24', '2026-12-24', '17');
INSERT INTO `hotel_pricing_rules` VALUES ('198', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - See Wide Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '18');
INSERT INTO `hotel_pricing_rules` VALUES ('199', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Al-Malaki Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '19');
INSERT INTO `hotel_pricing_rules` VALUES ('200', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Outsider House', 'HOLIDAY', '2026-11-24', '2026-12-24', '20');
INSERT INTO `hotel_pricing_rules` VALUES ('201', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Twin Tower Palace', 'HOLIDAY', '2026-11-24', '2026-12-24', '21');
INSERT INTO `hotel_pricing_rules` VALUES ('202', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Hotel Indigo', 'HOLIDAY', '2026-11-24', '2026-12-24', '22');
INSERT INTO `hotel_pricing_rules` VALUES ('203', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Hotel Hebron', 'HOLIDAY', '2026-11-24', '2026-12-24', '23');
INSERT INTO `hotel_pricing_rules` VALUES ('204', '30.00', 'Holiday season surcharge', '', null, null, null, '95', 'Holiday Season - Middle Park Hotel', 'HOLIDAY', '2026-11-24', '2026-12-24', '24');

-- ----------------------------
-- Table structure for `hotel_pricing_rule_days`
-- ----------------------------
DROP TABLE IF EXISTS `hotel_pricing_rule_days`;
CREATE TABLE `hotel_pricing_rule_days` (
  `rule_id` bigint(20) NOT NULL,
  `day_of_week` enum('MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY','SUNDAY') DEFAULT NULL,
  KEY `FKocqg8t51j5fy0v71q3lg25ve9` (`rule_id`),
  CONSTRAINT `FKocqg8t51j5fy0v71q3lg25ve9` FOREIGN KEY (`rule_id`) REFERENCES `hotel_pricing_rules` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of hotel_pricing_rule_days
-- ----------------------------
INSERT INTO `hotel_pricing_rule_days` VALUES ('118', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('119', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('120', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('121', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('122', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('123', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('124', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('125', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('126', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('127', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('128', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('129', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('130', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('131', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('132', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('133', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('134', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('135', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('136', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('137', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('138', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('139', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('140', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('141', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('142', 'SATURDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('118', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('119', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('120', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('121', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('122', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('123', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('124', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('125', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('126', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('127', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('128', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('129', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('130', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('131', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('132', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('133', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('134', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('135', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('136', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('137', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('138', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('139', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('140', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('141', 'SUNDAY');
INSERT INTO `hotel_pricing_rule_days` VALUES ('142', 'SUNDAY');

-- ----------------------------
-- Table structure for `notifications`
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` varchar(1000) NOT NULL,
  `read_at` datetime(6) DEFAULT NULL,
  `type` varchar(255) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK87r43mlyr9nnth3xbf0li1ij3` (`booking_id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK87r43mlyr9nnth3xbf0li1ij3` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of notifications
-- ----------------------------

-- ----------------------------
-- Table structure for `payment`
-- ----------------------------
DROP TABLE IF EXISTS `payment`;
CREATE TABLE `payment` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `amount` double NOT NULL,
  `method` enum('CASH','CREDIT_CARD','DEBIT_CARD','PAYPAL','BANK_TRANSFER') DEFAULT NULL,
  `status` enum('PENDING','COMPLETED','FAILED') DEFAULT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3imypmkldr75bb2ijui4ir77g` (`booking_id`),
  CONSTRAINT `FK3imypmkldr75bb2ijui4ir77g` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of payment
-- ----------------------------

-- ----------------------------
-- Table structure for `ratings`
-- ----------------------------
DROP TABLE IF EXISTS `ratings`;
CREATE TABLE `ratings` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `comment` varchar(1000) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `score` int(11) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `booking_id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `hotel_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK42c9qv60jm7w54loebwiyo7p9` (`customer_id`,`booking_id`),
  KEY `FKkp31uofkhlk6pvyvmu3xcblkk` (`booking_id`),
  KEY `FKsb06hawkq6kikfuvlg3mxircv` (`hotel_id`),
  CONSTRAINT `FKkp31uofkhlk6pvyvmu3xcblkk` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  CONSTRAINT `FKl4khx88jtvmxkvnt3elik528p` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKsb06hawkq6kikfuvlg3mxircv` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of ratings
-- ----------------------------

-- ----------------------------
-- Table structure for `rooms`
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `room_number` varchar(255) NOT NULL,
  `room_status` enum('AVAILABLE','MAINTENANCE','DEACTIVATED') NOT NULL,
  `room_type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKh9m2n1paq5hmd3u0klfl7wsfv` (`room_type_id`),
  CONSTRAINT `FKh9m2n1paq5hmd3u0klfl7wsfv` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=376 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES ('1', 'SI00A01', 'AVAILABLE', '25');
INSERT INTO `rooms` VALUES ('2', 'SI00A02', 'AVAILABLE', '25');
INSERT INTO `rooms` VALUES ('3', 'SI00A03', 'AVAILABLE', '25');
INSERT INTO `rooms` VALUES ('4', 'DO00B01', 'AVAILABLE', '26');
INSERT INTO `rooms` VALUES ('5', 'DO00B02', 'AVAILABLE', '26');
INSERT INTO `rooms` VALUES ('6', 'DO00B03', 'AVAILABLE', '26');
INSERT INTO `rooms` VALUES ('7', 'TW00C01', 'AVAILABLE', '27');
INSERT INTO `rooms` VALUES ('8', 'TW00C02', 'AVAILABLE', '27');
INSERT INTO `rooms` VALUES ('9', 'TW00C03', 'AVAILABLE', '27');
INSERT INTO `rooms` VALUES ('10', 'TR00D01', 'AVAILABLE', '28');
INSERT INTO `rooms` VALUES ('11', 'TR00D02', 'AVAILABLE', '28');
INSERT INTO `rooms` VALUES ('12', 'TR00D03', 'AVAILABLE', '28');
INSERT INTO `rooms` VALUES ('13', 'FA00E01', 'AVAILABLE', '29');
INSERT INTO `rooms` VALUES ('14', 'FA00E02', 'AVAILABLE', '29');
INSERT INTO `rooms` VALUES ('15', 'FA00E03', 'AVAILABLE', '29');
INSERT INTO `rooms` VALUES ('16', 'SI01A01', 'AVAILABLE', '30');
INSERT INTO `rooms` VALUES ('17', 'SI01A02', 'AVAILABLE', '30');
INSERT INTO `rooms` VALUES ('18', 'SI01A03', 'AVAILABLE', '30');
INSERT INTO `rooms` VALUES ('19', 'DO01B01', 'AVAILABLE', '31');
INSERT INTO `rooms` VALUES ('20', 'DO01B02', 'AVAILABLE', '31');
INSERT INTO `rooms` VALUES ('21', 'DO01B03', 'AVAILABLE', '31');
INSERT INTO `rooms` VALUES ('22', 'TW01C01', 'AVAILABLE', '32');
INSERT INTO `rooms` VALUES ('23', 'TW01C02', 'AVAILABLE', '32');
INSERT INTO `rooms` VALUES ('24', 'TW01C03', 'AVAILABLE', '32');
INSERT INTO `rooms` VALUES ('25', 'TR01D01', 'AVAILABLE', '33');
INSERT INTO `rooms` VALUES ('26', 'TR01D02', 'AVAILABLE', '33');
INSERT INTO `rooms` VALUES ('27', 'TR01D03', 'AVAILABLE', '33');
INSERT INTO `rooms` VALUES ('28', 'FA01E01', 'AVAILABLE', '34');
INSERT INTO `rooms` VALUES ('29', 'FA01E02', 'AVAILABLE', '34');
INSERT INTO `rooms` VALUES ('30', 'FA01E03', 'AVAILABLE', '34');
INSERT INTO `rooms` VALUES ('31', 'SI02A01', 'AVAILABLE', '35');
INSERT INTO `rooms` VALUES ('32', 'SI02A02', 'AVAILABLE', '35');
INSERT INTO `rooms` VALUES ('33', 'SI02A03', 'AVAILABLE', '35');
INSERT INTO `rooms` VALUES ('34', 'DO02B01', 'AVAILABLE', '36');
INSERT INTO `rooms` VALUES ('35', 'DO02B02', 'AVAILABLE', '36');
INSERT INTO `rooms` VALUES ('36', 'DO02B03', 'AVAILABLE', '36');
INSERT INTO `rooms` VALUES ('37', 'TW02C01', 'AVAILABLE', '37');
INSERT INTO `rooms` VALUES ('38', 'TW02C02', 'AVAILABLE', '37');
INSERT INTO `rooms` VALUES ('39', 'TW02C03', 'AVAILABLE', '37');
INSERT INTO `rooms` VALUES ('40', 'TR02D01', 'AVAILABLE', '38');
INSERT INTO `rooms` VALUES ('41', 'TR02D02', 'AVAILABLE', '38');
INSERT INTO `rooms` VALUES ('42', 'TR02D03', 'AVAILABLE', '38');
INSERT INTO `rooms` VALUES ('43', 'FA02E01', 'AVAILABLE', '39');
INSERT INTO `rooms` VALUES ('44', 'FA02E02', 'AVAILABLE', '39');
INSERT INTO `rooms` VALUES ('45', 'FA02E03', 'AVAILABLE', '39');
INSERT INTO `rooms` VALUES ('46', 'SI03A01', 'AVAILABLE', '40');
INSERT INTO `rooms` VALUES ('47', 'SI03A02', 'AVAILABLE', '40');
INSERT INTO `rooms` VALUES ('48', 'SI03A03', 'AVAILABLE', '40');
INSERT INTO `rooms` VALUES ('49', 'DO03B01', 'AVAILABLE', '41');
INSERT INTO `rooms` VALUES ('50', 'DO03B02', 'AVAILABLE', '41');
INSERT INTO `rooms` VALUES ('51', 'DO03B03', 'AVAILABLE', '41');
INSERT INTO `rooms` VALUES ('52', 'TW03C01', 'AVAILABLE', '42');
INSERT INTO `rooms` VALUES ('53', 'TW03C02', 'AVAILABLE', '42');
INSERT INTO `rooms` VALUES ('54', 'TW03C03', 'AVAILABLE', '42');
INSERT INTO `rooms` VALUES ('55', 'TR03D01', 'AVAILABLE', '43');
INSERT INTO `rooms` VALUES ('56', 'TR03D02', 'AVAILABLE', '43');
INSERT INTO `rooms` VALUES ('57', 'TR03D03', 'AVAILABLE', '43');
INSERT INTO `rooms` VALUES ('58', 'FA03E01', 'AVAILABLE', '44');
INSERT INTO `rooms` VALUES ('59', 'FA03E02', 'AVAILABLE', '44');
INSERT INTO `rooms` VALUES ('60', 'FA03E03', 'AVAILABLE', '44');
INSERT INTO `rooms` VALUES ('61', 'SI04A01', 'AVAILABLE', '45');
INSERT INTO `rooms` VALUES ('62', 'SI04A02', 'AVAILABLE', '45');
INSERT INTO `rooms` VALUES ('63', 'SI04A03', 'AVAILABLE', '45');
INSERT INTO `rooms` VALUES ('64', 'DO04B01', 'AVAILABLE', '46');
INSERT INTO `rooms` VALUES ('65', 'DO04B02', 'AVAILABLE', '46');
INSERT INTO `rooms` VALUES ('66', 'DO04B03', 'AVAILABLE', '46');
INSERT INTO `rooms` VALUES ('67', 'TW04C01', 'AVAILABLE', '47');
INSERT INTO `rooms` VALUES ('68', 'TW04C02', 'AVAILABLE', '47');
INSERT INTO `rooms` VALUES ('69', 'TW04C03', 'AVAILABLE', '47');
INSERT INTO `rooms` VALUES ('70', 'TR04D01', 'AVAILABLE', '48');
INSERT INTO `rooms` VALUES ('71', 'TR04D02', 'AVAILABLE', '48');
INSERT INTO `rooms` VALUES ('72', 'TR04D03', 'AVAILABLE', '48');
INSERT INTO `rooms` VALUES ('73', 'FA04E01', 'AVAILABLE', '49');
INSERT INTO `rooms` VALUES ('74', 'FA04E02', 'AVAILABLE', '49');
INSERT INTO `rooms` VALUES ('75', 'FA04E03', 'AVAILABLE', '49');
INSERT INTO `rooms` VALUES ('76', 'SI05A01', 'AVAILABLE', '50');
INSERT INTO `rooms` VALUES ('77', 'SI05A02', 'AVAILABLE', '50');
INSERT INTO `rooms` VALUES ('78', 'SI05A03', 'AVAILABLE', '50');
INSERT INTO `rooms` VALUES ('79', 'DO05B01', 'AVAILABLE', '51');
INSERT INTO `rooms` VALUES ('80', 'DO05B02', 'AVAILABLE', '51');
INSERT INTO `rooms` VALUES ('81', 'DO05B03', 'AVAILABLE', '51');
INSERT INTO `rooms` VALUES ('82', 'TW05C01', 'AVAILABLE', '52');
INSERT INTO `rooms` VALUES ('83', 'TW05C02', 'AVAILABLE', '52');
INSERT INTO `rooms` VALUES ('84', 'TW05C03', 'AVAILABLE', '52');
INSERT INTO `rooms` VALUES ('85', 'TR05D01', 'AVAILABLE', '53');
INSERT INTO `rooms` VALUES ('86', 'TR05D02', 'AVAILABLE', '53');
INSERT INTO `rooms` VALUES ('87', 'TR05D03', 'AVAILABLE', '53');
INSERT INTO `rooms` VALUES ('88', 'FA05E01', 'AVAILABLE', '54');
INSERT INTO `rooms` VALUES ('89', 'FA05E02', 'AVAILABLE', '54');
INSERT INTO `rooms` VALUES ('90', 'FA05E03', 'AVAILABLE', '54');
INSERT INTO `rooms` VALUES ('91', 'SI06A01', 'AVAILABLE', '55');
INSERT INTO `rooms` VALUES ('92', 'SI06A02', 'AVAILABLE', '55');
INSERT INTO `rooms` VALUES ('93', 'SI06A03', 'AVAILABLE', '55');
INSERT INTO `rooms` VALUES ('94', 'DO06B01', 'AVAILABLE', '56');
INSERT INTO `rooms` VALUES ('95', 'DO06B02', 'AVAILABLE', '56');
INSERT INTO `rooms` VALUES ('96', 'DO06B03', 'AVAILABLE', '56');
INSERT INTO `rooms` VALUES ('97', 'TW06C01', 'AVAILABLE', '57');
INSERT INTO `rooms` VALUES ('98', 'TW06C02', 'AVAILABLE', '57');
INSERT INTO `rooms` VALUES ('99', 'TW06C03', 'AVAILABLE', '57');
INSERT INTO `rooms` VALUES ('100', 'TR06D01', 'AVAILABLE', '58');
INSERT INTO `rooms` VALUES ('101', 'TR06D02', 'AVAILABLE', '58');
INSERT INTO `rooms` VALUES ('102', 'TR06D03', 'AVAILABLE', '58');
INSERT INTO `rooms` VALUES ('103', 'FA06E01', 'AVAILABLE', '59');
INSERT INTO `rooms` VALUES ('104', 'FA06E02', 'AVAILABLE', '59');
INSERT INTO `rooms` VALUES ('105', 'FA06E03', 'AVAILABLE', '59');
INSERT INTO `rooms` VALUES ('106', 'SI07A01', 'AVAILABLE', '60');
INSERT INTO `rooms` VALUES ('107', 'SI07A02', 'AVAILABLE', '60');
INSERT INTO `rooms` VALUES ('108', 'SI07A03', 'AVAILABLE', '60');
INSERT INTO `rooms` VALUES ('109', 'DO07B01', 'AVAILABLE', '61');
INSERT INTO `rooms` VALUES ('110', 'DO07B02', 'AVAILABLE', '61');
INSERT INTO `rooms` VALUES ('111', 'DO07B03', 'AVAILABLE', '61');
INSERT INTO `rooms` VALUES ('112', 'TW07C01', 'AVAILABLE', '62');
INSERT INTO `rooms` VALUES ('113', 'TW07C02', 'AVAILABLE', '62');
INSERT INTO `rooms` VALUES ('114', 'TW07C03', 'AVAILABLE', '62');
INSERT INTO `rooms` VALUES ('115', 'TR07D01', 'AVAILABLE', '63');
INSERT INTO `rooms` VALUES ('116', 'TR07D02', 'AVAILABLE', '63');
INSERT INTO `rooms` VALUES ('117', 'TR07D03', 'AVAILABLE', '63');
INSERT INTO `rooms` VALUES ('118', 'FA07E01', 'AVAILABLE', '64');
INSERT INTO `rooms` VALUES ('119', 'FA07E02', 'AVAILABLE', '64');
INSERT INTO `rooms` VALUES ('120', 'FA07E03', 'AVAILABLE', '64');
INSERT INTO `rooms` VALUES ('121', 'SI08A01', 'AVAILABLE', '65');
INSERT INTO `rooms` VALUES ('122', 'SI08A02', 'AVAILABLE', '65');
INSERT INTO `rooms` VALUES ('123', 'SI08A03', 'AVAILABLE', '65');
INSERT INTO `rooms` VALUES ('124', 'DO08B01', 'AVAILABLE', '66');
INSERT INTO `rooms` VALUES ('125', 'DO08B02', 'AVAILABLE', '66');
INSERT INTO `rooms` VALUES ('126', 'DO08B03', 'AVAILABLE', '66');
INSERT INTO `rooms` VALUES ('127', 'TW08C01', 'AVAILABLE', '67');
INSERT INTO `rooms` VALUES ('128', 'TW08C02', 'AVAILABLE', '67');
INSERT INTO `rooms` VALUES ('129', 'TW08C03', 'AVAILABLE', '67');
INSERT INTO `rooms` VALUES ('130', 'TR08D01', 'AVAILABLE', '68');
INSERT INTO `rooms` VALUES ('131', 'TR08D02', 'AVAILABLE', '68');
INSERT INTO `rooms` VALUES ('132', 'TR08D03', 'AVAILABLE', '68');
INSERT INTO `rooms` VALUES ('133', 'FA08E01', 'AVAILABLE', '69');
INSERT INTO `rooms` VALUES ('134', 'FA08E02', 'AVAILABLE', '69');
INSERT INTO `rooms` VALUES ('135', 'FA08E03', 'AVAILABLE', '69');
INSERT INTO `rooms` VALUES ('136', 'SI09A01', 'AVAILABLE', '70');
INSERT INTO `rooms` VALUES ('137', 'SI09A02', 'AVAILABLE', '70');
INSERT INTO `rooms` VALUES ('138', 'SI09A03', 'AVAILABLE', '70');
INSERT INTO `rooms` VALUES ('139', 'DO09B01', 'AVAILABLE', '71');
INSERT INTO `rooms` VALUES ('140', 'DO09B02', 'AVAILABLE', '71');
INSERT INTO `rooms` VALUES ('141', 'DO09B03', 'AVAILABLE', '71');
INSERT INTO `rooms` VALUES ('142', 'TW09C01', 'AVAILABLE', '72');
INSERT INTO `rooms` VALUES ('143', 'TW09C02', 'AVAILABLE', '72');
INSERT INTO `rooms` VALUES ('144', 'TW09C03', 'AVAILABLE', '72');
INSERT INTO `rooms` VALUES ('145', 'TR09D01', 'AVAILABLE', '73');
INSERT INTO `rooms` VALUES ('146', 'TR09D02', 'AVAILABLE', '73');
INSERT INTO `rooms` VALUES ('147', 'TR09D03', 'AVAILABLE', '73');
INSERT INTO `rooms` VALUES ('148', 'FA09E01', 'AVAILABLE', '74');
INSERT INTO `rooms` VALUES ('149', 'FA09E02', 'AVAILABLE', '74');
INSERT INTO `rooms` VALUES ('150', 'FA09E03', 'AVAILABLE', '74');
INSERT INTO `rooms` VALUES ('151', 'SI10A01', 'AVAILABLE', '75');
INSERT INTO `rooms` VALUES ('152', 'SI10A02', 'AVAILABLE', '75');
INSERT INTO `rooms` VALUES ('153', 'SI10A03', 'AVAILABLE', '75');
INSERT INTO `rooms` VALUES ('154', 'DO10B01', 'AVAILABLE', '76');
INSERT INTO `rooms` VALUES ('155', 'DO10B02', 'AVAILABLE', '76');
INSERT INTO `rooms` VALUES ('156', 'DO10B03', 'AVAILABLE', '76');
INSERT INTO `rooms` VALUES ('157', 'TW10C01', 'AVAILABLE', '77');
INSERT INTO `rooms` VALUES ('158', 'TW10C02', 'AVAILABLE', '77');
INSERT INTO `rooms` VALUES ('159', 'TW10C03', 'AVAILABLE', '77');
INSERT INTO `rooms` VALUES ('160', 'TR10D01', 'AVAILABLE', '78');
INSERT INTO `rooms` VALUES ('161', 'TR10D02', 'AVAILABLE', '78');
INSERT INTO `rooms` VALUES ('162', 'TR10D03', 'AVAILABLE', '78');
INSERT INTO `rooms` VALUES ('163', 'FA10E01', 'AVAILABLE', '79');
INSERT INTO `rooms` VALUES ('164', 'FA10E02', 'AVAILABLE', '79');
INSERT INTO `rooms` VALUES ('165', 'FA10E03', 'AVAILABLE', '79');
INSERT INTO `rooms` VALUES ('166', 'SI11A01', 'AVAILABLE', '80');
INSERT INTO `rooms` VALUES ('167', 'SI11A02', 'AVAILABLE', '80');
INSERT INTO `rooms` VALUES ('168', 'SI11A03', 'AVAILABLE', '80');
INSERT INTO `rooms` VALUES ('169', 'DO11B01', 'AVAILABLE', '81');
INSERT INTO `rooms` VALUES ('170', 'DO11B02', 'AVAILABLE', '81');
INSERT INTO `rooms` VALUES ('171', 'DO11B03', 'AVAILABLE', '81');
INSERT INTO `rooms` VALUES ('172', 'TW11C01', 'AVAILABLE', '82');
INSERT INTO `rooms` VALUES ('173', 'TW11C02', 'AVAILABLE', '82');
INSERT INTO `rooms` VALUES ('174', 'TW11C03', 'AVAILABLE', '82');
INSERT INTO `rooms` VALUES ('175', 'TR11D01', 'AVAILABLE', '83');
INSERT INTO `rooms` VALUES ('176', 'TR11D02', 'AVAILABLE', '83');
INSERT INTO `rooms` VALUES ('177', 'TR11D03', 'AVAILABLE', '83');
INSERT INTO `rooms` VALUES ('178', 'FA11E01', 'AVAILABLE', '84');
INSERT INTO `rooms` VALUES ('179', 'FA11E02', 'AVAILABLE', '84');
INSERT INTO `rooms` VALUES ('180', 'FA11E03', 'AVAILABLE', '84');
INSERT INTO `rooms` VALUES ('181', 'SI12A01', 'AVAILABLE', '85');
INSERT INTO `rooms` VALUES ('182', 'SI12A02', 'AVAILABLE', '85');
INSERT INTO `rooms` VALUES ('183', 'SI12A03', 'AVAILABLE', '85');
INSERT INTO `rooms` VALUES ('184', 'DO12B01', 'AVAILABLE', '86');
INSERT INTO `rooms` VALUES ('185', 'DO12B02', 'AVAILABLE', '86');
INSERT INTO `rooms` VALUES ('186', 'DO12B03', 'AVAILABLE', '86');
INSERT INTO `rooms` VALUES ('187', 'TW12C01', 'AVAILABLE', '87');
INSERT INTO `rooms` VALUES ('188', 'TW12C02', 'AVAILABLE', '87');
INSERT INTO `rooms` VALUES ('189', 'TW12C03', 'AVAILABLE', '87');
INSERT INTO `rooms` VALUES ('190', 'TR12D01', 'AVAILABLE', '88');
INSERT INTO `rooms` VALUES ('191', 'TR12D02', 'AVAILABLE', '88');
INSERT INTO `rooms` VALUES ('192', 'TR12D03', 'AVAILABLE', '88');
INSERT INTO `rooms` VALUES ('193', 'FA12E01', 'AVAILABLE', '89');
INSERT INTO `rooms` VALUES ('194', 'FA12E02', 'AVAILABLE', '89');
INSERT INTO `rooms` VALUES ('195', 'FA12E03', 'AVAILABLE', '89');
INSERT INTO `rooms` VALUES ('196', 'SI13A01', 'AVAILABLE', '90');
INSERT INTO `rooms` VALUES ('197', 'SI13A02', 'AVAILABLE', '90');
INSERT INTO `rooms` VALUES ('198', 'SI13A03', 'AVAILABLE', '90');
INSERT INTO `rooms` VALUES ('199', 'DO13B01', 'AVAILABLE', '91');
INSERT INTO `rooms` VALUES ('200', 'DO13B02', 'AVAILABLE', '91');
INSERT INTO `rooms` VALUES ('201', 'DO13B03', 'AVAILABLE', '91');
INSERT INTO `rooms` VALUES ('202', 'TW13C01', 'AVAILABLE', '92');
INSERT INTO `rooms` VALUES ('203', 'TW13C02', 'AVAILABLE', '92');
INSERT INTO `rooms` VALUES ('204', 'TW13C03', 'AVAILABLE', '92');
INSERT INTO `rooms` VALUES ('205', 'TR13D01', 'AVAILABLE', '93');
INSERT INTO `rooms` VALUES ('206', 'TR13D02', 'AVAILABLE', '93');
INSERT INTO `rooms` VALUES ('207', 'TR13D03', 'AVAILABLE', '93');
INSERT INTO `rooms` VALUES ('208', 'FA13E01', 'AVAILABLE', '94');
INSERT INTO `rooms` VALUES ('209', 'FA13E02', 'AVAILABLE', '94');
INSERT INTO `rooms` VALUES ('210', 'FA13E03', 'AVAILABLE', '94');
INSERT INTO `rooms` VALUES ('211', 'SI14A01', 'AVAILABLE', '95');
INSERT INTO `rooms` VALUES ('212', 'SI14A02', 'AVAILABLE', '95');
INSERT INTO `rooms` VALUES ('213', 'SI14A03', 'AVAILABLE', '95');
INSERT INTO `rooms` VALUES ('214', 'DO14B01', 'AVAILABLE', '96');
INSERT INTO `rooms` VALUES ('215', 'DO14B02', 'AVAILABLE', '96');
INSERT INTO `rooms` VALUES ('216', 'DO14B03', 'AVAILABLE', '96');
INSERT INTO `rooms` VALUES ('217', 'TW14C01', 'AVAILABLE', '97');
INSERT INTO `rooms` VALUES ('218', 'TW14C02', 'AVAILABLE', '97');
INSERT INTO `rooms` VALUES ('219', 'TW14C03', 'AVAILABLE', '97');
INSERT INTO `rooms` VALUES ('220', 'TR14D01', 'AVAILABLE', '98');
INSERT INTO `rooms` VALUES ('221', 'TR14D02', 'AVAILABLE', '98');
INSERT INTO `rooms` VALUES ('222', 'TR14D03', 'AVAILABLE', '98');
INSERT INTO `rooms` VALUES ('223', 'FA14E01', 'AVAILABLE', '99');
INSERT INTO `rooms` VALUES ('224', 'FA14E02', 'AVAILABLE', '99');
INSERT INTO `rooms` VALUES ('225', 'FA14E03', 'AVAILABLE', '99');
INSERT INTO `rooms` VALUES ('226', 'SI15A01', 'AVAILABLE', '100');
INSERT INTO `rooms` VALUES ('227', 'SI15A02', 'AVAILABLE', '100');
INSERT INTO `rooms` VALUES ('228', 'SI15A03', 'AVAILABLE', '100');
INSERT INTO `rooms` VALUES ('229', 'DO15B01', 'AVAILABLE', '101');
INSERT INTO `rooms` VALUES ('230', 'DO15B02', 'AVAILABLE', '101');
INSERT INTO `rooms` VALUES ('231', 'DO15B03', 'AVAILABLE', '101');
INSERT INTO `rooms` VALUES ('232', 'TW15C01', 'AVAILABLE', '102');
INSERT INTO `rooms` VALUES ('233', 'TW15C02', 'AVAILABLE', '102');
INSERT INTO `rooms` VALUES ('234', 'TW15C03', 'AVAILABLE', '102');
INSERT INTO `rooms` VALUES ('235', 'TR15D01', 'AVAILABLE', '103');
INSERT INTO `rooms` VALUES ('236', 'TR15D02', 'AVAILABLE', '103');
INSERT INTO `rooms` VALUES ('237', 'TR15D03', 'AVAILABLE', '103');
INSERT INTO `rooms` VALUES ('238', 'FA15E01', 'AVAILABLE', '104');
INSERT INTO `rooms` VALUES ('239', 'FA15E02', 'AVAILABLE', '104');
INSERT INTO `rooms` VALUES ('240', 'FA15E03', 'AVAILABLE', '104');
INSERT INTO `rooms` VALUES ('241', 'SI16A01', 'AVAILABLE', '105');
INSERT INTO `rooms` VALUES ('242', 'SI16A02', 'AVAILABLE', '105');
INSERT INTO `rooms` VALUES ('243', 'SI16A03', 'AVAILABLE', '105');
INSERT INTO `rooms` VALUES ('244', 'DO16B01', 'AVAILABLE', '106');
INSERT INTO `rooms` VALUES ('245', 'DO16B02', 'AVAILABLE', '106');
INSERT INTO `rooms` VALUES ('246', 'DO16B03', 'AVAILABLE', '106');
INSERT INTO `rooms` VALUES ('247', 'TW16C01', 'AVAILABLE', '107');
INSERT INTO `rooms` VALUES ('248', 'TW16C02', 'AVAILABLE', '107');
INSERT INTO `rooms` VALUES ('249', 'TW16C03', 'AVAILABLE', '107');
INSERT INTO `rooms` VALUES ('250', 'TR16D01', 'AVAILABLE', '108');
INSERT INTO `rooms` VALUES ('251', 'TR16D02', 'AVAILABLE', '108');
INSERT INTO `rooms` VALUES ('252', 'TR16D03', 'AVAILABLE', '108');
INSERT INTO `rooms` VALUES ('253', 'FA16E01', 'AVAILABLE', '109');
INSERT INTO `rooms` VALUES ('254', 'FA16E02', 'AVAILABLE', '109');
INSERT INTO `rooms` VALUES ('255', 'FA16E03', 'AVAILABLE', '109');
INSERT INTO `rooms` VALUES ('256', 'SI17A01', 'AVAILABLE', '110');
INSERT INTO `rooms` VALUES ('257', 'SI17A02', 'AVAILABLE', '110');
INSERT INTO `rooms` VALUES ('258', 'SI17A03', 'AVAILABLE', '110');
INSERT INTO `rooms` VALUES ('259', 'DO17B01', 'AVAILABLE', '111');
INSERT INTO `rooms` VALUES ('260', 'DO17B02', 'AVAILABLE', '111');
INSERT INTO `rooms` VALUES ('261', 'DO17B03', 'AVAILABLE', '111');
INSERT INTO `rooms` VALUES ('262', 'TW17C01', 'AVAILABLE', '112');
INSERT INTO `rooms` VALUES ('263', 'TW17C02', 'AVAILABLE', '112');
INSERT INTO `rooms` VALUES ('264', 'TW17C03', 'AVAILABLE', '112');
INSERT INTO `rooms` VALUES ('265', 'TR17D01', 'AVAILABLE', '113');
INSERT INTO `rooms` VALUES ('266', 'TR17D02', 'AVAILABLE', '113');
INSERT INTO `rooms` VALUES ('267', 'TR17D03', 'AVAILABLE', '113');
INSERT INTO `rooms` VALUES ('268', 'FA17E01', 'AVAILABLE', '114');
INSERT INTO `rooms` VALUES ('269', 'FA17E02', 'AVAILABLE', '114');
INSERT INTO `rooms` VALUES ('270', 'FA17E03', 'AVAILABLE', '114');
INSERT INTO `rooms` VALUES ('271', 'SI18A01', 'AVAILABLE', '115');
INSERT INTO `rooms` VALUES ('272', 'SI18A02', 'AVAILABLE', '115');
INSERT INTO `rooms` VALUES ('273', 'SI18A03', 'AVAILABLE', '115');
INSERT INTO `rooms` VALUES ('274', 'DO18B01', 'AVAILABLE', '116');
INSERT INTO `rooms` VALUES ('275', 'DO18B02', 'AVAILABLE', '116');
INSERT INTO `rooms` VALUES ('276', 'DO18B03', 'AVAILABLE', '116');
INSERT INTO `rooms` VALUES ('277', 'TW18C01', 'AVAILABLE', '117');
INSERT INTO `rooms` VALUES ('278', 'TW18C02', 'AVAILABLE', '117');
INSERT INTO `rooms` VALUES ('279', 'TW18C03', 'AVAILABLE', '117');
INSERT INTO `rooms` VALUES ('280', 'TR18D01', 'AVAILABLE', '118');
INSERT INTO `rooms` VALUES ('281', 'TR18D02', 'AVAILABLE', '118');
INSERT INTO `rooms` VALUES ('282', 'TR18D03', 'AVAILABLE', '118');
INSERT INTO `rooms` VALUES ('283', 'FA18E01', 'AVAILABLE', '119');
INSERT INTO `rooms` VALUES ('284', 'FA18E02', 'AVAILABLE', '119');
INSERT INTO `rooms` VALUES ('285', 'FA18E03', 'AVAILABLE', '119');
INSERT INTO `rooms` VALUES ('286', 'SI19A01', 'AVAILABLE', '120');
INSERT INTO `rooms` VALUES ('287', 'SI19A02', 'AVAILABLE', '120');
INSERT INTO `rooms` VALUES ('288', 'SI19A03', 'AVAILABLE', '120');
INSERT INTO `rooms` VALUES ('289', 'DO19B01', 'AVAILABLE', '121');
INSERT INTO `rooms` VALUES ('290', 'DO19B02', 'AVAILABLE', '121');
INSERT INTO `rooms` VALUES ('291', 'DO19B03', 'AVAILABLE', '121');
INSERT INTO `rooms` VALUES ('292', 'TW19C01', 'AVAILABLE', '122');
INSERT INTO `rooms` VALUES ('293', 'TW19C02', 'AVAILABLE', '122');
INSERT INTO `rooms` VALUES ('294', 'TW19C03', 'AVAILABLE', '122');
INSERT INTO `rooms` VALUES ('295', 'TR19D01', 'AVAILABLE', '123');
INSERT INTO `rooms` VALUES ('296', 'TR19D02', 'AVAILABLE', '123');
INSERT INTO `rooms` VALUES ('297', 'TR19D03', 'AVAILABLE', '123');
INSERT INTO `rooms` VALUES ('298', 'FA19E01', 'AVAILABLE', '124');
INSERT INTO `rooms` VALUES ('299', 'FA19E02', 'AVAILABLE', '124');
INSERT INTO `rooms` VALUES ('300', 'FA19E03', 'AVAILABLE', '124');
INSERT INTO `rooms` VALUES ('301', 'SI20A01', 'AVAILABLE', '125');
INSERT INTO `rooms` VALUES ('302', 'SI20A02', 'AVAILABLE', '125');
INSERT INTO `rooms` VALUES ('303', 'SI20A03', 'AVAILABLE', '125');
INSERT INTO `rooms` VALUES ('304', 'DO20B01', 'AVAILABLE', '126');
INSERT INTO `rooms` VALUES ('305', 'DO20B02', 'AVAILABLE', '126');
INSERT INTO `rooms` VALUES ('306', 'DO20B03', 'AVAILABLE', '126');
INSERT INTO `rooms` VALUES ('307', 'TW20C01', 'AVAILABLE', '127');
INSERT INTO `rooms` VALUES ('308', 'TW20C02', 'AVAILABLE', '127');
INSERT INTO `rooms` VALUES ('309', 'TW20C03', 'AVAILABLE', '127');
INSERT INTO `rooms` VALUES ('310', 'TR20D01', 'AVAILABLE', '128');
INSERT INTO `rooms` VALUES ('311', 'TR20D02', 'AVAILABLE', '128');
INSERT INTO `rooms` VALUES ('312', 'TR20D03', 'AVAILABLE', '128');
INSERT INTO `rooms` VALUES ('313', 'FA20E01', 'AVAILABLE', '129');
INSERT INTO `rooms` VALUES ('314', 'FA20E02', 'AVAILABLE', '129');
INSERT INTO `rooms` VALUES ('315', 'FA20E03', 'AVAILABLE', '129');
INSERT INTO `rooms` VALUES ('316', 'SI21A01', 'AVAILABLE', '130');
INSERT INTO `rooms` VALUES ('317', 'SI21A02', 'AVAILABLE', '130');
INSERT INTO `rooms` VALUES ('318', 'SI21A03', 'AVAILABLE', '130');
INSERT INTO `rooms` VALUES ('319', 'DO21B01', 'AVAILABLE', '131');
INSERT INTO `rooms` VALUES ('320', 'DO21B02', 'AVAILABLE', '131');
INSERT INTO `rooms` VALUES ('321', 'DO21B03', 'AVAILABLE', '131');
INSERT INTO `rooms` VALUES ('322', 'TW21C01', 'AVAILABLE', '132');
INSERT INTO `rooms` VALUES ('323', 'TW21C02', 'AVAILABLE', '132');
INSERT INTO `rooms` VALUES ('324', 'TW21C03', 'AVAILABLE', '132');
INSERT INTO `rooms` VALUES ('325', 'TR21D01', 'AVAILABLE', '133');
INSERT INTO `rooms` VALUES ('326', 'TR21D02', 'AVAILABLE', '133');
INSERT INTO `rooms` VALUES ('327', 'TR21D03', 'AVAILABLE', '133');
INSERT INTO `rooms` VALUES ('328', 'FA21E01', 'AVAILABLE', '134');
INSERT INTO `rooms` VALUES ('329', 'FA21E02', 'AVAILABLE', '134');
INSERT INTO `rooms` VALUES ('330', 'FA21E03', 'AVAILABLE', '134');
INSERT INTO `rooms` VALUES ('331', 'SI22A01', 'AVAILABLE', '135');
INSERT INTO `rooms` VALUES ('332', 'SI22A02', 'AVAILABLE', '135');
INSERT INTO `rooms` VALUES ('333', 'SI22A03', 'AVAILABLE', '135');
INSERT INTO `rooms` VALUES ('334', 'DO22B01', 'AVAILABLE', '136');
INSERT INTO `rooms` VALUES ('335', 'DO22B02', 'AVAILABLE', '136');
INSERT INTO `rooms` VALUES ('336', 'DO22B03', 'AVAILABLE', '136');
INSERT INTO `rooms` VALUES ('337', 'TW22C01', 'AVAILABLE', '137');
INSERT INTO `rooms` VALUES ('338', 'TW22C02', 'AVAILABLE', '137');
INSERT INTO `rooms` VALUES ('339', 'TW22C03', 'AVAILABLE', '137');
INSERT INTO `rooms` VALUES ('340', 'TR22D01', 'AVAILABLE', '138');
INSERT INTO `rooms` VALUES ('341', 'TR22D02', 'AVAILABLE', '138');
INSERT INTO `rooms` VALUES ('342', 'TR22D03', 'AVAILABLE', '138');
INSERT INTO `rooms` VALUES ('343', 'FA22E01', 'AVAILABLE', '139');
INSERT INTO `rooms` VALUES ('344', 'FA22E02', 'AVAILABLE', '139');
INSERT INTO `rooms` VALUES ('345', 'FA22E03', 'AVAILABLE', '139');
INSERT INTO `rooms` VALUES ('346', 'SI23A01', 'AVAILABLE', '140');
INSERT INTO `rooms` VALUES ('347', 'SI23A02', 'AVAILABLE', '140');
INSERT INTO `rooms` VALUES ('348', 'SI23A03', 'AVAILABLE', '140');
INSERT INTO `rooms` VALUES ('349', 'DO23B01', 'AVAILABLE', '141');
INSERT INTO `rooms` VALUES ('350', 'DO23B02', 'AVAILABLE', '141');
INSERT INTO `rooms` VALUES ('351', 'DO23B03', 'AVAILABLE', '141');
INSERT INTO `rooms` VALUES ('352', 'TW23C01', 'AVAILABLE', '142');
INSERT INTO `rooms` VALUES ('353', 'TW23C02', 'AVAILABLE', '142');
INSERT INTO `rooms` VALUES ('354', 'TW23C03', 'AVAILABLE', '142');
INSERT INTO `rooms` VALUES ('355', 'TR23D01', 'AVAILABLE', '143');
INSERT INTO `rooms` VALUES ('356', 'TR23D02', 'AVAILABLE', '143');
INSERT INTO `rooms` VALUES ('357', 'TR23D03', 'AVAILABLE', '143');
INSERT INTO `rooms` VALUES ('358', 'FA23E01', 'AVAILABLE', '144');
INSERT INTO `rooms` VALUES ('359', 'FA23E02', 'AVAILABLE', '144');
INSERT INTO `rooms` VALUES ('360', 'FA23E03', 'AVAILABLE', '144');
INSERT INTO `rooms` VALUES ('361', 'SI24A01', 'AVAILABLE', '145');
INSERT INTO `rooms` VALUES ('362', 'SI24A02', 'AVAILABLE', '145');
INSERT INTO `rooms` VALUES ('363', 'SI24A03', 'AVAILABLE', '145');
INSERT INTO `rooms` VALUES ('364', 'DO24B01', 'AVAILABLE', '146');
INSERT INTO `rooms` VALUES ('365', 'DO24B02', 'AVAILABLE', '146');
INSERT INTO `rooms` VALUES ('366', 'DO24B03', 'AVAILABLE', '146');
INSERT INTO `rooms` VALUES ('367', 'TW24C01', 'AVAILABLE', '147');
INSERT INTO `rooms` VALUES ('368', 'TW24C02', 'AVAILABLE', '147');
INSERT INTO `rooms` VALUES ('369', 'TW24C03', 'AVAILABLE', '147');
INSERT INTO `rooms` VALUES ('370', 'TR24D01', 'AVAILABLE', '148');
INSERT INTO `rooms` VALUES ('371', 'TR24D02', 'AVAILABLE', '148');
INSERT INTO `rooms` VALUES ('372', 'TR24D03', 'AVAILABLE', '148');
INSERT INTO `rooms` VALUES ('373', 'FA24E01', 'AVAILABLE', '149');
INSERT INTO `rooms` VALUES ('374', 'FA24E02', 'AVAILABLE', '149');
INSERT INTO `rooms` VALUES ('375', 'FA24E03', 'AVAILABLE', '149');

-- ----------------------------
-- Table structure for `room_types`
-- ----------------------------
DROP TABLE IF EXISTS `room_types`;
CREATE TABLE `room_types` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `base_price` decimal(10,2) NOT NULL,
  `capacity` enum('SINGLE','DOUBLE','TWIN','TRIPLE','QUAD','FAMILY') NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `room_type_name` varchar(255) NOT NULL,
  `hotel_id` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK42cc0t2sr43om89u1loqh7arj` (`hotel_id`),
  CONSTRAINT `FK42cc0t2sr43om89u1loqh7arj` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of room_types
-- ----------------------------
INSERT INTO `room_types` VALUES ('25', '0.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '0');
INSERT INTO `room_types` VALUES ('26', '0.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '0');
INSERT INTO `room_types` VALUES ('27', '0.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '0');
INSERT INTO `room_types` VALUES ('28', '0.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '0');
INSERT INTO `room_types` VALUES ('29', '0.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '0');
INSERT INTO `room_types` VALUES ('30', '112.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '1');
INSERT INTO `room_types` VALUES ('31', '168.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '1');
INSERT INTO `room_types` VALUES ('32', '179.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '1');
INSERT INTO `room_types` VALUES ('33', '224.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '1');
INSERT INTO `room_types` VALUES ('34', '280.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '1');
INSERT INTO `room_types` VALUES ('35', '105.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '2');
INSERT INTO `room_types` VALUES ('36', '157.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '2');
INSERT INTO `room_types` VALUES ('37', '168.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '2');
INSERT INTO `room_types` VALUES ('38', '210.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '2');
INSERT INTO `room_types` VALUES ('39', '262.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '2');
INSERT INTO `room_types` VALUES ('40', '108.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '3');
INSERT INTO `room_types` VALUES ('41', '162.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '3');
INSERT INTO `room_types` VALUES ('42', '172.80', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '3');
INSERT INTO `room_types` VALUES ('43', '216.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '3');
INSERT INTO `room_types` VALUES ('44', '270.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '3');
INSERT INTO `room_types` VALUES ('45', '111.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '4');
INSERT INTO `room_types` VALUES ('46', '166.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '4');
INSERT INTO `room_types` VALUES ('47', '177.60', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '4');
INSERT INTO `room_types` VALUES ('48', '222.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '4');
INSERT INTO `room_types` VALUES ('49', '277.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '4');
INSERT INTO `room_types` VALUES ('50', '102.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '5');
INSERT INTO `room_types` VALUES ('51', '153.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '5');
INSERT INTO `room_types` VALUES ('52', '163.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '5');
INSERT INTO `room_types` VALUES ('53', '204.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '5');
INSERT INTO `room_types` VALUES ('54', '255.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '5');
INSERT INTO `room_types` VALUES ('55', '117.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '6');
INSERT INTO `room_types` VALUES ('56', '175.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '6');
INSERT INTO `room_types` VALUES ('57', '187.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '6');
INSERT INTO `room_types` VALUES ('58', '234.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '6');
INSERT INTO `room_types` VALUES ('59', '292.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '6');
INSERT INTO `room_types` VALUES ('60', '98.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '7');
INSERT INTO `room_types` VALUES ('61', '147.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '7');
INSERT INTO `room_types` VALUES ('62', '156.80', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '7');
INSERT INTO `room_types` VALUES ('63', '196.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '7');
INSERT INTO `room_types` VALUES ('64', '245.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '7');
INSERT INTO `room_types` VALUES ('65', '104.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '8');
INSERT INTO `room_types` VALUES ('66', '156.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '8');
INSERT INTO `room_types` VALUES ('67', '166.40', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '8');
INSERT INTO `room_types` VALUES ('68', '208.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '8');
INSERT INTO `room_types` VALUES ('69', '260.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '8');
INSERT INTO `room_types` VALUES ('70', '110.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '9');
INSERT INTO `room_types` VALUES ('71', '165.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '9');
INSERT INTO `room_types` VALUES ('72', '176.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '9');
INSERT INTO `room_types` VALUES ('73', '220.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '9');
INSERT INTO `room_types` VALUES ('74', '275.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '9');
INSERT INTO `room_types` VALUES ('75', '107.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '10');
INSERT INTO `room_types` VALUES ('76', '160.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '10');
INSERT INTO `room_types` VALUES ('77', '171.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '10');
INSERT INTO `room_types` VALUES ('78', '214.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '10');
INSERT INTO `room_types` VALUES ('79', '267.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '10');
INSERT INTO `room_types` VALUES ('80', '111.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '11');
INSERT INTO `room_types` VALUES ('81', '166.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '11');
INSERT INTO `room_types` VALUES ('82', '177.60', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '11');
INSERT INTO `room_types` VALUES ('83', '222.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '11');
INSERT INTO `room_types` VALUES ('84', '277.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '11');
INSERT INTO `room_types` VALUES ('85', '119.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '12');
INSERT INTO `room_types` VALUES ('86', '178.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '12');
INSERT INTO `room_types` VALUES ('87', '190.40', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '12');
INSERT INTO `room_types` VALUES ('88', '238.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '12');
INSERT INTO `room_types` VALUES ('89', '297.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '12');
INSERT INTO `room_types` VALUES ('90', '100.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '13');
INSERT INTO `room_types` VALUES ('91', '150.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '13');
INSERT INTO `room_types` VALUES ('92', '160.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '13');
INSERT INTO `room_types` VALUES ('93', '200.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '13');
INSERT INTO `room_types` VALUES ('94', '250.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '13');
INSERT INTO `room_types` VALUES ('95', '102.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '14');
INSERT INTO `room_types` VALUES ('96', '153.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '14');
INSERT INTO `room_types` VALUES ('97', '163.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '14');
INSERT INTO `room_types` VALUES ('98', '204.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '14');
INSERT INTO `room_types` VALUES ('99', '255.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '14');
INSERT INTO `room_types` VALUES ('100', '115.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '15');
INSERT INTO `room_types` VALUES ('101', '172.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '15');
INSERT INTO `room_types` VALUES ('102', '184.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '15');
INSERT INTO `room_types` VALUES ('103', '230.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '15');
INSERT INTO `room_types` VALUES ('104', '287.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '15');
INSERT INTO `room_types` VALUES ('105', '108.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '16');
INSERT INTO `room_types` VALUES ('106', '162.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '16');
INSERT INTO `room_types` VALUES ('107', '172.80', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '16');
INSERT INTO `room_types` VALUES ('108', '216.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '16');
INSERT INTO `room_types` VALUES ('109', '270.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '16');
INSERT INTO `room_types` VALUES ('110', '102.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '17');
INSERT INTO `room_types` VALUES ('111', '153.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '17');
INSERT INTO `room_types` VALUES ('112', '163.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '17');
INSERT INTO `room_types` VALUES ('113', '204.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '17');
INSERT INTO `room_types` VALUES ('114', '255.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '17');
INSERT INTO `room_types` VALUES ('115', '111.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '18');
INSERT INTO `room_types` VALUES ('116', '166.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '18');
INSERT INTO `room_types` VALUES ('117', '177.60', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '18');
INSERT INTO `room_types` VALUES ('118', '222.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '18');
INSERT INTO `room_types` VALUES ('119', '277.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '18');
INSERT INTO `room_types` VALUES ('120', '107.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '19');
INSERT INTO `room_types` VALUES ('121', '160.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '19');
INSERT INTO `room_types` VALUES ('122', '171.20', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '19');
INSERT INTO `room_types` VALUES ('123', '214.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '19');
INSERT INTO `room_types` VALUES ('124', '267.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '19');
INSERT INTO `room_types` VALUES ('125', '115.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '20');
INSERT INTO `room_types` VALUES ('126', '172.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '20');
INSERT INTO `room_types` VALUES ('127', '184.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '20');
INSERT INTO `room_types` VALUES ('128', '230.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '20');
INSERT INTO `room_types` VALUES ('129', '287.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '20');
INSERT INTO `room_types` VALUES ('130', '110.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '21');
INSERT INTO `room_types` VALUES ('131', '165.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '21');
INSERT INTO `room_types` VALUES ('132', '176.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '21');
INSERT INTO `room_types` VALUES ('133', '220.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '21');
INSERT INTO `room_types` VALUES ('134', '275.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '21');
INSERT INTO `room_types` VALUES ('135', '101.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '22');
INSERT INTO `room_types` VALUES ('136', '151.50', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '22');
INSERT INTO `room_types` VALUES ('137', '161.60', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '22');
INSERT INTO `room_types` VALUES ('138', '202.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '22');
INSERT INTO `room_types` VALUES ('139', '252.50', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '22');
INSERT INTO `room_types` VALUES ('140', '98.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '23');
INSERT INTO `room_types` VALUES ('141', '147.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '23');
INSERT INTO `room_types` VALUES ('142', '156.80', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '23');
INSERT INTO `room_types` VALUES ('143', '196.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '23');
INSERT INTO `room_types` VALUES ('144', '245.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '23');
INSERT INTO `room_types` VALUES ('145', '90.00', 'SINGLE', '/images/room-types/single.jpg', 'SINGLE', '24');
INSERT INTO `room_types` VALUES ('146', '135.00', 'DOUBLE', '/images/room-types/double.jpg', 'DOUBLE', '24');
INSERT INTO `room_types` VALUES ('147', '144.00', 'TWIN', '/images/room-types/twin.jpg', 'TWIN', '24');
INSERT INTO `room_types` VALUES ('148', '180.00', 'TRIPLE', '/images/room-types/triple.jpg', 'TRIPLE', '24');
INSERT INTO `room_types` VALUES ('149', '225.00', 'FAMILY', '/images/room-types/family.jpg', 'FAMILY', '24');

-- ----------------------------
-- Table structure for `room_type_amenities`
-- ----------------------------
DROP TABLE IF EXISTS `room_type_amenities`;
CREATE TABLE `room_type_amenities` (
  `room_type_id` bigint(20) NOT NULL,
  `amenity` enum('WIFI','AIR_CONDITIONING','TV','MINI_BAR','ROOM_SERVICE','SWIMMING_POOL_ACCESS','GYM_ACCESS','BREAKFAST_INCLUDED','PARKING','PET_FRIENDLY','LAUNDRY_SERVICE','SPA_ACCESS','BALCONY','SEA_VIEW','KITCHENETTE','NON_SMOKING','DISABLED_ACCESS') DEFAULT NULL,
  KEY `FKdo00a57krcy83usnwd9xclxhk` (`room_type_id`),
  CONSTRAINT `FKdo00a57krcy83usnwd9xclxhk` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of room_type_amenities
-- ----------------------------
INSERT INTO `room_type_amenities` VALUES ('25', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('25', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('25', 'TV');
INSERT INTO `room_type_amenities` VALUES ('25', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('30', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('30', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('30', 'TV');
INSERT INTO `room_type_amenities` VALUES ('30', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('35', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('35', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('35', 'TV');
INSERT INTO `room_type_amenities` VALUES ('35', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('40', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('40', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('40', 'TV');
INSERT INTO `room_type_amenities` VALUES ('40', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('45', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('45', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('45', 'TV');
INSERT INTO `room_type_amenities` VALUES ('45', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('50', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('50', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('50', 'TV');
INSERT INTO `room_type_amenities` VALUES ('50', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('55', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('55', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('55', 'TV');
INSERT INTO `room_type_amenities` VALUES ('55', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('60', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('60', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('60', 'TV');
INSERT INTO `room_type_amenities` VALUES ('60', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('65', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('65', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('65', 'TV');
INSERT INTO `room_type_amenities` VALUES ('65', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('70', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('70', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('70', 'TV');
INSERT INTO `room_type_amenities` VALUES ('70', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('75', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('75', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('75', 'TV');
INSERT INTO `room_type_amenities` VALUES ('75', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('80', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('80', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('80', 'TV');
INSERT INTO `room_type_amenities` VALUES ('80', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('85', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('85', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('85', 'TV');
INSERT INTO `room_type_amenities` VALUES ('85', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('90', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('90', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('90', 'TV');
INSERT INTO `room_type_amenities` VALUES ('90', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('95', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('95', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('95', 'TV');
INSERT INTO `room_type_amenities` VALUES ('95', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('100', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('100', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('100', 'TV');
INSERT INTO `room_type_amenities` VALUES ('100', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('105', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('105', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('105', 'TV');
INSERT INTO `room_type_amenities` VALUES ('105', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('110', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('110', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('110', 'TV');
INSERT INTO `room_type_amenities` VALUES ('110', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('115', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('115', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('115', 'TV');
INSERT INTO `room_type_amenities` VALUES ('115', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('120', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('120', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('120', 'TV');
INSERT INTO `room_type_amenities` VALUES ('120', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('125', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('125', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('125', 'TV');
INSERT INTO `room_type_amenities` VALUES ('125', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('130', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('130', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('130', 'TV');
INSERT INTO `room_type_amenities` VALUES ('130', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('135', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('135', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('135', 'TV');
INSERT INTO `room_type_amenities` VALUES ('135', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('140', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('140', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('140', 'TV');
INSERT INTO `room_type_amenities` VALUES ('140', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('145', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('145', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('145', 'TV');
INSERT INTO `room_type_amenities` VALUES ('145', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('26', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('26', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('26', 'TV');
INSERT INTO `room_type_amenities` VALUES ('26', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('26', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('26', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('31', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('31', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('31', 'TV');
INSERT INTO `room_type_amenities` VALUES ('31', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('31', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('31', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('36', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('36', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('36', 'TV');
INSERT INTO `room_type_amenities` VALUES ('36', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('36', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('36', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('41', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('41', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('41', 'TV');
INSERT INTO `room_type_amenities` VALUES ('41', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('41', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('41', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('46', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('46', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('46', 'TV');
INSERT INTO `room_type_amenities` VALUES ('46', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('46', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('46', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('51', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('51', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('51', 'TV');
INSERT INTO `room_type_amenities` VALUES ('51', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('51', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('51', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('56', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('56', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('56', 'TV');
INSERT INTO `room_type_amenities` VALUES ('56', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('56', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('56', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('61', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('61', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('61', 'TV');
INSERT INTO `room_type_amenities` VALUES ('61', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('61', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('61', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('66', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('66', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('66', 'TV');
INSERT INTO `room_type_amenities` VALUES ('66', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('66', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('66', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('71', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('71', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('71', 'TV');
INSERT INTO `room_type_amenities` VALUES ('71', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('71', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('71', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('76', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('76', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('76', 'TV');
INSERT INTO `room_type_amenities` VALUES ('76', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('76', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('76', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('81', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('81', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('81', 'TV');
INSERT INTO `room_type_amenities` VALUES ('81', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('81', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('81', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('86', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('86', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('86', 'TV');
INSERT INTO `room_type_amenities` VALUES ('86', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('86', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('86', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('91', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('91', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('91', 'TV');
INSERT INTO `room_type_amenities` VALUES ('91', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('91', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('91', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('96', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('96', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('96', 'TV');
INSERT INTO `room_type_amenities` VALUES ('96', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('96', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('96', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('101', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('101', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('101', 'TV');
INSERT INTO `room_type_amenities` VALUES ('101', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('101', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('101', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('106', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('106', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('106', 'TV');
INSERT INTO `room_type_amenities` VALUES ('106', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('106', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('106', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('111', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('111', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('111', 'TV');
INSERT INTO `room_type_amenities` VALUES ('111', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('111', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('111', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('116', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('116', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('116', 'TV');
INSERT INTO `room_type_amenities` VALUES ('116', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('116', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('116', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('121', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('121', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('121', 'TV');
INSERT INTO `room_type_amenities` VALUES ('121', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('121', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('121', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('126', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('126', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('126', 'TV');
INSERT INTO `room_type_amenities` VALUES ('126', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('126', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('126', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('131', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('131', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('131', 'TV');
INSERT INTO `room_type_amenities` VALUES ('131', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('131', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('131', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('136', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('136', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('136', 'TV');
INSERT INTO `room_type_amenities` VALUES ('136', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('136', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('136', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('141', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('141', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('141', 'TV');
INSERT INTO `room_type_amenities` VALUES ('141', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('141', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('141', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('146', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('146', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('146', 'TV');
INSERT INTO `room_type_amenities` VALUES ('146', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('146', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('146', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('27', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('27', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('27', 'TV');
INSERT INTO `room_type_amenities` VALUES ('27', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('27', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('32', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('32', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('32', 'TV');
INSERT INTO `room_type_amenities` VALUES ('32', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('32', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('37', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('37', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('37', 'TV');
INSERT INTO `room_type_amenities` VALUES ('37', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('37', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('42', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('42', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('42', 'TV');
INSERT INTO `room_type_amenities` VALUES ('42', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('42', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('47', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('47', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('47', 'TV');
INSERT INTO `room_type_amenities` VALUES ('47', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('47', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('52', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('52', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('52', 'TV');
INSERT INTO `room_type_amenities` VALUES ('52', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('52', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('57', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('57', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('57', 'TV');
INSERT INTO `room_type_amenities` VALUES ('57', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('57', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('62', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('62', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('62', 'TV');
INSERT INTO `room_type_amenities` VALUES ('62', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('62', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('67', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('67', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('67', 'TV');
INSERT INTO `room_type_amenities` VALUES ('67', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('67', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('72', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('72', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('72', 'TV');
INSERT INTO `room_type_amenities` VALUES ('72', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('72', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('77', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('77', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('77', 'TV');
INSERT INTO `room_type_amenities` VALUES ('77', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('77', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('82', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('82', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('82', 'TV');
INSERT INTO `room_type_amenities` VALUES ('82', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('82', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('87', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('87', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('87', 'TV');
INSERT INTO `room_type_amenities` VALUES ('87', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('87', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('92', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('92', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('92', 'TV');
INSERT INTO `room_type_amenities` VALUES ('92', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('92', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('97', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('97', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('97', 'TV');
INSERT INTO `room_type_amenities` VALUES ('97', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('97', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('102', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('102', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('102', 'TV');
INSERT INTO `room_type_amenities` VALUES ('102', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('102', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('107', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('107', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('107', 'TV');
INSERT INTO `room_type_amenities` VALUES ('107', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('107', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('112', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('112', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('112', 'TV');
INSERT INTO `room_type_amenities` VALUES ('112', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('112', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('117', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('117', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('117', 'TV');
INSERT INTO `room_type_amenities` VALUES ('117', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('117', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('122', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('122', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('122', 'TV');
INSERT INTO `room_type_amenities` VALUES ('122', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('122', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('127', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('127', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('127', 'TV');
INSERT INTO `room_type_amenities` VALUES ('127', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('127', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('132', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('132', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('132', 'TV');
INSERT INTO `room_type_amenities` VALUES ('132', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('132', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('137', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('137', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('137', 'TV');
INSERT INTO `room_type_amenities` VALUES ('137', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('137', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('142', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('142', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('142', 'TV');
INSERT INTO `room_type_amenities` VALUES ('142', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('142', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('147', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('147', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('147', 'TV');
INSERT INTO `room_type_amenities` VALUES ('147', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('147', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('28', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('28', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('28', 'TV');
INSERT INTO `room_type_amenities` VALUES ('28', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('28', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('28', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('28', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('33', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('33', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('33', 'TV');
INSERT INTO `room_type_amenities` VALUES ('33', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('33', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('33', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('33', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('38', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('38', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('38', 'TV');
INSERT INTO `room_type_amenities` VALUES ('38', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('38', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('38', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('38', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('43', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('43', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('43', 'TV');
INSERT INTO `room_type_amenities` VALUES ('43', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('43', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('43', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('43', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('48', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('48', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('48', 'TV');
INSERT INTO `room_type_amenities` VALUES ('48', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('48', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('48', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('48', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('53', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('53', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('53', 'TV');
INSERT INTO `room_type_amenities` VALUES ('53', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('53', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('53', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('53', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('58', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('58', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('58', 'TV');
INSERT INTO `room_type_amenities` VALUES ('58', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('58', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('58', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('58', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('63', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('63', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('63', 'TV');
INSERT INTO `room_type_amenities` VALUES ('63', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('63', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('63', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('63', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('68', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('68', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('68', 'TV');
INSERT INTO `room_type_amenities` VALUES ('68', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('68', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('68', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('68', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('73', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('73', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('73', 'TV');
INSERT INTO `room_type_amenities` VALUES ('73', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('73', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('73', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('73', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('78', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('78', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('78', 'TV');
INSERT INTO `room_type_amenities` VALUES ('78', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('78', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('78', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('78', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('83', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('83', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('83', 'TV');
INSERT INTO `room_type_amenities` VALUES ('83', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('83', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('83', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('83', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('88', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('88', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('88', 'TV');
INSERT INTO `room_type_amenities` VALUES ('88', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('88', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('88', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('88', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('93', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('93', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('93', 'TV');
INSERT INTO `room_type_amenities` VALUES ('93', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('93', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('93', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('93', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('98', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('98', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('98', 'TV');
INSERT INTO `room_type_amenities` VALUES ('98', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('98', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('98', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('98', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('103', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('103', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('103', 'TV');
INSERT INTO `room_type_amenities` VALUES ('103', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('103', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('103', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('103', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('108', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('108', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('108', 'TV');
INSERT INTO `room_type_amenities` VALUES ('108', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('108', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('108', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('108', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('113', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('113', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('113', 'TV');
INSERT INTO `room_type_amenities` VALUES ('113', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('113', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('113', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('113', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('118', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('118', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('118', 'TV');
INSERT INTO `room_type_amenities` VALUES ('118', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('118', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('118', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('118', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('123', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('123', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('123', 'TV');
INSERT INTO `room_type_amenities` VALUES ('123', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('123', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('123', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('123', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('128', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('128', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('128', 'TV');
INSERT INTO `room_type_amenities` VALUES ('128', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('128', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('128', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('128', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('133', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('133', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('133', 'TV');
INSERT INTO `room_type_amenities` VALUES ('133', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('133', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('133', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('133', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('138', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('138', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('138', 'TV');
INSERT INTO `room_type_amenities` VALUES ('138', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('138', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('138', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('138', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('143', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('143', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('143', 'TV');
INSERT INTO `room_type_amenities` VALUES ('143', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('143', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('143', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('143', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('148', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('148', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('148', 'TV');
INSERT INTO `room_type_amenities` VALUES ('148', 'MINI_BAR');
INSERT INTO `room_type_amenities` VALUES ('148', 'ROOM_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('148', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('148', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('29', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('29', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('29', 'TV');
INSERT INTO `room_type_amenities` VALUES ('29', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('29', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('29', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('29', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('29', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('34', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('34', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('34', 'TV');
INSERT INTO `room_type_amenities` VALUES ('34', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('34', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('34', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('34', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('34', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('39', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('39', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('39', 'TV');
INSERT INTO `room_type_amenities` VALUES ('39', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('39', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('39', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('39', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('39', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('44', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('44', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('44', 'TV');
INSERT INTO `room_type_amenities` VALUES ('44', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('44', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('44', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('44', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('44', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('49', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('49', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('49', 'TV');
INSERT INTO `room_type_amenities` VALUES ('49', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('49', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('49', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('49', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('49', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('54', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('54', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('54', 'TV');
INSERT INTO `room_type_amenities` VALUES ('54', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('54', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('54', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('54', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('54', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('59', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('59', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('59', 'TV');
INSERT INTO `room_type_amenities` VALUES ('59', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('59', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('59', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('59', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('59', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('64', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('64', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('64', 'TV');
INSERT INTO `room_type_amenities` VALUES ('64', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('64', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('64', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('64', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('64', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('69', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('69', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('69', 'TV');
INSERT INTO `room_type_amenities` VALUES ('69', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('69', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('69', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('69', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('69', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('74', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('74', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('74', 'TV');
INSERT INTO `room_type_amenities` VALUES ('74', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('74', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('74', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('74', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('74', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('79', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('79', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('79', 'TV');
INSERT INTO `room_type_amenities` VALUES ('79', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('79', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('79', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('79', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('79', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('84', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('84', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('84', 'TV');
INSERT INTO `room_type_amenities` VALUES ('84', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('84', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('84', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('84', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('84', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('89', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('89', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('89', 'TV');
INSERT INTO `room_type_amenities` VALUES ('89', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('89', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('89', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('89', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('89', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('94', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('94', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('94', 'TV');
INSERT INTO `room_type_amenities` VALUES ('94', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('94', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('94', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('94', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('94', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('99', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('99', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('99', 'TV');
INSERT INTO `room_type_amenities` VALUES ('99', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('99', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('99', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('99', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('99', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('104', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('104', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('104', 'TV');
INSERT INTO `room_type_amenities` VALUES ('104', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('104', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('104', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('104', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('104', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('109', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('109', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('109', 'TV');
INSERT INTO `room_type_amenities` VALUES ('109', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('109', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('109', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('109', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('109', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('114', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('114', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('114', 'TV');
INSERT INTO `room_type_amenities` VALUES ('114', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('114', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('114', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('114', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('114', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('119', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('119', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('119', 'TV');
INSERT INTO `room_type_amenities` VALUES ('119', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('119', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('119', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('119', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('119', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('124', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('124', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('124', 'TV');
INSERT INTO `room_type_amenities` VALUES ('124', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('124', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('124', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('124', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('124', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('129', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('129', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('129', 'TV');
INSERT INTO `room_type_amenities` VALUES ('129', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('129', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('129', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('129', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('129', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('134', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('134', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('134', 'TV');
INSERT INTO `room_type_amenities` VALUES ('134', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('134', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('134', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('134', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('134', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('139', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('139', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('139', 'TV');
INSERT INTO `room_type_amenities` VALUES ('139', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('139', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('139', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('139', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('139', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('144', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('144', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('144', 'TV');
INSERT INTO `room_type_amenities` VALUES ('144', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('144', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('144', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('144', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('144', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('149', 'WIFI');
INSERT INTO `room_type_amenities` VALUES ('149', 'AIR_CONDITIONING');
INSERT INTO `room_type_amenities` VALUES ('149', 'TV');
INSERT INTO `room_type_amenities` VALUES ('149', 'KITCHENETTE');
INSERT INTO `room_type_amenities` VALUES ('149', 'PARKING');
INSERT INTO `room_type_amenities` VALUES ('149', 'BREAKFAST_INCLUDED');
INSERT INTO `room_type_amenities` VALUES ('149', 'LAUNDRY_SERVICE');
INSERT INTO `room_type_amenities` VALUES ('149', 'NON_SMOKING');
INSERT INTO `room_type_amenities` VALUES ('30', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('31', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('32', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('33', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('34', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('45', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('46', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('47', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('48', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('49', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('55', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('56', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('57', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('58', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('59', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('70', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('71', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('72', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('73', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('74', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('80', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('81', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('82', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('83', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('84', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('85', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('86', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('87', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('88', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('89', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('100', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('101', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('102', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('103', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('104', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('115', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('116', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('117', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('118', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('119', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('125', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('126', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('127', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('128', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('129', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('130', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('131', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('132', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('133', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('134', 'BALCONY');
INSERT INTO `room_type_amenities` VALUES ('30', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('31', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('32', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('33', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('34', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('45', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('46', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('47', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('48', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('49', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('55', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('56', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('57', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('58', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('59', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('70', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('71', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('72', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('73', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('74', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('80', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('81', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('82', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('83', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('84', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('85', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('86', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('87', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('88', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('89', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('100', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('101', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('102', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('103', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('104', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('115', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('116', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('117', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('118', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('119', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('125', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('126', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('127', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('128', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('129', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('130', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('131', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('132', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('133', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('134', 'SPA_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('30', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('31', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('32', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('33', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('34', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('45', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('46', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('47', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('48', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('49', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('55', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('56', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('57', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('58', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('59', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('70', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('71', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('72', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('73', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('74', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('80', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('81', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('82', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('83', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('84', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('85', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('86', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('87', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('88', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('89', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('100', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('101', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('102', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('103', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('104', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('115', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('116', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('117', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('118', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('119', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('125', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('126', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('127', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('128', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('129', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('130', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('131', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('132', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('133', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('134', 'GYM_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('30', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('31', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('32', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('33', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('34', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('45', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('46', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('47', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('48', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('49', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('55', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('56', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('57', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('58', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('59', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('70', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('71', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('72', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('73', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('74', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('80', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('81', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('82', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('83', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('84', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('85', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('86', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('87', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('88', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('89', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('100', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('101', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('102', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('103', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('104', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('115', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('116', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('117', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('118', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('119', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('125', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('126', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('127', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('128', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('129', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('130', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('131', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('132', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('133', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('134', 'SWIMMING_POOL_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('55', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('56', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('57', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('58', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('59', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('125', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('126', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('127', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('128', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('129', 'SEA_VIEW');
INSERT INTO `room_type_amenities` VALUES ('59', 'PET_FRIENDLY');
INSERT INTO `room_type_amenities` VALUES ('89', 'PET_FRIENDLY');
INSERT INTO `room_type_amenities` VALUES ('104', 'PET_FRIENDLY');
INSERT INTO `room_type_amenities` VALUES ('129', 'PET_FRIENDLY');
INSERT INTO `room_type_amenities` VALUES ('55', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('56', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('57', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('58', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('59', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('85', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('86', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('87', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('88', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('89', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('100', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('101', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('102', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('103', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('104', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('125', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('126', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('127', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('128', 'DISABLED_ACCESS');
INSERT INTO `room_type_amenities` VALUES ('129', 'DISABLED_ACCESS');

-- ----------------------------
-- Table structure for `rule_room_types`
-- ----------------------------
DROP TABLE IF EXISTS `rule_room_types`;
CREATE TABLE `rule_room_types` (
  `rule_id` bigint(20) NOT NULL,
  `room_type_id` bigint(20) NOT NULL,
  PRIMARY KEY (`rule_id`,`room_type_id`),
  KEY `FKbhvavg1mnka8fmrc1tfmymb5o` (`room_type_id`),
  CONSTRAINT `FK3vkmpcw7gbb6h0myn2hg406xo` FOREIGN KEY (`rule_id`) REFERENCES `hotel_pricing_rules` (`id`),
  CONSTRAINT `FKbhvavg1mnka8fmrc1tfmymb5o` FOREIGN KEY (`room_type_id`) REFERENCES `room_types` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of rule_room_types
-- ----------------------------
INSERT INTO `rule_room_types` VALUES ('25', '25');
INSERT INTO `rule_room_types` VALUES ('25', '26');
INSERT INTO `rule_room_types` VALUES ('25', '27');
INSERT INTO `rule_room_types` VALUES ('25', '28');
INSERT INTO `rule_room_types` VALUES ('25', '29');
INSERT INTO `rule_room_types` VALUES ('26', '30');
INSERT INTO `rule_room_types` VALUES ('26', '31');
INSERT INTO `rule_room_types` VALUES ('26', '32');
INSERT INTO `rule_room_types` VALUES ('26', '33');
INSERT INTO `rule_room_types` VALUES ('26', '34');
INSERT INTO `rule_room_types` VALUES ('27', '35');
INSERT INTO `rule_room_types` VALUES ('27', '36');
INSERT INTO `rule_room_types` VALUES ('27', '37');
INSERT INTO `rule_room_types` VALUES ('27', '38');
INSERT INTO `rule_room_types` VALUES ('27', '39');
INSERT INTO `rule_room_types` VALUES ('28', '40');
INSERT INTO `rule_room_types` VALUES ('28', '41');
INSERT INTO `rule_room_types` VALUES ('28', '42');
INSERT INTO `rule_room_types` VALUES ('28', '43');
INSERT INTO `rule_room_types` VALUES ('28', '44');
INSERT INTO `rule_room_types` VALUES ('29', '45');
INSERT INTO `rule_room_types` VALUES ('29', '46');
INSERT INTO `rule_room_types` VALUES ('29', '47');
INSERT INTO `rule_room_types` VALUES ('29', '48');
INSERT INTO `rule_room_types` VALUES ('29', '49');
INSERT INTO `rule_room_types` VALUES ('30', '50');
INSERT INTO `rule_room_types` VALUES ('30', '51');
INSERT INTO `rule_room_types` VALUES ('30', '52');
INSERT INTO `rule_room_types` VALUES ('30', '53');
INSERT INTO `rule_room_types` VALUES ('30', '54');
INSERT INTO `rule_room_types` VALUES ('31', '55');
INSERT INTO `rule_room_types` VALUES ('31', '56');
INSERT INTO `rule_room_types` VALUES ('31', '57');
INSERT INTO `rule_room_types` VALUES ('31', '58');
INSERT INTO `rule_room_types` VALUES ('31', '59');
INSERT INTO `rule_room_types` VALUES ('32', '60');
INSERT INTO `rule_room_types` VALUES ('32', '61');
INSERT INTO `rule_room_types` VALUES ('32', '62');
INSERT INTO `rule_room_types` VALUES ('32', '63');
INSERT INTO `rule_room_types` VALUES ('32', '64');
INSERT INTO `rule_room_types` VALUES ('33', '65');
INSERT INTO `rule_room_types` VALUES ('33', '66');
INSERT INTO `rule_room_types` VALUES ('33', '67');
INSERT INTO `rule_room_types` VALUES ('33', '68');
INSERT INTO `rule_room_types` VALUES ('33', '69');
INSERT INTO `rule_room_types` VALUES ('34', '70');
INSERT INTO `rule_room_types` VALUES ('34', '71');
INSERT INTO `rule_room_types` VALUES ('34', '72');
INSERT INTO `rule_room_types` VALUES ('34', '73');
INSERT INTO `rule_room_types` VALUES ('34', '74');
INSERT INTO `rule_room_types` VALUES ('35', '75');
INSERT INTO `rule_room_types` VALUES ('35', '76');
INSERT INTO `rule_room_types` VALUES ('35', '77');
INSERT INTO `rule_room_types` VALUES ('35', '78');
INSERT INTO `rule_room_types` VALUES ('35', '79');
INSERT INTO `rule_room_types` VALUES ('36', '80');
INSERT INTO `rule_room_types` VALUES ('36', '81');
INSERT INTO `rule_room_types` VALUES ('36', '82');
INSERT INTO `rule_room_types` VALUES ('36', '83');
INSERT INTO `rule_room_types` VALUES ('36', '84');
INSERT INTO `rule_room_types` VALUES ('37', '85');
INSERT INTO `rule_room_types` VALUES ('37', '86');
INSERT INTO `rule_room_types` VALUES ('37', '87');
INSERT INTO `rule_room_types` VALUES ('37', '88');
INSERT INTO `rule_room_types` VALUES ('37', '89');
INSERT INTO `rule_room_types` VALUES ('38', '90');
INSERT INTO `rule_room_types` VALUES ('38', '91');
INSERT INTO `rule_room_types` VALUES ('38', '92');
INSERT INTO `rule_room_types` VALUES ('38', '93');
INSERT INTO `rule_room_types` VALUES ('38', '94');
INSERT INTO `rule_room_types` VALUES ('39', '95');
INSERT INTO `rule_room_types` VALUES ('39', '96');
INSERT INTO `rule_room_types` VALUES ('39', '97');
INSERT INTO `rule_room_types` VALUES ('39', '98');
INSERT INTO `rule_room_types` VALUES ('39', '99');
INSERT INTO `rule_room_types` VALUES ('40', '100');
INSERT INTO `rule_room_types` VALUES ('40', '101');
INSERT INTO `rule_room_types` VALUES ('40', '102');
INSERT INTO `rule_room_types` VALUES ('40', '103');
INSERT INTO `rule_room_types` VALUES ('40', '104');
INSERT INTO `rule_room_types` VALUES ('41', '105');
INSERT INTO `rule_room_types` VALUES ('41', '106');
INSERT INTO `rule_room_types` VALUES ('41', '107');
INSERT INTO `rule_room_types` VALUES ('41', '108');
INSERT INTO `rule_room_types` VALUES ('41', '109');
INSERT INTO `rule_room_types` VALUES ('42', '110');
INSERT INTO `rule_room_types` VALUES ('42', '111');
INSERT INTO `rule_room_types` VALUES ('42', '112');
INSERT INTO `rule_room_types` VALUES ('42', '113');
INSERT INTO `rule_room_types` VALUES ('42', '114');
INSERT INTO `rule_room_types` VALUES ('43', '115');
INSERT INTO `rule_room_types` VALUES ('43', '116');
INSERT INTO `rule_room_types` VALUES ('43', '117');
INSERT INTO `rule_room_types` VALUES ('43', '118');
INSERT INTO `rule_room_types` VALUES ('43', '119');
INSERT INTO `rule_room_types` VALUES ('44', '120');
INSERT INTO `rule_room_types` VALUES ('44', '121');
INSERT INTO `rule_room_types` VALUES ('44', '122');
INSERT INTO `rule_room_types` VALUES ('44', '123');
INSERT INTO `rule_room_types` VALUES ('44', '124');
INSERT INTO `rule_room_types` VALUES ('45', '125');
INSERT INTO `rule_room_types` VALUES ('45', '126');
INSERT INTO `rule_room_types` VALUES ('45', '127');
INSERT INTO `rule_room_types` VALUES ('45', '128');
INSERT INTO `rule_room_types` VALUES ('45', '129');
INSERT INTO `rule_room_types` VALUES ('46', '130');
INSERT INTO `rule_room_types` VALUES ('46', '131');
INSERT INTO `rule_room_types` VALUES ('46', '132');
INSERT INTO `rule_room_types` VALUES ('46', '133');
INSERT INTO `rule_room_types` VALUES ('46', '134');
INSERT INTO `rule_room_types` VALUES ('47', '135');
INSERT INTO `rule_room_types` VALUES ('47', '136');
INSERT INTO `rule_room_types` VALUES ('47', '137');
INSERT INTO `rule_room_types` VALUES ('47', '138');
INSERT INTO `rule_room_types` VALUES ('47', '139');
INSERT INTO `rule_room_types` VALUES ('48', '140');
INSERT INTO `rule_room_types` VALUES ('48', '141');
INSERT INTO `rule_room_types` VALUES ('48', '142');
INSERT INTO `rule_room_types` VALUES ('48', '143');
INSERT INTO `rule_room_types` VALUES ('48', '144');
INSERT INTO `rule_room_types` VALUES ('49', '145');
INSERT INTO `rule_room_types` VALUES ('49', '146');
INSERT INTO `rule_room_types` VALUES ('49', '147');
INSERT INTO `rule_room_types` VALUES ('49', '148');
INSERT INTO `rule_room_types` VALUES ('49', '149');
INSERT INTO `rule_room_types` VALUES ('56', '25');
INSERT INTO `rule_room_types` VALUES ('56', '26');
INSERT INTO `rule_room_types` VALUES ('56', '27');
INSERT INTO `rule_room_types` VALUES ('56', '28');
INSERT INTO `rule_room_types` VALUES ('56', '29');
INSERT INTO `rule_room_types` VALUES ('57', '30');
INSERT INTO `rule_room_types` VALUES ('57', '31');
INSERT INTO `rule_room_types` VALUES ('57', '32');
INSERT INTO `rule_room_types` VALUES ('57', '33');
INSERT INTO `rule_room_types` VALUES ('57', '34');
INSERT INTO `rule_room_types` VALUES ('58', '35');
INSERT INTO `rule_room_types` VALUES ('58', '36');
INSERT INTO `rule_room_types` VALUES ('58', '37');
INSERT INTO `rule_room_types` VALUES ('58', '38');
INSERT INTO `rule_room_types` VALUES ('58', '39');
INSERT INTO `rule_room_types` VALUES ('59', '40');
INSERT INTO `rule_room_types` VALUES ('59', '41');
INSERT INTO `rule_room_types` VALUES ('59', '42');
INSERT INTO `rule_room_types` VALUES ('59', '43');
INSERT INTO `rule_room_types` VALUES ('59', '44');
INSERT INTO `rule_room_types` VALUES ('60', '45');
INSERT INTO `rule_room_types` VALUES ('60', '46');
INSERT INTO `rule_room_types` VALUES ('60', '47');
INSERT INTO `rule_room_types` VALUES ('60', '48');
INSERT INTO `rule_room_types` VALUES ('60', '49');
INSERT INTO `rule_room_types` VALUES ('61', '50');
INSERT INTO `rule_room_types` VALUES ('61', '51');
INSERT INTO `rule_room_types` VALUES ('61', '52');
INSERT INTO `rule_room_types` VALUES ('61', '53');
INSERT INTO `rule_room_types` VALUES ('61', '54');
INSERT INTO `rule_room_types` VALUES ('62', '55');
INSERT INTO `rule_room_types` VALUES ('62', '56');
INSERT INTO `rule_room_types` VALUES ('62', '57');
INSERT INTO `rule_room_types` VALUES ('62', '58');
INSERT INTO `rule_room_types` VALUES ('62', '59');
INSERT INTO `rule_room_types` VALUES ('63', '60');
INSERT INTO `rule_room_types` VALUES ('63', '61');
INSERT INTO `rule_room_types` VALUES ('63', '62');
INSERT INTO `rule_room_types` VALUES ('63', '63');
INSERT INTO `rule_room_types` VALUES ('63', '64');
INSERT INTO `rule_room_types` VALUES ('64', '65');
INSERT INTO `rule_room_types` VALUES ('64', '66');
INSERT INTO `rule_room_types` VALUES ('64', '67');
INSERT INTO `rule_room_types` VALUES ('64', '68');
INSERT INTO `rule_room_types` VALUES ('64', '69');
INSERT INTO `rule_room_types` VALUES ('65', '70');
INSERT INTO `rule_room_types` VALUES ('65', '71');
INSERT INTO `rule_room_types` VALUES ('65', '72');
INSERT INTO `rule_room_types` VALUES ('65', '73');
INSERT INTO `rule_room_types` VALUES ('65', '74');
INSERT INTO `rule_room_types` VALUES ('66', '75');
INSERT INTO `rule_room_types` VALUES ('66', '76');
INSERT INTO `rule_room_types` VALUES ('66', '77');
INSERT INTO `rule_room_types` VALUES ('66', '78');
INSERT INTO `rule_room_types` VALUES ('66', '79');
INSERT INTO `rule_room_types` VALUES ('67', '80');
INSERT INTO `rule_room_types` VALUES ('67', '81');
INSERT INTO `rule_room_types` VALUES ('67', '82');
INSERT INTO `rule_room_types` VALUES ('67', '83');
INSERT INTO `rule_room_types` VALUES ('67', '84');
INSERT INTO `rule_room_types` VALUES ('68', '85');
INSERT INTO `rule_room_types` VALUES ('68', '86');
INSERT INTO `rule_room_types` VALUES ('68', '87');
INSERT INTO `rule_room_types` VALUES ('68', '88');
INSERT INTO `rule_room_types` VALUES ('68', '89');
INSERT INTO `rule_room_types` VALUES ('69', '90');
INSERT INTO `rule_room_types` VALUES ('69', '91');
INSERT INTO `rule_room_types` VALUES ('69', '92');
INSERT INTO `rule_room_types` VALUES ('69', '93');
INSERT INTO `rule_room_types` VALUES ('69', '94');
INSERT INTO `rule_room_types` VALUES ('70', '95');
INSERT INTO `rule_room_types` VALUES ('70', '96');
INSERT INTO `rule_room_types` VALUES ('70', '97');
INSERT INTO `rule_room_types` VALUES ('70', '98');
INSERT INTO `rule_room_types` VALUES ('70', '99');
INSERT INTO `rule_room_types` VALUES ('71', '100');
INSERT INTO `rule_room_types` VALUES ('71', '101');
INSERT INTO `rule_room_types` VALUES ('71', '102');
INSERT INTO `rule_room_types` VALUES ('71', '103');
INSERT INTO `rule_room_types` VALUES ('71', '104');
INSERT INTO `rule_room_types` VALUES ('72', '105');
INSERT INTO `rule_room_types` VALUES ('72', '106');
INSERT INTO `rule_room_types` VALUES ('72', '107');
INSERT INTO `rule_room_types` VALUES ('72', '108');
INSERT INTO `rule_room_types` VALUES ('72', '109');
INSERT INTO `rule_room_types` VALUES ('73', '110');
INSERT INTO `rule_room_types` VALUES ('73', '111');
INSERT INTO `rule_room_types` VALUES ('73', '112');
INSERT INTO `rule_room_types` VALUES ('73', '113');
INSERT INTO `rule_room_types` VALUES ('73', '114');
INSERT INTO `rule_room_types` VALUES ('74', '115');
INSERT INTO `rule_room_types` VALUES ('74', '116');
INSERT INTO `rule_room_types` VALUES ('74', '117');
INSERT INTO `rule_room_types` VALUES ('74', '118');
INSERT INTO `rule_room_types` VALUES ('74', '119');
INSERT INTO `rule_room_types` VALUES ('75', '120');
INSERT INTO `rule_room_types` VALUES ('75', '121');
INSERT INTO `rule_room_types` VALUES ('75', '122');
INSERT INTO `rule_room_types` VALUES ('75', '123');
INSERT INTO `rule_room_types` VALUES ('75', '124');
INSERT INTO `rule_room_types` VALUES ('76', '125');
INSERT INTO `rule_room_types` VALUES ('76', '126');
INSERT INTO `rule_room_types` VALUES ('76', '127');
INSERT INTO `rule_room_types` VALUES ('76', '128');
INSERT INTO `rule_room_types` VALUES ('76', '129');
INSERT INTO `rule_room_types` VALUES ('77', '130');
INSERT INTO `rule_room_types` VALUES ('77', '131');
INSERT INTO `rule_room_types` VALUES ('77', '132');
INSERT INTO `rule_room_types` VALUES ('77', '133');
INSERT INTO `rule_room_types` VALUES ('77', '134');
INSERT INTO `rule_room_types` VALUES ('78', '135');
INSERT INTO `rule_room_types` VALUES ('78', '136');
INSERT INTO `rule_room_types` VALUES ('78', '137');
INSERT INTO `rule_room_types` VALUES ('78', '138');
INSERT INTO `rule_room_types` VALUES ('78', '139');
INSERT INTO `rule_room_types` VALUES ('79', '140');
INSERT INTO `rule_room_types` VALUES ('79', '141');
INSERT INTO `rule_room_types` VALUES ('79', '142');
INSERT INTO `rule_room_types` VALUES ('79', '143');
INSERT INTO `rule_room_types` VALUES ('79', '144');
INSERT INTO `rule_room_types` VALUES ('80', '145');
INSERT INTO `rule_room_types` VALUES ('80', '146');
INSERT INTO `rule_room_types` VALUES ('80', '147');
INSERT INTO `rule_room_types` VALUES ('80', '148');
INSERT INTO `rule_room_types` VALUES ('80', '149');
INSERT INTO `rule_room_types` VALUES ('87', '25');
INSERT INTO `rule_room_types` VALUES ('87', '26');
INSERT INTO `rule_room_types` VALUES ('87', '27');
INSERT INTO `rule_room_types` VALUES ('87', '28');
INSERT INTO `rule_room_types` VALUES ('87', '29');
INSERT INTO `rule_room_types` VALUES ('88', '30');
INSERT INTO `rule_room_types` VALUES ('88', '31');
INSERT INTO `rule_room_types` VALUES ('88', '32');
INSERT INTO `rule_room_types` VALUES ('88', '33');
INSERT INTO `rule_room_types` VALUES ('88', '34');
INSERT INTO `rule_room_types` VALUES ('89', '35');
INSERT INTO `rule_room_types` VALUES ('89', '36');
INSERT INTO `rule_room_types` VALUES ('89', '37');
INSERT INTO `rule_room_types` VALUES ('89', '38');
INSERT INTO `rule_room_types` VALUES ('89', '39');
INSERT INTO `rule_room_types` VALUES ('90', '40');
INSERT INTO `rule_room_types` VALUES ('90', '41');
INSERT INTO `rule_room_types` VALUES ('90', '42');
INSERT INTO `rule_room_types` VALUES ('90', '43');
INSERT INTO `rule_room_types` VALUES ('90', '44');
INSERT INTO `rule_room_types` VALUES ('91', '45');
INSERT INTO `rule_room_types` VALUES ('91', '46');
INSERT INTO `rule_room_types` VALUES ('91', '47');
INSERT INTO `rule_room_types` VALUES ('91', '48');
INSERT INTO `rule_room_types` VALUES ('91', '49');
INSERT INTO `rule_room_types` VALUES ('92', '50');
INSERT INTO `rule_room_types` VALUES ('92', '51');
INSERT INTO `rule_room_types` VALUES ('92', '52');
INSERT INTO `rule_room_types` VALUES ('92', '53');
INSERT INTO `rule_room_types` VALUES ('92', '54');
INSERT INTO `rule_room_types` VALUES ('93', '55');
INSERT INTO `rule_room_types` VALUES ('93', '56');
INSERT INTO `rule_room_types` VALUES ('93', '57');
INSERT INTO `rule_room_types` VALUES ('93', '58');
INSERT INTO `rule_room_types` VALUES ('93', '59');
INSERT INTO `rule_room_types` VALUES ('94', '60');
INSERT INTO `rule_room_types` VALUES ('94', '61');
INSERT INTO `rule_room_types` VALUES ('94', '62');
INSERT INTO `rule_room_types` VALUES ('94', '63');
INSERT INTO `rule_room_types` VALUES ('94', '64');
INSERT INTO `rule_room_types` VALUES ('95', '65');
INSERT INTO `rule_room_types` VALUES ('95', '66');
INSERT INTO `rule_room_types` VALUES ('95', '67');
INSERT INTO `rule_room_types` VALUES ('95', '68');
INSERT INTO `rule_room_types` VALUES ('95', '69');
INSERT INTO `rule_room_types` VALUES ('96', '70');
INSERT INTO `rule_room_types` VALUES ('96', '71');
INSERT INTO `rule_room_types` VALUES ('96', '72');
INSERT INTO `rule_room_types` VALUES ('96', '73');
INSERT INTO `rule_room_types` VALUES ('96', '74');
INSERT INTO `rule_room_types` VALUES ('97', '75');
INSERT INTO `rule_room_types` VALUES ('97', '76');
INSERT INTO `rule_room_types` VALUES ('97', '77');
INSERT INTO `rule_room_types` VALUES ('97', '78');
INSERT INTO `rule_room_types` VALUES ('97', '79');
INSERT INTO `rule_room_types` VALUES ('98', '80');
INSERT INTO `rule_room_types` VALUES ('98', '81');
INSERT INTO `rule_room_types` VALUES ('98', '82');
INSERT INTO `rule_room_types` VALUES ('98', '83');
INSERT INTO `rule_room_types` VALUES ('98', '84');
INSERT INTO `rule_room_types` VALUES ('99', '85');
INSERT INTO `rule_room_types` VALUES ('99', '86');
INSERT INTO `rule_room_types` VALUES ('99', '87');
INSERT INTO `rule_room_types` VALUES ('99', '88');
INSERT INTO `rule_room_types` VALUES ('99', '89');
INSERT INTO `rule_room_types` VALUES ('100', '90');
INSERT INTO `rule_room_types` VALUES ('100', '91');
INSERT INTO `rule_room_types` VALUES ('100', '92');
INSERT INTO `rule_room_types` VALUES ('100', '93');
INSERT INTO `rule_room_types` VALUES ('100', '94');
INSERT INTO `rule_room_types` VALUES ('101', '95');
INSERT INTO `rule_room_types` VALUES ('101', '96');
INSERT INTO `rule_room_types` VALUES ('101', '97');
INSERT INTO `rule_room_types` VALUES ('101', '98');
INSERT INTO `rule_room_types` VALUES ('101', '99');
INSERT INTO `rule_room_types` VALUES ('102', '100');
INSERT INTO `rule_room_types` VALUES ('102', '101');
INSERT INTO `rule_room_types` VALUES ('102', '102');
INSERT INTO `rule_room_types` VALUES ('102', '103');
INSERT INTO `rule_room_types` VALUES ('102', '104');
INSERT INTO `rule_room_types` VALUES ('103', '105');
INSERT INTO `rule_room_types` VALUES ('103', '106');
INSERT INTO `rule_room_types` VALUES ('103', '107');
INSERT INTO `rule_room_types` VALUES ('103', '108');
INSERT INTO `rule_room_types` VALUES ('103', '109');
INSERT INTO `rule_room_types` VALUES ('104', '110');
INSERT INTO `rule_room_types` VALUES ('104', '111');
INSERT INTO `rule_room_types` VALUES ('104', '112');
INSERT INTO `rule_room_types` VALUES ('104', '113');
INSERT INTO `rule_room_types` VALUES ('104', '114');
INSERT INTO `rule_room_types` VALUES ('105', '115');
INSERT INTO `rule_room_types` VALUES ('105', '116');
INSERT INTO `rule_room_types` VALUES ('105', '117');
INSERT INTO `rule_room_types` VALUES ('105', '118');
INSERT INTO `rule_room_types` VALUES ('105', '119');
INSERT INTO `rule_room_types` VALUES ('106', '120');
INSERT INTO `rule_room_types` VALUES ('106', '121');
INSERT INTO `rule_room_types` VALUES ('106', '122');
INSERT INTO `rule_room_types` VALUES ('106', '123');
INSERT INTO `rule_room_types` VALUES ('106', '124');
INSERT INTO `rule_room_types` VALUES ('107', '125');
INSERT INTO `rule_room_types` VALUES ('107', '126');
INSERT INTO `rule_room_types` VALUES ('107', '127');
INSERT INTO `rule_room_types` VALUES ('107', '128');
INSERT INTO `rule_room_types` VALUES ('107', '129');
INSERT INTO `rule_room_types` VALUES ('108', '130');
INSERT INTO `rule_room_types` VALUES ('108', '131');
INSERT INTO `rule_room_types` VALUES ('108', '132');
INSERT INTO `rule_room_types` VALUES ('108', '133');
INSERT INTO `rule_room_types` VALUES ('108', '134');
INSERT INTO `rule_room_types` VALUES ('109', '135');
INSERT INTO `rule_room_types` VALUES ('109', '136');
INSERT INTO `rule_room_types` VALUES ('109', '137');
INSERT INTO `rule_room_types` VALUES ('109', '138');
INSERT INTO `rule_room_types` VALUES ('109', '139');
INSERT INTO `rule_room_types` VALUES ('110', '140');
INSERT INTO `rule_room_types` VALUES ('110', '141');
INSERT INTO `rule_room_types` VALUES ('110', '142');
INSERT INTO `rule_room_types` VALUES ('110', '143');
INSERT INTO `rule_room_types` VALUES ('110', '144');
INSERT INTO `rule_room_types` VALUES ('111', '145');
INSERT INTO `rule_room_types` VALUES ('111', '146');
INSERT INTO `rule_room_types` VALUES ('111', '147');
INSERT INTO `rule_room_types` VALUES ('111', '148');
INSERT INTO `rule_room_types` VALUES ('111', '149');
INSERT INTO `rule_room_types` VALUES ('118', '25');
INSERT INTO `rule_room_types` VALUES ('118', '26');
INSERT INTO `rule_room_types` VALUES ('118', '27');
INSERT INTO `rule_room_types` VALUES ('118', '28');
INSERT INTO `rule_room_types` VALUES ('118', '29');
INSERT INTO `rule_room_types` VALUES ('119', '30');
INSERT INTO `rule_room_types` VALUES ('119', '31');
INSERT INTO `rule_room_types` VALUES ('119', '32');
INSERT INTO `rule_room_types` VALUES ('119', '33');
INSERT INTO `rule_room_types` VALUES ('119', '34');
INSERT INTO `rule_room_types` VALUES ('120', '35');
INSERT INTO `rule_room_types` VALUES ('120', '36');
INSERT INTO `rule_room_types` VALUES ('120', '37');
INSERT INTO `rule_room_types` VALUES ('120', '38');
INSERT INTO `rule_room_types` VALUES ('120', '39');
INSERT INTO `rule_room_types` VALUES ('121', '40');
INSERT INTO `rule_room_types` VALUES ('121', '41');
INSERT INTO `rule_room_types` VALUES ('121', '42');
INSERT INTO `rule_room_types` VALUES ('121', '43');
INSERT INTO `rule_room_types` VALUES ('121', '44');
INSERT INTO `rule_room_types` VALUES ('122', '45');
INSERT INTO `rule_room_types` VALUES ('122', '46');
INSERT INTO `rule_room_types` VALUES ('122', '47');
INSERT INTO `rule_room_types` VALUES ('122', '48');
INSERT INTO `rule_room_types` VALUES ('122', '49');
INSERT INTO `rule_room_types` VALUES ('123', '50');
INSERT INTO `rule_room_types` VALUES ('123', '51');
INSERT INTO `rule_room_types` VALUES ('123', '52');
INSERT INTO `rule_room_types` VALUES ('123', '53');
INSERT INTO `rule_room_types` VALUES ('123', '54');
INSERT INTO `rule_room_types` VALUES ('124', '55');
INSERT INTO `rule_room_types` VALUES ('124', '56');
INSERT INTO `rule_room_types` VALUES ('124', '57');
INSERT INTO `rule_room_types` VALUES ('124', '58');
INSERT INTO `rule_room_types` VALUES ('124', '59');
INSERT INTO `rule_room_types` VALUES ('125', '60');
INSERT INTO `rule_room_types` VALUES ('125', '61');
INSERT INTO `rule_room_types` VALUES ('125', '62');
INSERT INTO `rule_room_types` VALUES ('125', '63');
INSERT INTO `rule_room_types` VALUES ('125', '64');
INSERT INTO `rule_room_types` VALUES ('126', '65');
INSERT INTO `rule_room_types` VALUES ('126', '66');
INSERT INTO `rule_room_types` VALUES ('126', '67');
INSERT INTO `rule_room_types` VALUES ('126', '68');
INSERT INTO `rule_room_types` VALUES ('126', '69');
INSERT INTO `rule_room_types` VALUES ('127', '70');
INSERT INTO `rule_room_types` VALUES ('127', '71');
INSERT INTO `rule_room_types` VALUES ('127', '72');
INSERT INTO `rule_room_types` VALUES ('127', '73');
INSERT INTO `rule_room_types` VALUES ('127', '74');
INSERT INTO `rule_room_types` VALUES ('128', '75');
INSERT INTO `rule_room_types` VALUES ('128', '76');
INSERT INTO `rule_room_types` VALUES ('128', '77');
INSERT INTO `rule_room_types` VALUES ('128', '78');
INSERT INTO `rule_room_types` VALUES ('128', '79');
INSERT INTO `rule_room_types` VALUES ('129', '80');
INSERT INTO `rule_room_types` VALUES ('129', '81');
INSERT INTO `rule_room_types` VALUES ('129', '82');
INSERT INTO `rule_room_types` VALUES ('129', '83');
INSERT INTO `rule_room_types` VALUES ('129', '84');
INSERT INTO `rule_room_types` VALUES ('130', '85');
INSERT INTO `rule_room_types` VALUES ('130', '86');
INSERT INTO `rule_room_types` VALUES ('130', '87');
INSERT INTO `rule_room_types` VALUES ('130', '88');
INSERT INTO `rule_room_types` VALUES ('130', '89');
INSERT INTO `rule_room_types` VALUES ('131', '90');
INSERT INTO `rule_room_types` VALUES ('131', '91');
INSERT INTO `rule_room_types` VALUES ('131', '92');
INSERT INTO `rule_room_types` VALUES ('131', '93');
INSERT INTO `rule_room_types` VALUES ('131', '94');
INSERT INTO `rule_room_types` VALUES ('132', '95');
INSERT INTO `rule_room_types` VALUES ('132', '96');
INSERT INTO `rule_room_types` VALUES ('132', '97');
INSERT INTO `rule_room_types` VALUES ('132', '98');
INSERT INTO `rule_room_types` VALUES ('132', '99');
INSERT INTO `rule_room_types` VALUES ('133', '100');
INSERT INTO `rule_room_types` VALUES ('133', '101');
INSERT INTO `rule_room_types` VALUES ('133', '102');
INSERT INTO `rule_room_types` VALUES ('133', '103');
INSERT INTO `rule_room_types` VALUES ('133', '104');
INSERT INTO `rule_room_types` VALUES ('134', '105');
INSERT INTO `rule_room_types` VALUES ('134', '106');
INSERT INTO `rule_room_types` VALUES ('134', '107');
INSERT INTO `rule_room_types` VALUES ('134', '108');
INSERT INTO `rule_room_types` VALUES ('134', '109');
INSERT INTO `rule_room_types` VALUES ('135', '110');
INSERT INTO `rule_room_types` VALUES ('135', '111');
INSERT INTO `rule_room_types` VALUES ('135', '112');
INSERT INTO `rule_room_types` VALUES ('135', '113');
INSERT INTO `rule_room_types` VALUES ('135', '114');
INSERT INTO `rule_room_types` VALUES ('136', '115');
INSERT INTO `rule_room_types` VALUES ('136', '116');
INSERT INTO `rule_room_types` VALUES ('136', '117');
INSERT INTO `rule_room_types` VALUES ('136', '118');
INSERT INTO `rule_room_types` VALUES ('136', '119');
INSERT INTO `rule_room_types` VALUES ('137', '120');
INSERT INTO `rule_room_types` VALUES ('137', '121');
INSERT INTO `rule_room_types` VALUES ('137', '122');
INSERT INTO `rule_room_types` VALUES ('137', '123');
INSERT INTO `rule_room_types` VALUES ('137', '124');
INSERT INTO `rule_room_types` VALUES ('138', '125');
INSERT INTO `rule_room_types` VALUES ('138', '126');
INSERT INTO `rule_room_types` VALUES ('138', '127');
INSERT INTO `rule_room_types` VALUES ('138', '128');
INSERT INTO `rule_room_types` VALUES ('138', '129');
INSERT INTO `rule_room_types` VALUES ('139', '130');
INSERT INTO `rule_room_types` VALUES ('139', '131');
INSERT INTO `rule_room_types` VALUES ('139', '132');
INSERT INTO `rule_room_types` VALUES ('139', '133');
INSERT INTO `rule_room_types` VALUES ('139', '134');
INSERT INTO `rule_room_types` VALUES ('140', '135');
INSERT INTO `rule_room_types` VALUES ('140', '136');
INSERT INTO `rule_room_types` VALUES ('140', '137');
INSERT INTO `rule_room_types` VALUES ('140', '138');
INSERT INTO `rule_room_types` VALUES ('140', '139');
INSERT INTO `rule_room_types` VALUES ('141', '140');
INSERT INTO `rule_room_types` VALUES ('141', '141');
INSERT INTO `rule_room_types` VALUES ('141', '142');
INSERT INTO `rule_room_types` VALUES ('141', '143');
INSERT INTO `rule_room_types` VALUES ('141', '144');
INSERT INTO `rule_room_types` VALUES ('142', '145');
INSERT INTO `rule_room_types` VALUES ('142', '146');
INSERT INTO `rule_room_types` VALUES ('142', '147');
INSERT INTO `rule_room_types` VALUES ('142', '148');
INSERT INTO `rule_room_types` VALUES ('142', '149');
INSERT INTO `rule_room_types` VALUES ('149', '25');
INSERT INTO `rule_room_types` VALUES ('149', '26');
INSERT INTO `rule_room_types` VALUES ('149', '27');
INSERT INTO `rule_room_types` VALUES ('149', '28');
INSERT INTO `rule_room_types` VALUES ('149', '29');
INSERT INTO `rule_room_types` VALUES ('150', '30');
INSERT INTO `rule_room_types` VALUES ('150', '31');
INSERT INTO `rule_room_types` VALUES ('150', '32');
INSERT INTO `rule_room_types` VALUES ('150', '33');
INSERT INTO `rule_room_types` VALUES ('150', '34');
INSERT INTO `rule_room_types` VALUES ('151', '35');
INSERT INTO `rule_room_types` VALUES ('151', '36');
INSERT INTO `rule_room_types` VALUES ('151', '37');
INSERT INTO `rule_room_types` VALUES ('151', '38');
INSERT INTO `rule_room_types` VALUES ('151', '39');
INSERT INTO `rule_room_types` VALUES ('152', '40');
INSERT INTO `rule_room_types` VALUES ('152', '41');
INSERT INTO `rule_room_types` VALUES ('152', '42');
INSERT INTO `rule_room_types` VALUES ('152', '43');
INSERT INTO `rule_room_types` VALUES ('152', '44');
INSERT INTO `rule_room_types` VALUES ('153', '45');
INSERT INTO `rule_room_types` VALUES ('153', '46');
INSERT INTO `rule_room_types` VALUES ('153', '47');
INSERT INTO `rule_room_types` VALUES ('153', '48');
INSERT INTO `rule_room_types` VALUES ('153', '49');
INSERT INTO `rule_room_types` VALUES ('154', '50');
INSERT INTO `rule_room_types` VALUES ('154', '51');
INSERT INTO `rule_room_types` VALUES ('154', '52');
INSERT INTO `rule_room_types` VALUES ('154', '53');
INSERT INTO `rule_room_types` VALUES ('154', '54');
INSERT INTO `rule_room_types` VALUES ('155', '55');
INSERT INTO `rule_room_types` VALUES ('155', '56');
INSERT INTO `rule_room_types` VALUES ('155', '57');
INSERT INTO `rule_room_types` VALUES ('155', '58');
INSERT INTO `rule_room_types` VALUES ('155', '59');
INSERT INTO `rule_room_types` VALUES ('156', '60');
INSERT INTO `rule_room_types` VALUES ('156', '61');
INSERT INTO `rule_room_types` VALUES ('156', '62');
INSERT INTO `rule_room_types` VALUES ('156', '63');
INSERT INTO `rule_room_types` VALUES ('156', '64');
INSERT INTO `rule_room_types` VALUES ('157', '65');
INSERT INTO `rule_room_types` VALUES ('157', '66');
INSERT INTO `rule_room_types` VALUES ('157', '67');
INSERT INTO `rule_room_types` VALUES ('157', '68');
INSERT INTO `rule_room_types` VALUES ('157', '69');
INSERT INTO `rule_room_types` VALUES ('158', '70');
INSERT INTO `rule_room_types` VALUES ('158', '71');
INSERT INTO `rule_room_types` VALUES ('158', '72');
INSERT INTO `rule_room_types` VALUES ('158', '73');
INSERT INTO `rule_room_types` VALUES ('158', '74');
INSERT INTO `rule_room_types` VALUES ('159', '75');
INSERT INTO `rule_room_types` VALUES ('159', '76');
INSERT INTO `rule_room_types` VALUES ('159', '77');
INSERT INTO `rule_room_types` VALUES ('159', '78');
INSERT INTO `rule_room_types` VALUES ('159', '79');
INSERT INTO `rule_room_types` VALUES ('160', '80');
INSERT INTO `rule_room_types` VALUES ('160', '81');
INSERT INTO `rule_room_types` VALUES ('160', '82');
INSERT INTO `rule_room_types` VALUES ('160', '83');
INSERT INTO `rule_room_types` VALUES ('160', '84');
INSERT INTO `rule_room_types` VALUES ('161', '85');
INSERT INTO `rule_room_types` VALUES ('161', '86');
INSERT INTO `rule_room_types` VALUES ('161', '87');
INSERT INTO `rule_room_types` VALUES ('161', '88');
INSERT INTO `rule_room_types` VALUES ('161', '89');
INSERT INTO `rule_room_types` VALUES ('162', '90');
INSERT INTO `rule_room_types` VALUES ('162', '91');
INSERT INTO `rule_room_types` VALUES ('162', '92');
INSERT INTO `rule_room_types` VALUES ('162', '93');
INSERT INTO `rule_room_types` VALUES ('162', '94');
INSERT INTO `rule_room_types` VALUES ('163', '95');
INSERT INTO `rule_room_types` VALUES ('163', '96');
INSERT INTO `rule_room_types` VALUES ('163', '97');
INSERT INTO `rule_room_types` VALUES ('163', '98');
INSERT INTO `rule_room_types` VALUES ('163', '99');
INSERT INTO `rule_room_types` VALUES ('164', '100');
INSERT INTO `rule_room_types` VALUES ('164', '101');
INSERT INTO `rule_room_types` VALUES ('164', '102');
INSERT INTO `rule_room_types` VALUES ('164', '103');
INSERT INTO `rule_room_types` VALUES ('164', '104');
INSERT INTO `rule_room_types` VALUES ('165', '105');
INSERT INTO `rule_room_types` VALUES ('165', '106');
INSERT INTO `rule_room_types` VALUES ('165', '107');
INSERT INTO `rule_room_types` VALUES ('165', '108');
INSERT INTO `rule_room_types` VALUES ('165', '109');
INSERT INTO `rule_room_types` VALUES ('166', '110');
INSERT INTO `rule_room_types` VALUES ('166', '111');
INSERT INTO `rule_room_types` VALUES ('166', '112');
INSERT INTO `rule_room_types` VALUES ('166', '113');
INSERT INTO `rule_room_types` VALUES ('166', '114');
INSERT INTO `rule_room_types` VALUES ('167', '115');
INSERT INTO `rule_room_types` VALUES ('167', '116');
INSERT INTO `rule_room_types` VALUES ('167', '117');
INSERT INTO `rule_room_types` VALUES ('167', '118');
INSERT INTO `rule_room_types` VALUES ('167', '119');
INSERT INTO `rule_room_types` VALUES ('168', '120');
INSERT INTO `rule_room_types` VALUES ('168', '121');
INSERT INTO `rule_room_types` VALUES ('168', '122');
INSERT INTO `rule_room_types` VALUES ('168', '123');
INSERT INTO `rule_room_types` VALUES ('168', '124');
INSERT INTO `rule_room_types` VALUES ('169', '125');
INSERT INTO `rule_room_types` VALUES ('169', '126');
INSERT INTO `rule_room_types` VALUES ('169', '127');
INSERT INTO `rule_room_types` VALUES ('169', '128');
INSERT INTO `rule_room_types` VALUES ('169', '129');
INSERT INTO `rule_room_types` VALUES ('170', '130');
INSERT INTO `rule_room_types` VALUES ('170', '131');
INSERT INTO `rule_room_types` VALUES ('170', '132');
INSERT INTO `rule_room_types` VALUES ('170', '133');
INSERT INTO `rule_room_types` VALUES ('170', '134');
INSERT INTO `rule_room_types` VALUES ('171', '135');
INSERT INTO `rule_room_types` VALUES ('171', '136');
INSERT INTO `rule_room_types` VALUES ('171', '137');
INSERT INTO `rule_room_types` VALUES ('171', '138');
INSERT INTO `rule_room_types` VALUES ('171', '139');
INSERT INTO `rule_room_types` VALUES ('172', '140');
INSERT INTO `rule_room_types` VALUES ('172', '141');
INSERT INTO `rule_room_types` VALUES ('172', '142');
INSERT INTO `rule_room_types` VALUES ('172', '143');
INSERT INTO `rule_room_types` VALUES ('172', '144');
INSERT INTO `rule_room_types` VALUES ('173', '145');
INSERT INTO `rule_room_types` VALUES ('173', '146');
INSERT INTO `rule_room_types` VALUES ('173', '147');
INSERT INTO `rule_room_types` VALUES ('173', '148');
INSERT INTO `rule_room_types` VALUES ('173', '149');
INSERT INTO `rule_room_types` VALUES ('180', '25');
INSERT INTO `rule_room_types` VALUES ('180', '26');
INSERT INTO `rule_room_types` VALUES ('180', '27');
INSERT INTO `rule_room_types` VALUES ('180', '28');
INSERT INTO `rule_room_types` VALUES ('180', '29');
INSERT INTO `rule_room_types` VALUES ('181', '30');
INSERT INTO `rule_room_types` VALUES ('181', '31');
INSERT INTO `rule_room_types` VALUES ('181', '32');
INSERT INTO `rule_room_types` VALUES ('181', '33');
INSERT INTO `rule_room_types` VALUES ('181', '34');
INSERT INTO `rule_room_types` VALUES ('182', '35');
INSERT INTO `rule_room_types` VALUES ('182', '36');
INSERT INTO `rule_room_types` VALUES ('182', '37');
INSERT INTO `rule_room_types` VALUES ('182', '38');
INSERT INTO `rule_room_types` VALUES ('182', '39');
INSERT INTO `rule_room_types` VALUES ('183', '40');
INSERT INTO `rule_room_types` VALUES ('183', '41');
INSERT INTO `rule_room_types` VALUES ('183', '42');
INSERT INTO `rule_room_types` VALUES ('183', '43');
INSERT INTO `rule_room_types` VALUES ('183', '44');
INSERT INTO `rule_room_types` VALUES ('184', '45');
INSERT INTO `rule_room_types` VALUES ('184', '46');
INSERT INTO `rule_room_types` VALUES ('184', '47');
INSERT INTO `rule_room_types` VALUES ('184', '48');
INSERT INTO `rule_room_types` VALUES ('184', '49');
INSERT INTO `rule_room_types` VALUES ('185', '50');
INSERT INTO `rule_room_types` VALUES ('185', '51');
INSERT INTO `rule_room_types` VALUES ('185', '52');
INSERT INTO `rule_room_types` VALUES ('185', '53');
INSERT INTO `rule_room_types` VALUES ('185', '54');
INSERT INTO `rule_room_types` VALUES ('186', '55');
INSERT INTO `rule_room_types` VALUES ('186', '56');
INSERT INTO `rule_room_types` VALUES ('186', '57');
INSERT INTO `rule_room_types` VALUES ('186', '58');
INSERT INTO `rule_room_types` VALUES ('186', '59');
INSERT INTO `rule_room_types` VALUES ('187', '60');
INSERT INTO `rule_room_types` VALUES ('187', '61');
INSERT INTO `rule_room_types` VALUES ('187', '62');
INSERT INTO `rule_room_types` VALUES ('187', '63');
INSERT INTO `rule_room_types` VALUES ('187', '64');
INSERT INTO `rule_room_types` VALUES ('188', '65');
INSERT INTO `rule_room_types` VALUES ('188', '66');
INSERT INTO `rule_room_types` VALUES ('188', '67');
INSERT INTO `rule_room_types` VALUES ('188', '68');
INSERT INTO `rule_room_types` VALUES ('188', '69');
INSERT INTO `rule_room_types` VALUES ('189', '70');
INSERT INTO `rule_room_types` VALUES ('189', '71');
INSERT INTO `rule_room_types` VALUES ('189', '72');
INSERT INTO `rule_room_types` VALUES ('189', '73');
INSERT INTO `rule_room_types` VALUES ('189', '74');
INSERT INTO `rule_room_types` VALUES ('190', '75');
INSERT INTO `rule_room_types` VALUES ('190', '76');
INSERT INTO `rule_room_types` VALUES ('190', '77');
INSERT INTO `rule_room_types` VALUES ('190', '78');
INSERT INTO `rule_room_types` VALUES ('190', '79');
INSERT INTO `rule_room_types` VALUES ('191', '80');
INSERT INTO `rule_room_types` VALUES ('191', '81');
INSERT INTO `rule_room_types` VALUES ('191', '82');
INSERT INTO `rule_room_types` VALUES ('191', '83');
INSERT INTO `rule_room_types` VALUES ('191', '84');
INSERT INTO `rule_room_types` VALUES ('192', '85');
INSERT INTO `rule_room_types` VALUES ('192', '86');
INSERT INTO `rule_room_types` VALUES ('192', '87');
INSERT INTO `rule_room_types` VALUES ('192', '88');
INSERT INTO `rule_room_types` VALUES ('192', '89');
INSERT INTO `rule_room_types` VALUES ('193', '90');
INSERT INTO `rule_room_types` VALUES ('193', '91');
INSERT INTO `rule_room_types` VALUES ('193', '92');
INSERT INTO `rule_room_types` VALUES ('193', '93');
INSERT INTO `rule_room_types` VALUES ('193', '94');
INSERT INTO `rule_room_types` VALUES ('194', '95');
INSERT INTO `rule_room_types` VALUES ('194', '96');
INSERT INTO `rule_room_types` VALUES ('194', '97');
INSERT INTO `rule_room_types` VALUES ('194', '98');
INSERT INTO `rule_room_types` VALUES ('194', '99');
INSERT INTO `rule_room_types` VALUES ('195', '100');
INSERT INTO `rule_room_types` VALUES ('195', '101');
INSERT INTO `rule_room_types` VALUES ('195', '102');
INSERT INTO `rule_room_types` VALUES ('195', '103');
INSERT INTO `rule_room_types` VALUES ('195', '104');
INSERT INTO `rule_room_types` VALUES ('196', '105');
INSERT INTO `rule_room_types` VALUES ('196', '106');
INSERT INTO `rule_room_types` VALUES ('196', '107');
INSERT INTO `rule_room_types` VALUES ('196', '108');
INSERT INTO `rule_room_types` VALUES ('196', '109');
INSERT INTO `rule_room_types` VALUES ('197', '110');
INSERT INTO `rule_room_types` VALUES ('197', '111');
INSERT INTO `rule_room_types` VALUES ('197', '112');
INSERT INTO `rule_room_types` VALUES ('197', '113');
INSERT INTO `rule_room_types` VALUES ('197', '114');
INSERT INTO `rule_room_types` VALUES ('198', '115');
INSERT INTO `rule_room_types` VALUES ('198', '116');
INSERT INTO `rule_room_types` VALUES ('198', '117');
INSERT INTO `rule_room_types` VALUES ('198', '118');
INSERT INTO `rule_room_types` VALUES ('198', '119');
INSERT INTO `rule_room_types` VALUES ('199', '120');
INSERT INTO `rule_room_types` VALUES ('199', '121');
INSERT INTO `rule_room_types` VALUES ('199', '122');
INSERT INTO `rule_room_types` VALUES ('199', '123');
INSERT INTO `rule_room_types` VALUES ('199', '124');
INSERT INTO `rule_room_types` VALUES ('200', '125');
INSERT INTO `rule_room_types` VALUES ('200', '126');
INSERT INTO `rule_room_types` VALUES ('200', '127');
INSERT INTO `rule_room_types` VALUES ('200', '128');
INSERT INTO `rule_room_types` VALUES ('200', '129');
INSERT INTO `rule_room_types` VALUES ('201', '130');
INSERT INTO `rule_room_types` VALUES ('201', '131');
INSERT INTO `rule_room_types` VALUES ('201', '132');
INSERT INTO `rule_room_types` VALUES ('201', '133');
INSERT INTO `rule_room_types` VALUES ('201', '134');
INSERT INTO `rule_room_types` VALUES ('202', '135');
INSERT INTO `rule_room_types` VALUES ('202', '136');
INSERT INTO `rule_room_types` VALUES ('202', '137');
INSERT INTO `rule_room_types` VALUES ('202', '138');
INSERT INTO `rule_room_types` VALUES ('202', '139');
INSERT INTO `rule_room_types` VALUES ('203', '140');
INSERT INTO `rule_room_types` VALUES ('203', '141');
INSERT INTO `rule_room_types` VALUES ('203', '142');
INSERT INTO `rule_room_types` VALUES ('203', '143');
INSERT INTO `rule_room_types` VALUES ('203', '144');
INSERT INTO `rule_room_types` VALUES ('204', '145');
INSERT INTO `rule_room_types` VALUES ('204', '146');
INSERT INTO `rule_room_types` VALUES ('204', '147');
INSERT INTO `rule_room_types` VALUES ('204', '148');
INSERT INTO `rule_room_types` VALUES ('204', '149');

-- ----------------------------
-- Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `enabled` bit(1) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', '2026-03-24 11:27:29.000000', '202303680@bethlehem.edu', '', 'Muhammad', 'Ayyad', '$2a$10$mp9ykAQbo2AlCt1yWg9.HerK0q.Muq1DtW2mEcr2udJJwdsOTtEeO');
INSERT INTO `users` VALUES ('2', '2026-03-24 11:27:29.000000', '202303708@bethlehem.edu', '', 'Adam', 'Afandi', '$2a$10$XKZMctp/orhJ7x6r0eWsleU4edpTQDHOjRXMR5CzGA2shWZJwW5Ji');
INSERT INTO `users` VALUES ('3', '2026-03-24 11:27:30.000000', '202303862@bethlehem.edu', '', 'Baha', 'Eida', '$2a$10$yV3N34PhdOTmkxl2esiX2eycWUDquFCceuQffGF3AwSFzYdKmTUge');
INSERT INTO `users` VALUES ('4', '2026-03-24 11:27:30.000000', 'manager@hotel.com', '', 'Hotel', 'Manager', '$2a$10$jWwZw74FrPFysKX1UxkNYeZ6hlnn9/uOQDywKJ80.TuLX2fbstF6G');
INSERT INTO `users` VALUES ('5', '2026-03-24 11:27:30.000000', 'customer1@test.com', '', 'John', 'Doe', '$2a$10$XVwAubWb/EYyyDgorT3Wm.plk.7zTZYhM4J2fmiEWS1kPrpbWB20q');
INSERT INTO `users` VALUES ('6', '2026-03-24 11:27:30.000000', 'customer2@test.com', '', 'Jane', 'Smith', '$2a$10$64hX9DVMMIIjE589oL1VU.TZ6I9.y1rDyw6lGHLrm5Y22Vj0MmK.G');
INSERT INTO `users` VALUES ('7', '2026-03-24 11:27:30.000000', 'manager2@hotel.com', '', 'Hotel', 'Manager2', 'manager123');

-- ----------------------------
-- Table structure for `user_roles`
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `user_id` bigint(20) NOT NULL,
  `role` enum('CUSTOMER','ADMIN','HOTEL_MANAGER') DEFAULT NULL,
  KEY `FKhfh9dx7w3ubf1co1vdev94g3f` (`user_id`),
  CONSTRAINT `FKhfh9dx7w3ubf1co1vdev94g3f` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES ('1', 'ADMIN');
INSERT INTO `user_roles` VALUES ('2', 'ADMIN');
INSERT INTO `user_roles` VALUES ('3', 'ADMIN');
INSERT INTO `user_roles` VALUES ('4', 'HOTEL_MANAGER');
INSERT INTO `user_roles` VALUES ('5', 'CUSTOMER');
INSERT INTO `user_roles` VALUES ('6', 'CUSTOMER');
INSERT INTO `user_roles` VALUES ('7', 'HOTEL_MANAGER');

/*
Jacob Powers
DMQ Data Manipulation Queries For Project
10/21/18
*/
/*Add to Menu Page*/
SELECT * FROM meal 
SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal FROM menu INNER JOIN meal ON menu.menu_meal = meal.id
INSERT INTO menu(`restaurant_name`,`menu_meal`) VALUES (:restaurantName,:menuMealID)
SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal FROM menu INNER JOIN meal ON menu.menu_meal = meal.id WHERE menu.restaurant_name=:idFromJSFrontend
DELETE FROM menu WHERE id=:idFromDeleteFunction
SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal, meal.id AS meal_id FROM menu INNER JOIN meal ON menu.menu_meal = meal.id WHERE menu.id=:internalSelectFunction
UPDATE menu SET  restaurant_name = :nameFromTable , menu_meal = menuMealIDFromTable WHERE id = :idUpdateFunction;



/*Add to item Page*/
-- Propogate item table diplay select from item table and join pi and meal
SELECT * FROM meal
SELECT * FROM primary_ingredient //For dropdown
/*Propogates items table*/
SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i 
INNER JOIN meal m ON i.item_meal = m.id INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id;
INSERT INTO item(`name`,`description`,`price`,`item_meal`,`primary_ingredient`) VALUES (?,?,?,?,?)/*From insert item form*/ 
/*After insert will grab text names of item_meal and primary_ingredient*/
SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i 
INNER JOIN meal m ON i.item_meal = m.id INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id WHERE i.name = :itemNameFromPostData
DELETE FROM item WHERE id=:idFromDeleteFunction

/*Add items to menu*/
/* Gets restaurant names and menus for dropdown*/
SELECT menu.id, menu.restaurant_name, meal.name AS meal_name FROM menu INNER JOIN meal ON menu.menu_meal = meal.id
/*Gets items for selected menu table*/
SELECT item.id, item.name, item.price, item.description, primary_ingredient.name AS primary_ingredient, meal.name AS item_meal FROM menu_items mi 
INNER JOIN menu ON mi.mid = menu.id INNER JOIN item ON mi.iid = item.id 
INNER JOIN meal ON item.item_meal = meal.id 
INNER JOIN primary_ingredient ON item.primary_ingredient = primary_ingredient.id 
WHERE mi.mid =?;
/*Gets all items for all items table*/
SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i 
INNER JOIN meal m ON i.item_meal = m.id 
INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id
/*Add selected item to menu*/
INSERT IGNORE INTO menu_items(mid,iid)VALUES(?,?);
/*Then selects the entry with text names*/
SELECT i.id, i.name, i.price, i.description, m.name AS item_meal, pi.name AS primary_ingredient FROM item i 
INNER JOIN meal m ON i.item_meal = m.id 
INNER JOIN primary_ingredient pi ON i.primary_ingredient = pi.id WHERE i.id = ?;
/*Removes entry from table*/
DELETE FROM menu_items WHERE (`mid` = ?) and (`iid` = ?);

/*Add primary ingredient */
SELECT * FROM primary_ingredient ORDER BY id ASC
INSERT INTO primary_ingredient (name) VALUES (?)
DELETE FROM primary_ingredient WHERE id = ?

/*Add meal */
SELECT * FROM meal ORDER BY id ASC
INSERT INTO meal (name) VALUES (?)
DELETE FROM meal WHERE id = ?
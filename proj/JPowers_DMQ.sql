/*
Jacob Powers
DMQ Data Manipulation Queries For Project
10/21/18
*/


/*Add to item Page*/
-- Propogate item table diplay select from item table and join pi and meal
SELECT name, price, description FROM item 
LEFT JOIN meals_table ON item.item_meal = meals_table.id  
LEFT JOIN pi_table ON item.primary_ingredient = primary_ingredient 

-- add an item
INSERT INTO item (name, price, description) VALUES (:name_frm, :price_frm, :desc_frm, :item_meal_frm)
INSERT INTO meals_table(name) VALUES (:item_meal_frm)
INSERT INTO pi_table(name) VALUES (:primary_ingredient)

-- delete a item
DELETE FROM item WHERE id = :item_ID_selected_from_item_table
DELETE FROM meals_table WHERE id = :meal_ID_selected_deleted_item
DELETE FROM pi_table WHERE id = :primary_ingredient_selected_deleted_item

-- update item from table 
SELECT name, price, description, item_meal, primary_ingredient FROM item WHERE id = :id_item_from_table --Populate edit form
UPDATE item SET name = :name_frm, price = :price_frm, description =:desc_frm, item_meal = :item_meal_frm  WHERE id = :id_item_from_table
--more than likely the update will be handled by the back end javascript


/*Add to Menu Page*/
-- Propogate menu table display
SELECT name, restaurant_name, type FROM menu

SELECT menu.id, menu.restaurant_name, meal.name AS menu_meal FROM menu INNER JOIN meal ON menu.menu_meal = meal.id

INSERT INTO meal(`name`) VALUES (:KeyFromFrontEnd) ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)

DELETE FROM menu WHERE id= :menu_ID_selected_deleted_menu

SELECT restaurant_name, item_meal FROM menus WHERE id = :menu_id_from_table --Populate edit form

UPDATE meal SET name=? WHERE id = ? --Need to update individually 
UPDATE menu SET restaurant_name=? WHERE id = ?

/*Add to Add item to Menu Page*/
--Propogate menu select dropdown
SELECT restaurant_name, meal_type FROM menu

--Selects menu id from  menu name
SELECT id FROM menu WHERE :menu_id_is_equal_to_name_in_drop_down

--Propogate item table
SELECT name, price, description, item_meal, primary_ingredient from item

SELECT id from item where :item_id_is_equal_to_name_in_drop_down

INSERT INTO menu_item (mid, iid) VALUES (:menu_id_from_dropdown, :item_id_from_dropdown)

/*Display a Selected Menu*/
--Propogate menu select dropdown
SELECT name FROM menu

--Selects menu id from menu name
SELECT id FROM menu WHERE :menu_id_is_equal_to_name_in_drop_down

-- Get item from selected menu
SELECT name, price, description
FROM menus INNER JOIN menu_item ON  menu.id= mid
INNER JOIN item ON item.id = iid
